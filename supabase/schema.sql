-- =============================================================================
-- Veriq — Supabase PostgreSQL Schema
-- Version : 1.0.0
-- Idempotent: safe to re-run in Supabase SQL Editor
-- =============================================================================

-- Enable UUID extension (already present in Supabase, but guard it)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- SECTION 1 — HELPER FUNCTIONS
-- =============================================================================

-- auto-update updated_at on any table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auto-set completed_at the first time status transitions to 'completed' or 'failed'
CREATE OR REPLACE FUNCTION set_completed_at_on_terminal_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('completed', 'failed')
     AND OLD.status NOT IN ('completed', 'failed')
  THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- sync every new auth.users row into public.profiles
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, provider)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- SECTION 2 — TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles
-- Mirrors auth.users for application-level user metadata.
-- Populated automatically by the on_auth_user_created trigger.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  provider    TEXT,                    -- 'email' | 'google' etc.
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.profiles IS
  'Application-level user profiles. Auto-synced from auth.users via trigger.';

-- -----------------------------------------------------------------------------
-- research_sessions
-- Root entity for every invocation of runResearchGraph().
-- One row is created before the AI run and updated as the pipeline progresses.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research_sessions (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- session_id is the AI-generated string key passed into runResearchGraph().
  -- All child tables (sources, claims, contradictions, agent_logs) FK to this.
  session_id           TEXT        NOT NULL UNIQUE,
  user_id              UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question             TEXT        NOT NULL,
  status               TEXT        NOT NULL DEFAULT 'idle',
  retry_count          INTEGER     NOT NULL DEFAULT 0,
  -- JSONB: string[] — array of search objectives produced by Strategist node
  research_objectives  JSONB,
  -- Full markdown research notes produced by Analyst node (~10K chars)
  research_notes       TEXT,
  confidence_score     INTEGER     CHECK (confidence_score BETWEEN 0 AND 100),
  -- JSONB: { score: number, reason: string, supportingFactors: string[], detractingFactors: string[] }
  confidence_reasoning JSONB,
  -- Full markdown verification report produced by Writer node
  final_report         TEXT,
  -- Forward-compatibility columns: not used in MVP but present to avoid migrations
  is_bookmarked        BOOLEAN     NOT NULL DEFAULT FALSE,
  is_public            BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at         TIMESTAMPTZ,

  CONSTRAINT research_sessions_status_check
    CHECK (status IN ('idle', 'running', 'completed', 'failed'))
);

-- Ensure research_sessions user_id FK points directly to auth.users(id) even on re-runs over existing schema
ALTER TABLE public.research_sessions DROP CONSTRAINT IF EXISTS research_sessions_user_id_fkey;
ALTER TABLE public.research_sessions
  ADD CONSTRAINT research_sessions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill profiles for any pre-existing auth.users
INSERT INTO public.profiles (id, email, full_name, avatar_url, provider)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url',
  raw_app_meta_data->>'provider'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE  public.research_sessions IS
  'Root research session entity. One row per runResearchGraph() invocation.';
COMMENT ON COLUMN public.research_sessions.session_id IS
  'AI-generated string key (crypto.randomUUID()). Used as FK by all child tables.';
COMMENT ON COLUMN public.research_sessions.confidence_reasoning IS
  'JSON shape: { score, reason, supportingFactors[], detractingFactors[] }';
COMMENT ON COLUMN public.research_sessions.is_bookmarked IS
  'Forward-compatibility: user can star/bookmark sessions.';
COMMENT ON COLUMN public.research_sessions.is_public IS
  'Forward-compatibility: public report sharing via link.';

-- -----------------------------------------------------------------------------
-- sources
-- One row per web source discovered by the Search Specialist node.
-- ai_source_id mirrors the AI-generated Source.id (e.g. "src-1748...-0").
-- Immutable after session status = 'completed'.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sources (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- AI-generated Source.id — referenced by contradictions.ai_source_id
  ai_source_id      TEXT        NOT NULL,
  session_id        TEXT        NOT NULL REFERENCES public.research_sessions(session_id) ON DELETE CASCADE,
  title             TEXT        NOT NULL DEFAULT 'Untitled Source',
  url               TEXT        NOT NULL,
  snippet           TEXT,                 -- Firecrawl-enriched content (≤2000 chars)
  reliability_score INTEGER     CHECK (reliability_score BETWEEN 0 AND 100),
  is_gov_acad       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate source inserts across retry cycles
  CONSTRAINT sources_session_ai_source_unique UNIQUE (session_id, ai_source_id)
);

