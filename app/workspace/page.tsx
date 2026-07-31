'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/app/components/Sidebar';
import SearchInput from '@/app/components/SearchInput';
import LoadingWorkflow from '@/app/components/LoadingWorkflow';
import ActivityFeed from '@/app/components/ActivityFeed';
import ReportPanel from '@/app/components/ReportPanel';
import EvidenceDrawer from '@/app/components/EvidenceDrawer';
import { ExportModal, ShareModal, SettingsModal } from '@/app/components/Modals';
import AnimatedBackground from '@/app/components/AnimatedBackground';
import ThemeToggle from '@/app/components/ThemeToggle';
import type {
  AgentInfo,
  AgentId,
  LogEntry,
  ResearchReport,
  Claim,
  Source,
  Contradiction,
} from '@/lib/types';
import type {
  SessionSummaryDTO,
  GetResearchSessionResponse,
  SSEAgentEventPayload,
  SSEErrorPayload,
} from '@/lib/backend/types';
import { Sparkles, XCircle, RotateCcw, Loader2, ShieldCheck, Share2, Download, PanelLeft } from 'lucide-react';

const INITIAL_AGENTS: AgentInfo[] = [
  { id: 'orchestrator', name: 'Orchestrator', role: 'Central Controller', icon: '🧠', description: 'Coordinates execution graph.', status: 'idle', currentTask: 'Awaiting query...', progress: 0, durationMs: 0 },
  { id: 'strategist', name: 'Research Strategist', role: 'Decomposition', icon: '🗺', description: 'Decomposes questions into vectors.', status: 'idle', currentTask: 'Pending...', progress: 0, durationMs: 0 },
  { id: 'search', name: 'Search Specialist', role: 'Source Discovery', icon: '🔍', description: 'Queries search APIs and academic repos.', status: 'idle', currentTask: 'Pending...', progress: 0, durationMs: 0 },
  { id: 'analyst', name: 'Research Analyst', role: 'Document Reader', icon: '📚', description: 'Reads texts and builds research notes.', status: 'idle', currentTask: 'Pending...', progress: 0, durationMs: 0 },
  { id: 'evidence', name: 'Evidence Analyst', role: 'Claim Extractor', icon: '📝', description: 'Extracts atomic verifiable claims.', status: 'idle', currentTask: 'Pending...', progress: 0, durationMs: 0 },
  { id: 'verifier', name: 'Verification Specialist', role: 'Fact Checker', icon: '✅', description: 'Verifies claims against primary literature.', status: 'idle', currentTask: 'Pending...', progress: 0, durationMs: 0 },
  { id: 'contradiction', name: 'Contradiction Detector', role: 'Adversarial Challenger', icon: '⚔', description: 'Identifies conflicting data and sources.', status: 'idle', currentTask: 'Pending...', progress: 0, durationMs: 0 },
  { id: 'scorer', name: 'Confidence Scorer', role: 'Trust Evaluator', icon: '📊', description: 'Computes explainable confidence score.', status: 'idle', currentTask: 'Pending...', progress: 0, durationMs: 0 },
  { id: 'writer', name: 'Report Writer', role: 'Synthesis Generator', icon: '📄', description: 'Assembles evidence-backed report.', status: 'idle', currentTask: 'Pending...', progress: 0, durationMs: 0 },
];

interface Profile {
  id: string;
  email: string;
  full_name: string;
  provider?: string;
}

type ViewMode = 'input' | 'streaming' | 'report';

