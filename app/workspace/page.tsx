'use client';

import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/app/components/Sidebar';
import { SettingsModal } from '@/app/components/Modals';
import AnimatedBackground from '@/app/components/AnimatedBackground';
import type { SessionSummaryDTO } from '@/lib/backend/types';
import { Loader2, ShieldCheck, PanelLeft, ChevronDown, Send } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  provider?: string;
}

const PRESET_CHIPS = [
  'Does coffee reduce Alzheimer\'s risk?',
  'Will AI replace software engineers?',
  'Can renewable energy replace fossil fuels?',
  'Should I trust intermittent fasting?',
  'Is red light therapy effective?',
  'Does meditation improve memory?',
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
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
    if (trimmed.length > 2000) {
      setQuestionError('Question must not exceed 2000 characters.');
      return;
    }
    setQuestionError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          sourceScope: selectedSource, // academic, web, etc.
        }),
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

      {/* ── Left Sidebar (collapses to w-15 bar) ──────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        loadingSessions={loadingSessions}
        currentQueryId={null}
        onSelectSession={(sessionId) => router.push(`/research-results?sessionId=${sessionId}`)}
        onDeleteSession={handleDeleteSession}
        deletingId={deletingId}
        onNewResearch={() => {
          setSearchQuery('');
          setQuestionError('');
        }}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenSaved={() => router.push('/research-results')}
        userName={profile?.full_name}
        userEmail={profile?.email}
        onSignOut={handleSignOut}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">

        {/* Geist Header Bar - Hidden toggle panel button since sidebar now has its own top toggle button */}
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
              <span className="text-[13px] font-bold text-[#171717] dark:text-white truncate leading-tight">
                Veriq AI Research Workspace
              </span>
              <span className="text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400 truncate">
                Multi-Agent Mesh v2.0
              </span>
            </div>
          </div>
        </header>

        {/* ── REDESIGNED INPUT VIEW (MOCKUP ALIGNED) ────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
          <div className="w-full max-w-3xl space-y-7 text-center flex flex-col items-center select-none">
            
            {/* Logo Snowflake Box */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-zinc-900 dark:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m16.121-6.121L5.879 18.121m12.242 0L5.879 5.879" />
              </svg>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-[-0.75px] text-zinc-900 dark:text-white">
                Talk Veritas to Me
              </h1>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Choose a preset query below or write your own to start chatting with Veriq.
              </p>
            </div>

            {/* Preset Query Pills */}
            <div className="space-y-2.5 w-full">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Ask about:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                {PRESET_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(chip);
                      setQuestionError('');
                    }}
                    className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-1.5 text-[12px] text-zinc-600 dark:text-zinc-400 transition-all hover:border-zinc-900 dark:hover:border-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-[0.98]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Redesigned Large Input Box */}
            <div className="w-full text-left pt-4">
              <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all focus-within:border-zinc-400 dark:focus-within:border-zinc-500 focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <textarea
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value.slice(0, 2000));
                    if (questionError) setQuestionError('');
                  }}
                  placeholder="Ask Veriq a question or make a request..."
                  rows={3}
                  className="w-full bg-transparent text-[14px] text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none resize-none leading-relaxed font-sans"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitQuery(searchQuery);
                    }
                  }}
                />
                
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-3">
                  
                  {/* Select Source Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setSourceDropdownOpen(!sourceDropdownOpen)}
                      className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-800 px-3.5 py-1.5 text-[12px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750 transition-colors shadow-sm"
                    >
                      <span>{selectedSource}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                    </button>
                    {sourceDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setSourceDropdownOpen(false)} />
                        <div className="absolute left-0 bottom-full mb-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                          {['All Sources', 'Academic Papers', 'News & Web'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setSelectedSource(opt);
                                setSourceDropdownOpen(false);
                              }}
                              className={`w-full text-left rounded-lg px-3 py-2 text-[12px] transition-colors ${
                                selectedSource === opt
                                  ? 'bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Character count & Submit Button */}
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                      {searchQuery.length}/2000
                    </span>
                    <button
                      type="button"
                      disabled={!searchQuery.trim() || isSubmitting}
                      onClick={() => handleSubmitQuery(searchQuery)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              </div>

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