COMMENT ON TABLE  public.sources IS
  'Web sources from Search Specialist. ai_source_id is the AI string key referenced by contradictions.';
COMMENT ON COLUMN public.sources.ai_source_id IS
  'e.g. "src-{timestamp}-{index}". Soft FK target for contradictions.ai_source_id.';

-- -----------------------------------------------------------------------------
-- claims
-- One row per atomic factual claim extracted by Evidence Analyst
-- and verified by Verification Specialist.
-- ai_claim_id mirrors the AI-generated Claim.id (e.g. "claim-0").
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.claims (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- AI-generated Claim.id — referenced by contradictions.ai_claim_id
  ai_claim_id      TEXT        NOT NULL,
  session_id       TEXT        NOT NULL REFERENCES public.research_sessions(session_id) ON DELETE CASCADE,
  claim_text       TEXT        NOT NULL,
  status           TEXT        CHECK (status IN ('verified', 'mixed', 'unsupported')),
  explanation      TEXT,
  -- Optional: typed in Claim interface but not currently populated by any node
  confidence_score INTEGER     CHECK (confidence_score BETWEEN 0 AND 100),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT claims_session_ai_claim_unique UNIQUE (session_id, ai_claim_id)
);

COMMENT ON TABLE  public.claims IS
  'Atomic claims from Evidence Analyst, enriched with status by Verification Specialist.';
COMMENT ON COLUMN public.claims.ai_claim_id IS
  'e.g. "claim-0", "claim-1". Soft FK target for contradictions.ai_claim_id.';
COMMENT ON COLUMN public.claims.confidence_score IS
  'Optional per-claim score. Not populated by any current AI node; reserved for future use.';

-- -----------------------------------------------------------------------------
-- contradictions
-- One row per detected contradiction from the Contradiction Detector node.
-- Uses soft logical references to claims and sources via AI string IDs
-- (not hard FK constraints) because the parallel fan-out means contradictions
-- may be inserted before claims finish committing.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contradictions (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id         TEXT        NOT NULL REFERENCES public.research_sessions(session_id) ON DELETE CASCADE,
  -- Soft FK → claims.ai_claim_id
  ai_claim_id        TEXT        NOT NULL,
  -- Soft FK → sources.ai_source_id
  ai_source_id       TEXT        NOT NULL,
  contradiction_text TEXT        NOT NULL,
  explanation        TEXT        NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.contradictions IS
  'Adversarial findings from Contradiction Detector. Soft refs to claims and sources via AI string IDs.';
COMMENT ON COLUMN public.contradictions.ai_claim_id IS
  'Soft FK to claims.ai_claim_id. No hard constraint: parallel fan-out safety.';
COMMENT ON COLUMN public.contradictions.ai_source_id IS
  'Soft FK to sources.ai_source_id.';

-- -----------------------------------------------------------------------------
-- agent_logs
-- Append-only event log. One row per AgentEvent fired by executeNodeStep().
-- Written in real-time via the onAgentEvent callback during graph execution.
-- NEVER updated after insert.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT        NOT NULL REFERENCES public.research_sessions(session_id) ON DELETE CASCADE,
  agent_name  TEXT        NOT NULL,
  status      TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  -- Partial state snapshot or error details from event.outputData
  output_data JSONB,
  duration_ms INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT agent_logs_status_check
    CHECK (status IN ('waiting', 'running', 'completed', 'failed'))
);

COMMENT ON TABLE public.agent_logs IS
  'Append-only real-time event log. Powered by executeNodeStep() → onAgentEvent callback. Never updated.';

-- =============================================================================
-- SECTION 3 — INDEXES
-- =============================================================================

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON public.profiles(email);

-- research_sessions
CREATE INDEX IF NOT EXISTS idx_research_sessions_user_id
  ON public.research_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_research_sessions_status
  ON public.research_sessions(status);
CREATE INDEX IF NOT EXISTS idx_research_sessions_created_at
  ON public.research_sessions(created_at DESC);
-- session_id already has a UNIQUE index from the constraint

-- sources
CREATE INDEX IF NOT EXISTS idx_sources_session_id
  ON public.sources(session_id);
CREATE INDEX IF NOT EXISTS idx_sources_ai_source_id
  ON public.sources(ai_source_id);
CREATE INDEX IF NOT EXISTS idx_sources_reliability_score
  ON public.sources(reliability_score);

-- claims
CREATE INDEX IF NOT EXISTS idx_claims_session_id
  ON public.claims(session_id);
CREATE INDEX IF NOT EXISTS idx_claims_ai_claim_id
  ON public.claims(ai_claim_id);
CREATE INDEX IF NOT EXISTS idx_claims_status
  ON public.claims(status);

