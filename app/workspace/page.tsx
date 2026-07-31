'use client';

import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/app/components/Sidebar';
import SearchInput from '@/app/components/SearchInput';
import { SettingsModal } from '@/app/components/Modals';
import AnimatedBackground from '@/app/components/AnimatedBackground';
import type { SessionSummaryDTO } from '@/lib/backend/types';
import { Sparkles, Loader2, ShieldCheck, PanelLeft } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  provider?: string;
}

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Input & Search State ───────────────────────────────────────────────────
  const [questionError, setQuestionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Navigate to the research page to see execution and activity feed
      router.push(`/research?sessionId=${sessionId}&streamUrl=${encodeURIComponent(streamUrl)}`);
    } catch (e) {
      setQuestionError(e instanceof Error ? e.message : 'Submission failed');
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
      {/* Vercel Mesh Gradient Background */}
      <AnimatedBackground />

      {/* ── Left Sidebar ───────────────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        loadingSessions={loadingSessions}
        currentQueryId={null}
        onSelectSession={(sessionId) => router.push(`/research-results?sessionId=${sessionId}`)}
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
                Veriq AI Research Workspace
              </span>
              <span className="text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400 truncate">
                Multi-Agent Mesh v2.0
              </span>
            </div>
          </div>
        </header>

        {/* ── INPUT VIEW (Vercel Geist Hero Prompt Layout) ──────────────────── */}
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
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}
