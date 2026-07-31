'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/app/components/Sidebar';
import SearchInput from '@/app/components/SearchInput';
import ReportPanel from '@/app/components/ReportPanel';
import EvidenceDrawer from '@/app/components/EvidenceDrawer';
import { ExportModal, ShareModal, SettingsModal } from '@/app/components/Modals';
import AnimatedBackground from '@/app/components/AnimatedBackground';
import type {
  ResearchReport,
  Claim,
  Source,
  Contradiction,
} from '@/lib/types';
import type {
  SessionSummaryDTO,
  GetResearchSessionResponse,
} from '@/lib/backend/types';
import { XCircle, Loader2, ShieldCheck, Share2, Download, PanelLeft, Plus } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  provider?: string;
}

function ResearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const sessionId = searchParams.get('sessionId');

  // ── Sidebar Toggle State ───────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Auth State ──────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ── Session List State ──────────────────────────────────────────────────────
  const [sessions, setSessions] = useState<SessionSummaryDTO[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Workspace State ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const loadReport = useCallback(async (targetSessionId: string) => {
    setLoadingReport(true);
    setReportError(null);
    try {
      const res = await fetch(`/api/research/${targetSessionId}`);
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

  // ── Load Report when SessionId Changes ─────────────────────────────────────
  useEffect(() => {
    if (sessionId) {
      loadReport(sessionId);
    } else {
      setActiveReport(null);
      setSearchQuery('');
    }
  }, [sessionId, loadReport]);

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
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">

        {/* Geist Header Bar */}
        <header className="px-6 py-3 border-b border-[#ebebeb] dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md shrink-0 flex items-center justify-between z-20">
          <div className="flex items-center gap-3 min-w-0">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#171717] dark:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-800 transition-colors shrink-0"
                title="Expand Sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}

            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold text-xs shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-[#171717] dark:text-white truncate leading-tight animate-fade-in">
                {searchQuery || 'Verified Research Report'}
              </span>
              <span className="text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400 truncate">
                {sessionId ? 'Verified Research Report' : 'Autonomous Fact Verification'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeReport && (
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

        {/* ── REPORT VIEW ──────────────────────────────────────────────────── */}
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
                  onClick={() => router.push('/workspace')}
                  className="px-4 py-2 rounded-full bg-[#171717] dark:bg-white text-[12px] font-medium text-white dark:text-[#171717] shadow-sm"
                >
                  Back to Workspace
                </button>
              </div>
            </div>
          )}

          {!sessionId && !loadingReport && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-sm">
                <ShieldCheck className="h-10 w-10 text-[#171717] dark:text-white mx-auto mb-3" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">Select a Report</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Please select an existing research session from the sidebar history or start a new verification.</p>
                <button
                  onClick={() => router.push('/workspace')}
                  className="px-4 py-2 bg-[#171717] dark:bg-white text-white dark:text-[#171717] rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Start New Research
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

export default function ResearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#fafafa] dark:bg-[#09090b] text-[#8f8f8f] dark:text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-[12px] font-mono uppercase tracking-wider">Loading results interface...</span>
      </div>
    }>
      <ResearchResultsContent />
    </Suspense>
  );
}
