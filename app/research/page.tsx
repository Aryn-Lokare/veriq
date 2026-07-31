'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/app/components/Sidebar';
import SearchInput from '@/app/components/SearchInput';
import LoadingWorkflow from '@/app/components/LoadingWorkflow';
import ActivityFeed from '@/app/components/ActivityFeed';
import { SettingsModal } from '@/app/components/Modals';
import AnimatedBackground from '@/app/components/AnimatedBackground';
import type {
  AgentInfo,
  AgentId,
  LogEntry,
} from '@/lib/types';
import type {
  SessionSummaryDTO,
  SSEAgentEventPayload,
  SSEErrorPayload,
} from '@/lib/backend/types';
import { XCircle, RotateCcw, Loader2, ShieldCheck, PanelLeft } from 'lucide-react';

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

function ResearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const sessionId = searchParams.get('sessionId');
  const streamUrl = searchParams.get('streamUrl');

  // ── Sidebar Toggle State ───────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Auth State ──────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ── Session List State ──────────────────────────────────────────────────────
  const [sessions, setSessions] = useState<SessionSummaryDTO[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Real-Time Streaming State ───────────────────────────────────────────────
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionError, setQuestionError] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);

  // ── Modal States ────────────────────────────────────────────────────────────
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

  // ── Handle SSE Connection ──────────────────────────────────────────────────
  useEffect(() => {
    if (!streamUrl || !sessionId) return;

    // Reset state for new stream
    setLogs([]);
    setAgents(INITIAL_AGENTS.map((a: AgentInfo) => ({ ...a, status: 'idle', outputSummary: undefined })));
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
      // Redirect to the final results view
      router.push(`/research-results?sessionId=${sessionId}`);
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

    return () => {
      es.close();
    };
  }, [streamUrl, sessionId, router, fetchSessions]);

  // ── Handle Research Question Submission (From sticky bottom search bar) ───
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
      const { sessionId: newSessionId, streamUrl: newStreamUrl } = data;

      // Navigate to the research page with the new parameters
      router.push(`/research?sessionId=${newSessionId}&streamUrl=${encodeURIComponent(newStreamUrl)}`);
    } catch (e) {
      setQuestionError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Handle Session Deletion ────────────────────────────────────────────────
  const handleDeleteSession = async (targetSessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this research session?')) return;
    setDeletingId(targetSessionId);
    try {
      const res = await fetch(`/api/research/${targetSessionId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSessions((prev) => prev.filter((s) => s.sessionId !== targetSessionId));
      if (sessionId === targetSessionId) {
        router.push('/workspace');
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
      <div className="flex h-screen items-center justify-center bg-[#fafafa] dark:bg-[#09090b]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#171717] dark:text-white" />
          <span className="text-[12px] font-mono text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  if (!sessionId || !streamUrl) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa] dark:bg-[#09090b]">
        <div className="text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-sm">
          <XCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">Missing Parameters</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">You must enter a research question from the workspace input view first.</p>
          <button
            onClick={() => router.push('/workspace')}
            className="px-4 py-2 bg-[#171717] dark:bg-white text-white dark:text-[#171717] rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Workspace
          </button>
        </div>
      </div>
    );
  }

  // Find current session query text
  const currentSession = sessions.find((s) => s.sessionId === sessionId);
  const activeQueryText = currentSession?.question || 'Autonomous Multi-Agent Fact Verification';

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#171717] dark:text-zinc-100 font-sans overflow-hidden selection:bg-[#d3e5ff] dark:selection:bg-zinc-800 antialiased transition-colors duration-200">
      {/* Background canvas particles */}
      <AnimatedBackground />

      {/* ── Left Sidebar ───────────────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        loadingSessions={loadingSessions}
        currentQueryId={sessionId}
        onSelectSession={(id) => router.push(`/research-results?sessionId=${id}`)}
        onDeleteSession={handleDeleteSession}
        deletingId={deletingId}
        onNewResearch={() => router.push('/workspace')}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenSaved={() => router.push('/research-results')}
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
                {activeQueryText}
              </span>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 truncate animate-pulse">
                Pipeline Executing...
              </span>
            </div>
          </div>
        </header>

        {/* ── STREAMING VIEW ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Display */}
          {streamError && (
            <div className="rounded-[12px] border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-4 flex items-start gap-3 text-xs">
              <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900 dark:text-rose-200">Research Pipeline Error</p>
                <p className="text-rose-700 dark:text-rose-300 mt-1">{streamError}</p>
                <button
                  onClick={() => { router.push('/workspace'); }}
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

        {/* ── STICKY BOTTOM SEARCH BAR ── */}
        <footer className="px-6 py-2.5 border-t border-[#ebebeb] dark:border-zinc-800 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md shrink-0 z-20">
          <SearchInput
            onSearch={handleSubmitQuery}
            onSelectPreset={(q) => handleSubmitQuery(q)}
            isExecuting={isSubmitting}
            compact
          />
          {questionError && <p className="mt-1 text-center text-[12px] text-rose-600 font-mono">{questionError}</p>}
        </footer>
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}

export default function ResearchPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#fafafa] dark:bg-[#09090b] text-[#8f8f8f] dark:text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-[12px] font-mono uppercase tracking-wider">Loading workflow interface...</span>
      </div>
    }>
      <ResearchContent />
    </Suspense>
  );
}