-- contradictions
CREATE INDEX IF NOT EXISTS idx_contradictions_session_id
  ON public.contradictions(session_id);
CREATE INDEX IF NOT EXISTS idx_contradictions_ai_claim_id
  ON public.contradictions(ai_claim_id);
CREATE INDEX IF NOT EXISTS idx_contradictions_ai_source_id
  ON public.contradictions(ai_source_id);

-- agent_logs
CREATE INDEX IF NOT EXISTS idx_agent_logs_session_id
  ON public.agent_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_session_created_at
  ON public.agent_logs(session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_name
  ON public.agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_logs_status
  ON public.agent_logs(status);

-- =============================================================================
-- SECTION 4 — TRIGGERS
-- =============================================================================

-- profiles: auto-update updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- research_sessions: auto-update updated_at
DROP TRIGGER IF EXISTS trg_research_sessions_updated_at ON public.research_sessions;
CREATE TRIGGER trg_research_sessions_updated_at
  BEFORE UPDATE ON public.research_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- research_sessions: auto-set completed_at on terminal status
DROP TRIGGER IF EXISTS trg_research_sessions_completed_at ON public.research_sessions;
CREATE TRIGGER trg_research_sessions_completed_at
  BEFORE UPDATE ON public.research_sessions
  FOR EACH ROW EXECUTE FUNCTION set_completed_at_on_terminal_status();

-- auth.users → profiles: sync new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- SECTION 5 — ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contradictions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs          ENABLE ROW LEVEL SECURITY;

-- ── profiles ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles: users select own"  ON public.profiles;
CREATE POLICY "profiles: users select own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: users insert own"  ON public.profiles;
CREATE POLICY "profiles: users insert own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: users update own"  ON public.profiles;
CREATE POLICY "profiles: users update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── research_sessions ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "research_sessions: users select own"  ON public.research_sessions;
CREATE POLICY "research_sessions: users select own"
  ON public.research_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "research_sessions: users insert own"  ON public.research_sessions;
CREATE POLICY "research_sessions: users insert own"
  ON public.research_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "research_sessions: users update own"  ON public.research_sessions;
CREATE POLICY "research_sessions: users update own"
  ON public.research_sessions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "research_sessions: users delete own"  ON public.research_sessions;
CREATE POLICY "research_sessions: users delete own"
  ON public.research_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ── sources ───────────────────────────────────────────────────────────────────
-- Child table RLS: access permitted if the parent session belongs to the user.
DROP POLICY IF EXISTS "sources: users select via session"  ON public.sources;
CREATE POLICY "sources: users select via session"
  ON public.sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.research_sessions rs
      WHERE rs.session_id = sources.session_id
        AND rs.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "sources: users insert via session"  ON public.sources;
CREATE POLICY "sources: users insert via session"
  ON public.sources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.research_sessions rs
      WHERE rs.session_id = sources.session_id
        AND rs.user_id = auth.uid()
    )
  );

-- ── claims ────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "claims: users select via session"  ON public.claims;
CREATE POLICY "claims: users select via session"
  ON public.claims FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.research_sessions rs
      WHERE rs.session_id = claims.session_id
        AND rs.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "claims: users insert via session"  ON public.claims;
CREATE POLICY "claims: users insert via session"
  ON public.claims FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.research_sessions rs
      WHERE rs.session_id = claims.session_id
        AND rs.user_id = auth.uid()
    )
  );

-- ── contradictions ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "contradictions: users select via session"  ON public.contradictions;
CREATE POLICY "contradictions: users select via session"
  ON public.contradictions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.research_sessions rs
      WHERE rs.session_id = contradictions.session_id
        AND rs.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "contradictions: users insert via session"  ON public.contradictions;
CREATE POLICY "contradictions: users insert via session"
  ON public.contradictions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.research_sessions rs
      WHERE rs.session_id = contradictions.session_id
        AND rs.user_id = auth.uid()
    )
  );

-- ── agent_logs ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "agent_logs: users select via session"  ON public.agent_logs;
CREATE POLICY "agent_logs: users select via session"
  ON public.agent_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.research_sessions rs
      WHERE rs.session_id = agent_logs.session_id
        AND rs.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "agent_logs: users insert via session"  ON public.agent_logs;
CREATE POLICY "agent_logs: users insert via session"
  ON public.agent_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.research_sessions rs
      WHERE rs.session_id = agent_logs.session_id
        AND rs.user_id = auth.uid()
    )
  );

-- =============================================================================
-- SECTION 6 — GRANTS & PERMISSIONS
-- =============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated;