export default function WorkspacePage() {
  const router = useRouter();
  const supabase = createClient();

  // ── Sidebar Toggle State ───────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Auth State ──────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ── Session List State ──────────────────────────────────────────────────────
  const [sessions, setSessions] = useState<SessionSummaryDTO[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Workspace State ─────────────────────────────────────────────────────────
  const [view, setView] = useState<ViewMode>('input');
  const [searchQuery, setSearchQuery] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Real-Time Streaming State ───────────────────────────────────────────────
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // ── Report & Evidence State ─────────────────────────────────────────────────
  const [activeReport, setActiveReport] = useState<ResearchReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [inspectedClaim, setInspectedClaim] = useState<Claim | null>(null);

  // ── Modal States ────────────────────────────────────────────────────────────
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // ── Fetch Sessions from Real Backend ────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch('/api/research');
      if (!res.ok) return;
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch {
      // silently fail
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  // ── Auth Check ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function initUserAndSessions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setProfile({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Researcher',
        provider: user.app_metadata?.provider || 'email',
      });
      setLoadingAuth(false);
      await fetchSessions();
    }
    initUserAndSessions();
  }, [router, fetchSessions, supabase.auth]);

  // ── Map Backend Session Payload to Rich Frontend Report Model ──────────────
  const mapBackendResponseToReport = (data: GetResearchSessionResponse): ResearchReport => {
    const { session, sources, claims, contradictions } = data;

    const mappedClaims: Claim[] = claims.map((c) => ({
      id: c.aiClaimId || c.id,
      statement: c.claimText,
      status: (c.status as 'verified' | 'mixed' | 'unsupported') || 'verified',
      confidenceScore: c.confidenceScore ?? 85,
      reasoning: c.explanation || 'Verified against web and academic literature.',
      supportingSourceIds: sources.map((s) => s.aiSourceId),
      conflictingSourceIds: [],
      keyQuotes: c.explanation ? [c.explanation] : [],
      extractedByAgent: 'Evidence Analyst',
    }));

    const mappedSources: Source[] = sources.map((s) => ({
      id: s.aiSourceId || s.id,
      title: s.title,
      url: s.url,
      domain: s.url.replace(/^https?:\/\//, '').split('/')[0],
      authoritativeness: s.isGovAcad ? 'high' : 'medium',
      type: s.isGovAcad ? 'academic' : 'news',
      snippet: s.snippet || '',
      credibilityScore: s.reliabilityScore ?? 80,
    }));

    const mappedContradictions: Contradiction[] = contradictions.map((cnt) => ({
      id: cnt.id,
      topic: cnt.contradictionText,
      claimA: cnt.aiClaimId,
      sourceAId: cnt.aiSourceId,
      claimB: cnt.aiClaimId,
      sourceBId: cnt.aiSourceId,
      explanation: cnt.explanation,
      impactOnConfidence: -15,
    }));

    return {
      id: session.sessionId,
      query: session.question,
      timestamp: session.completedAt
        ? new Date(session.completedAt).toLocaleString()
        : new Date(session.createdAt).toLocaleString(),
      overallConfidence: {
        baseScore: 50,
        trustedSourceBonus: 20,
        peerReviewedBonus: 15,
        contradictionPenalty: contradictions.length > 0 ? -15 : 0,
        singleSourcePenalty: sources.length < 2 ? -10 : 0,
        finalScore: session.confidenceScore ?? 85,
        explanation: session.confidenceReasoning?.reason || 'Verified through multi-agent mesh analysis.',
      },
      executiveSummary: session.finalReport || 'Research synthesis completed.',
      verifiedClaims: mappedClaims,
      contradictions: mappedContradictions,
      recommendations: session.researchObjectives.length > 0
        ? session.researchObjectives
        : ['Verify additional sources if higher certainty is required.', 'Monitor ongoing updates on this research topic.'],
      sources: mappedSources,
      methodologyNotes: 'Orchestrator queried primary databases, extracted claims, verified sources, and evaluated confidence.',
    };
  };

  // ── Load a Session Report from Backend ─────────────────────────────────────
  const loadReport = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setLoadingReport(true);
    setReportError(null);
    setView('report');
    try {
      const res = await fetch(`/api/research/${sessionId}`);
      if (!res.ok) throw new Error('Failed to load research report');
      const data: GetResearchSessionResponse = await res.json();
      setActiveReport(mapBackendResponseToReport(data));
      setSearchQuery(data.session.question);
    } catch (e) {
      setReportError(e instanceof Error ? e.message : 'Error loading report');
    } finally {
      setLoadingReport(false);
    }
  }, []);

  // ── Helper to Map Agent Names to Node IDs ───────────────────────────────────
  const getAgentNodeId = (agentName: string): AgentId => {
    const n = agentName.toLowerCase();
    if (n.includes('strategist')) return 'strategist';
    if (n.includes('search')) return 'search';
    if (n.includes('analyst') && !n.includes('evidence')) return 'analyst';
    if (n.includes('evidence')) return 'evidence';
    if (n.includes('verif')) return 'verifier';
    if (n.includes('contradict')) return 'contradiction';
    if (n.includes('scor')) return 'scorer';
    if (n.includes('writer')) return 'writer';
    return 'orchestrator';
  };

  // ── Start SSE Stream Execution ─────────────────────────────────────────────
  const startStream = (sessionId: string, streamUrl: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setActiveSessionId(sessionId);
    setLogs([]);
    setAgents(INITIAL_AGENTS.map((a: AgentInfo) => ({ ...a, status: 'idle' })));
    setView('streaming');
    setIsSubmitting(false);
    setActiveReport(null);
    setStreamError(null);

    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.addEventListener('AGENT_EVENT', (e) => {
      try {
        const payload: SSEAgentEventPayload = JSON.parse(e.data);
        const nodeId = getAgentNodeId(payload.agentName);

        setAgents((prev) =>
          prev.map((agent) => {
            if (agent.id === nodeId) {
              return {
                ...agent,
                status: payload.status === 'running' ? 'running' : payload.status === 'completed' ? 'completed' : 'idle',
                outputSummary: payload.message,
              };
            }
            return agent;
          })
        );

        if (payload.status === 'running' || payload.status === 'completed') {
          setLogs((prev) => [
            ...prev,
            {
              id: `${payload.agentName}-${Date.now()}`,
              agentId: nodeId,
              timestamp: new Date().toLocaleTimeString(),
              message: payload.message,
              level: payload.status === 'completed' ? 'success' : 'info',
            },
          ]);
        }
      } catch {
        // ignore parse warnings
      }
    });

    es.addEventListener('COMPLETE', async () => {
      es.close();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      await fetchSessions();
      await loadReport(sessionId);
    });

    es.addEventListener('ERROR', (e) => {
      try {
        const payload: SSEErrorPayload = JSON.parse((e as MessageEvent).data);
        setStreamError(payload.error || 'Research execution failed');
      } catch {
        setStreamError('Pipeline error occurred while running research');
      }
      es.close();
      setSessions((prev) =>
        prev.map((s) => (s.sessionId === sessionId ? { ...s, status: 'failed' as const } : s))
      );
    });

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) {
        setStreamError('Connection closed. Results will be saved once processing completes.');
      }
    };
  };

  // ── Handle Research Question Submission ─────────────────────────────────────
  const handleSubmitQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (trimmed.length < 10) {
      setQuestionError('Please enter a research question of at least 10 characters.');
      return;
    }
    if (trimmed.length > 1000) {
      setQuestionError('Question must not exceed 1000 characters.');
      return;
    }
    setQuestionError('');
    setIsSubmitting(true);
    setStreamError(null);
    setSearchQuery(trimmed);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create research session');
      }

      const data = await res.json();
      const { sessionId, streamUrl } = data;

      setSessions((prev) => [
        {
          id: crypto.randomUUID(),
          sessionId,
          question: trimmed,
          status: 'running',
          confidenceScore: null,
          isBookmarked: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
        ...prev,
      ]);

      startStream(sessionId, streamUrl);
    } catch (e) {
      setStreamError(e instanceof Error ? e.message : 'Submission failed');
      setIsSubmitting(false);
    }
  };

  // ── Handle Session Deletion ────────────────────────────────────────────────
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this research session?')) return;
    setDeletingId(sessionId);
    try {
      const res = await fetch(`/api/research/${sessionId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setActiveReport(null);
        setView('input');
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  // ── Handle User Logout ──────────────────────────────────────────────────────
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#171717]" />
          <span className="text-[12px] font-mono text-[#8f8f8f] uppercase tracking-wider">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#171717] dark:text-zinc-100 font-sans overflow-hidden selection:bg-[#d3e5ff] dark:selection:bg-zinc-800 antialiased transition-colors duration-200">
      {/* Vercel Mesh Gradient Background */}
      <AnimatedBackground />

      {/* ── Left Sidebar ───────────────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        loadingSessions={loadingSessions}
        currentQueryId={activeSessionId}
        onSelectSession={loadReport}
        onDeleteSession={handleDeleteSession}
        deletingId={deletingId}
        onNewResearch={() => {
          setView('input');
          setActiveSessionId(null);
          setActiveReport(null);
          setStreamError(null);
          setSearchQuery('');
        }}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenSaved={() => setView('report')}
        userName={profile?.full_name}
        userEmail={profile?.email}
        onSignOut={handleSignOut}
      />

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">

        {/* Geist Header Bar */}
        <header className="px-6 py-3 border-b border-[#ebebeb] dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md shrink-0 flex items-center justify-between z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#171717] dark:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-800 transition-colors shrink-0"
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <PanelLeft className="h-4 w-4" />
            </button>

            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold text-xs shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-[#171717] dark:text-white truncate leading-tight">
                {view === 'input' ? 'Veriq AI Research Workspace' : searchQuery || 'Autonomous Fact Verification'}
              </span>
              <span className="text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400 truncate">
                {view === 'input' ? 'Multi-Agent Mesh v2.0' : view === 'streaming' ? 'Pipeline Executing...' : 'Verified Research Report'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeReport && view === 'report' && (
              <>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-3.5 py-1 text-[12px] font-medium rounded-full border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#171717] dark:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-4 py-1 text-[12px] font-medium rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 transition-all flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </button>
              </>
            )}
          </div>
        </header>

        {/* ── INPUT VIEW (Vercel Geist Hero Prompt Layout) ──────────────────── */}
        {view === 'input' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
            <div className="w-full max-w-3xl space-y-8 text-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1 text-[11px] font-mono font-medium text-[#171717] dark:text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#171717] dark:text-white" /> Autonomous Multi-Agent Verification System
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold tracking-[-1.28px] text-[#171717] dark:text-white leading-tight">
                  Verify Any Fact With <span className="underline decoration-[#171717]/20 dark:decoration-white/20 underline-offset-8">Multi-Agent AI</span>
                </h1>

                <p className="text-[15px] text-[#4d4d4d] dark:text-zinc-400 leading-relaxed font-sans max-w-lg mx-auto">
                  Ask any question. Veriq orchestrates 8 autonomous AI nodes to search primary literature, extract evidence, detect contradictions, and synthesize a verified report.
                </p>
              </div>

              {/* Centered Main Chatbot Search Input */}
              <div className="w-full text-left">
                <SearchInput
                  onSearch={handleSubmitQuery}
                  onSelectPreset={(q) => handleSubmitQuery(q)}
                  isExecuting={isSubmitting}
                />
                {questionError && <p className="mt-2 text-center text-[12px] text-rose-600 font-mono">{questionError}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── STREAMING VIEW ───────────────────────────────────────────────── */}
        {view === 'streaming' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Error Display */}
            {streamError && (
              <div className="rounded-[12px] border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-4 flex items-start gap-3 text-xs">
                <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-900 dark:text-rose-200">Research Pipeline Error</p>
                  <p className="text-rose-700 dark:text-rose-300 mt-1">{streamError}</p>
                  <button
                    onClick={() => { setView('input'); setStreamError(null); }}
                    className="mt-2 inline-flex items-center gap-1 font-medium text-rose-800 dark:text-rose-300 hover:text-rose-950 dark:hover:text-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Return to Input
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Multi-Agent Mesh Topology */}
              <div className="lg:col-span-7">
                <LoadingWorkflow agents={agents} />
              </div>

              {/* Right Column: Live Terminal Activity Feed */}
              <div className="lg:col-span-5 h-[360px] lg:h-auto">
                <ActivityFeed logs={logs} />
              </div>
            </div>
          </div>
        )}

        {/* ── REPORT VIEW ──────────────────────────────────────────────────── */}
        {view === 'report' && (
          <div className="flex-1 overflow-y-auto p-6">
            {loadingReport && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#171717] dark:text-white" />
                  <span className="font-mono text-[12px] text-[#8f8f8f] dark:text-zinc-400">Fetching Verified Report...</span>
                </div>
              </div>
            )}

            {reportError && !loadingReport && (
              <div className="flex h-full items-center justify-center">
                <div className="rounded-[16px] border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-8 text-center max-w-md space-y-3">
                  <XCircle className="h-10 w-10 text-rose-600 dark:text-rose-400 mx-auto" />
                  <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">Report Not Found</h3>
                  <p className="text-[13px] text-rose-700 dark:text-rose-300">{reportError}</p>
                  <button
                    onClick={() => setView('input')}
                    className="px-4 py-2 rounded-full bg-[#171717] dark:bg-white text-[12px] font-medium text-white dark:text-[#171717] shadow-sm"
                  >
                    Back to Workspace
                  </button>
                </div>
              </div>
            )}

            {activeReport && !loadingReport && !reportError && (
              <ReportPanel
                report={activeReport}
                onInspectClaim={(claim) => setInspectedClaim(claim)}
                onExportPDF={() => setShowExportModal(true)}
                onShareReport={() => setShowShareModal(true)}
              />
            )}
          </div>
        )}

        {/* ── STICKY BOTTOM SEARCH BAR (Vercel Geist Footer for Streaming & Report views) ── */}
        {view !== 'input' && (
          <footer className="px-6 py-2.5 border-t border-[#ebebeb] dark:border-zinc-800 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md shrink-0 z-20">
            <SearchInput
              onSearch={handleSubmitQuery}
              onSelectPreset={(q) => handleSubmitQuery(q)}
              isExecuting={isSubmitting || view === 'streaming'}
              compact
            />
            {questionError && <p className="mt-1 text-center text-[12px] text-rose-600 font-mono">{questionError}</p>}
          </footer>
        )}
      </main>

      {/* ── Side Evidence Drawer ───────────────────────────────────────────── */}
      {inspectedClaim && activeReport && (
        <EvidenceDrawer
          claim={inspectedClaim}
          sources={activeReport.sources}
          contradictions={activeReport.contradictions}
          onClose={() => setInspectedClaim(null)}
        />
      )}

      {/* ── Export, Share, and Settings Modals ─────────────────────────────── */}
      {showExportModal && (
        <ExportModal report={activeReport} onClose={() => setShowExportModal(false)} />
      )}

      {showShareModal && (
        <ShareModal report={activeReport} onClose={() => setShowShareModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}
