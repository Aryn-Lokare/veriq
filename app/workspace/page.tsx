'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LogOut,
  Sparkles,
  User,
  Send,
  Trash2,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  FileText,
  Layers,
  ShieldCheck,
  Search,
  Brain,
  Cpu,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import type {
  SessionSummaryDTO,
  GetResearchSessionResponse,
  SSEAgentEventPayload,
  SSEErrorPayload,
  SourceDTO,
  ClaimDTO,
  ContradictionDTO,
} from '@/lib/backend/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  email: string;
  full_name: string;
  provider?: string;
}

type View = 'input' | 'streaming' | 'report';

// ── Agent Icon Map ────────────────────────────────────────────────────────────

function AgentIcon({ agentName, className = 'h-3.5 w-3.5' }: { agentName: string; className?: string }) {
  const n = agentName.toLowerCase();
  if (n.includes('strategist')) return <Layers className={`${className} text-blue-500`} />;
  if (n.includes('search')) return <Search className={`${className} text-violet-500`} />;
  if (n.includes('analyst') && !n.includes('evidence')) return <FileText className={`${className} text-pink-500`} />;
  if (n.includes('evidence')) return <TrendingUp className={`${className} text-amber-500`} />;
  if (n.includes('verif')) return <ShieldCheck className={`${className} text-emerald-500`} />;
  if (n.includes('contradict')) return <AlertTriangle className={`${className} text-red-500`} />;
  if (n.includes('scor')) return <Cpu className={`${className} text-teal-500`} />;
  if (n.includes('writer')) return <Sparkles className={`${className} text-purple-500`} />;
  return <Brain className={`${className} text-cyan-500`} />;
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const base = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider';
  if (status === 'completed')
    return <span className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-100`}><CheckCircle className="h-2.5 w-2.5" />Done</span>;
  if (status === 'running')
    return <span className={`${base} bg-blue-50 text-blue-700 border border-blue-100`}><Loader2 className="h-2.5 w-2.5 animate-spin" />Running</span>;
  if (status === 'failed')
    return <span className={`${base} bg-red-50 text-red-700 border border-red-100`}><XCircle className="h-2.5 w-2.5" />Failed</span>;
  return <span className={`${base} bg-[#f5f5f5] text-[#8f8f8f] border border-[#ebebeb]`}><Clock className="h-2.5 w-2.5" />{status}</span>;
}

// ── Agent Log Status Dot ──────────────────────────────────────────────────────

function LogDot({ status }: { status: string }) {
  if (status === 'completed') return <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />;
  if (status === 'running')   return <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400 animate-pulse" />;
  if (status === 'failed')    return <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400" />;
  return <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#d4d4d4]" />;
}

// ── Confidence Meter ──────────────────────────────────────────────────────────

function ConfidenceMeter({ score }: { score: number }) {
  const color =
    score >= 70 ? 'bg-emerald-500' :
    score >= 40 ? 'bg-amber-500' :
    'bg-red-500';
  const label =
    score >= 70 ? 'High Confidence' :
    score >= 40 ? 'Moderate Confidence' :
    'Low Confidence';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-mono text-[#8f8f8f] uppercase tracking-wider">Confidence Score</span>
        <span className="text-[22px] font-bold tracking-tight text-[#171717]">{score}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[#f0f0f0] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className={`text-[11px] font-mono ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
        {label}
      </p>
    </div>
  );
}

// ── Claim Card ────────────────────────────────────────────────────────────────

function ClaimCard({ claim }: { claim: ClaimDTO }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor =
    claim.status === 'verified' ? 'border-emerald-200 bg-emerald-50/60' :
    claim.status === 'mixed'    ? 'border-amber-200 bg-amber-50/60' :
    claim.status === 'unsupported' ? 'border-red-200 bg-red-50/60' :
    'border-[#ebebeb] bg-white';
  const statusIcon =
    claim.status === 'verified' ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> :
    claim.status === 'mixed'    ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" /> :
    claim.status === 'unsupported' ? <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" /> :
    <Clock className="h-3.5 w-3.5 text-[#a1a1a1] shrink-0" />;

  return (
    <div className={`rounded-[8px] border p-3.5 ${statusColor}`}>
      <div className="flex items-start gap-2.5">
        {statusIcon}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[#171717] leading-relaxed">{claim.claimText}</p>
          {claim.explanation && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 flex items-center gap-1 text-[11px] font-mono text-[#8f8f8f] hover:text-[#171717] transition-colors"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? 'Hide' : 'Show'} reasoning
            </button>
          )}
          {expanded && claim.explanation && (
            <p className="mt-2 text-[12px] text-[#4d4d4d] leading-relaxed border-t border-black/5 pt-2">
              {claim.explanation}
            </p>
          )}
        </div>
        {claim.status && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider ${
            claim.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
            claim.status === 'mixed' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {claim.status}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Source Card ───────────────────────────────────────────────────────────────

function SourceCard({ source, index }: { source: SourceDTO; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-[8px] border border-[#ebebeb] bg-white p-3.5">
      <div className="flex items-start gap-3">
        <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded bg-[#f5f5f5] text-[10px] font-mono font-bold text-[#8f8f8f]">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <p className="text-[13px] font-medium text-[#171717] leading-snug flex-1">{source.title}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              {source.isGovAcad && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-mono text-blue-600 border border-blue-100">
                  GOV/ACAD
                </span>
              )}
              {source.reliabilityScore !== null && (
                <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[10px] font-mono text-[#4d4d4d] border border-[#ebebeb]">
                  {source.reliabilityScore}/100
                </span>
              )}
            </div>
          </div>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1 text-[11px] text-[#0070f3] hover:text-[#0761d1] transition-colors truncate"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{source.url}</span>
          </a>
          {source.snippet && (
            <>
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1.5 flex items-center gap-1 text-[11px] font-mono text-[#8f8f8f] hover:text-[#171717] transition-colors"
              >
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {expanded ? 'Hide' : 'Show'} excerpt
              </button>
              {expanded && (
                <p className="mt-2 text-[12px] text-[#4d4d4d] leading-relaxed border-t border-[#ebebeb] pt-2 line-clamp-6">
                  {source.snippet}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Contradiction Card ────────────────────────────────────────────────────────

function ContradictionCard({ contradiction }: { contradiction: ContradictionDTO }) {
  return (
    <div className="rounded-[8px] border border-amber-200 bg-amber-50/60 p-3.5">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] text-[#171717] leading-relaxed">{contradiction.contradictionText}</p>
          <p className="mt-1.5 text-[11px] text-[#8f8f8f] leading-relaxed">{contradiction.explanation}</p>
          <div className="mt-1.5 flex gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-[#a1a1a1]">Claim: {contradiction.aiClaimId}</span>
            <span className="text-[10px] font-mono text-[#a1a1a1]">Source: {contradiction.aiSourceId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4d4d4d] transition-all hover:bg-[#fafafa] hover:border-[#171717] focus:outline-none"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

// ── Simple Markdown Renderer ──────────────────────────────────────────────────
// Renders headers, bold, code spans, and paragraphs from the AI report.

function MarkdownReport({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="mt-5 mb-1.5 text-[14px] font-semibold text-[#171717] tracking-[-0.2px]">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="mt-6 mb-2 text-[16px] font-bold text-[#171717] tracking-[-0.4px]">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="mt-4 mb-3 text-[18px] font-bold text-[#171717] tracking-[-0.5px]">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="ml-4 list-disc text-[13px] text-[#4d4d4d] leading-relaxed">
          <InlineMarkdown text={line.slice(2)} />
        </li>
      );
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="my-4 border-[#ebebeb]" />);
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-[13px] text-[#4d4d4d] leading-relaxed">
          <InlineMarkdown text={line} />
        </p>
      );
    }
  });

  return <div className="space-y-0.5">{elements}</div>;
}

function InlineMarkdown({ text }: { text: string }) {
  // Handle **bold**, `code`, and plain text
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-[#171717]">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="rounded bg-[#f5f5f5] px-1 py-0.5 text-[11px] font-mono text-[#171717]">{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ── Main Workspace Page ───────────────────────────────────────────────────────

export default function WorkspacePage() {
  const router = useRouter();
  const supabase = createClient();

  // ── Auth State ──────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ── Session List ────────────────────────────────────────────────────────────
  const [sessions, setSessions] = useState<SessionSummaryDTO[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // ── Active Report State ─────────────────────────────────────────────────────
  const [activeReport, setActiveReport] = useState<GetResearchSessionResponse | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // ── Research Input State ────────────────────────────────────────────────────
  const [question, setQuestion] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── SSE / Streaming State ───────────────────────────────────────────────────
  const [view, setView] = useState<View>('input');
  const [streamLogs, setStreamLogs] = useState<SSEAgentEventPayload[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [currentAgent, setCurrentAgent] = useState<string>('');
  const eventSourceRef = useRef<EventSource | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // ── UI State ────────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Auto-scroll logs ────────────────────────────────────────────────────────
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamLogs]);

  // ── Fetch Session List ──────────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch('/api/research');
      if (!res.ok) return;
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch {
      // silently fail — sidebar is non-critical
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  // ── Auth Check & Session Fetch ──────────────────────────────────────────────
  useEffect(() => {
    async function initUserAndSessions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setProfile({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || 'Researcher',
        provider: user.app_metadata?.provider || 'email',
      });
      setLoadingAuth(false);
      await fetchSessions();
    }
    initUserAndSessions();
  }, [router, fetchSessions, supabase.auth]);

  // ── Load a Session Report ───────────────────────────────────────────────────
  const loadReport = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setLoadingReport(true);
    setReportError(null);
    setView('report');
    try {
      const res = await fetch(`/api/research/${sessionId}`);
      if (!res.ok) throw new Error('Failed to load session');
      const data: GetResearchSessionResponse = await res.json();
      setActiveReport(data);
    } catch (e) {
      setReportError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoadingReport(false);
    }
  }, []);

  // ── Submit Research Question ────────────────────────────────────────────────
  const handleSubmit = async () => {
    const trimmed = question.trim();
    if (trimmed.length < 10) { setQuestionError('Question must be at least 10 characters.'); return; }
    if (trimmed.length > 1000) { setQuestionError('Question must be under 1000 characters.'); return; }
    setQuestionError('');
    setSubmitting(true);
    setStreamError(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create session');
      }
      const data = await res.json();
      const { sessionId, streamUrl } = data;

      // Optimistically add to sidebar
      setSessions(prev => [{
        id: crypto.randomUUID(),
        sessionId,
        question: trimmed,
        status: 'running',
        confidenceScore: null,
        isBookmarked: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      }, ...prev]);

      startStream(sessionId, streamUrl);
      setQuestion('');
    } catch (e) {
      setStreamError(e instanceof Error ? e.message : 'Failed to start research');
      setSubmitting(false);
    }
  };

  // ── Start SSE Stream ────────────────────────────────────────────────────────
  const startStream = (sessionId: string, streamUrl: string) => {
    // Close any existing stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setActiveSessionId(sessionId);
    setStreamLogs([]);
    setCurrentAgent('');
    setView('streaming');
    setSubmitting(false);
    setActiveReport(null);

    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.addEventListener('AGENT_EVENT', (e) => {
      try {
        const payload: SSEAgentEventPayload = JSON.parse(e.data);
        setCurrentAgent(payload.agentName);
        // Only keep 'running' events in the live log for cleanliness
        if (payload.status === 'running') {
          setStreamLogs(prev => [...prev, payload]);
        }
      } catch {/* ignore parse errors */}
    });

    es.addEventListener('COMPLETE', async () => {
      es.close();
      setCurrentAgent('');
      // Refresh sessions list
      await fetchSessions();
      // Load the completed report
      await loadReport(sessionId);
    });

    es.addEventListener('ERROR', (e) => {
      try {
        const payload: SSEErrorPayload = JSON.parse((e as MessageEvent).data);
        setStreamError(payload.error || 'Research failed');
      } catch {
        setStreamError('Research pipeline encountered an error');
      }
      es.close();
      setCurrentAgent('');
      // Update the session status in sidebar
      setSessions(prev =>
        prev.map(s => s.sessionId === sessionId ? { ...s, status: 'failed' as const } : s)
      );
    });

    es.onerror = () => {
      // SSE connection dropped unexpectedly — may still be running in background
      if (es.readyState === EventSource.CLOSED) {
        setStreamError('Connection to server lost. Research may still be running — check back shortly.');
        setCurrentAgent('');
      }
    };
  };

  // ── Delete Session ──────────────────────────────────────────────────────────
  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this research session and all its data?')) return;
    setDeletingId(sessionId);
    try {
      const res = await fetch(`/api/research/${sessionId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
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

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // ── Loading Screen ──────────────────────────────────────────────────────────
  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#171717] border-t-transparent" />
          <span className="text-[13px] font-mono text-[#8f8f8f] uppercase tracking-wider">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  const charCount = question.length;
  const charLimit = 1000;

  return (
    <div className="flex h-screen bg-[#fafafa] font-sans overflow-hidden">

      {/* ── Left Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`flex flex-col border-r border-[#ebebeb] bg-white transition-all duration-300 ${
          sidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden'
        } shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-[#ebebeb] px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-bold tracking-[-0.5px] text-[#171717]">Veriq</span>
            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-mono text-violet-600 border border-violet-100">
              Workspace
            </span>
          </div>
        </div>

        {/* New Research Button */}
        <div className="p-3 border-b border-[#ebebeb]">
          <button
            onClick={() => { setView('input'); setActiveSessionId(null); setActiveReport(null); setStreamError(null); }}
            className="flex h-[36px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-3 text-[13px] font-medium text-white transition-colors hover:bg-[#2c2c2c] focus:outline-none"
          >
            <Sparkles className="h-3.5 w-3.5" />
            New Research
          </button>
        </div>

        {/* Session History */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1a1] mb-2">History</p>

            {loadingSessions && (
              <div className="flex items-center gap-2 py-4 justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-[#a1a1a1]" />
                <span className="text-[12px] text-[#a1a1a1]">Loading...</span>
              </div>
            )}

            {!loadingSessions && sessions.length === 0 && (
              <div className="py-6 text-center">
                <FileText className="h-8 w-8 text-[#d4d4d4] mx-auto mb-2" />
                <p className="text-[12px] text-[#a1a1a1]">No research sessions yet.</p>
                <p className="text-[11px] text-[#c0c0c0] mt-0.5">Submit a question to begin.</p>
              </div>
            )}

            {sessions.map((session) => (
              <div
                key={session.sessionId}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (session.status === 'completed' || session.status === 'failed') {
                    loadReport(session.sessionId);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (session.status === 'completed' || session.status === 'failed') {
                      loadReport(session.sessionId);
                    }
                  }
                }}
                className={`group mb-1 w-full rounded-[6px] p-2.5 text-left transition-colors cursor-pointer ${
                  activeSessionId === session.sessionId
                    ? 'bg-[#f5f5f5] border border-[#e0e0e0]'
                    : 'hover:bg-[#fafafa]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12px] text-[#171717] leading-snug line-clamp-2 flex-1">
                    {session.question}
                  </p>
                  <button
                    onClick={(e) => handleDelete(session.sessionId, e)}
                    disabled={deletingId === session.sessionId}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-[#a1a1a1] hover:text-red-500"
                  >
                    {deletingId === session.sessionId
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <Trash2 className="h-3 w-3" />
                    }
                  </button>
                </div>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <StatusBadge status={session.status} />
                  {session.confidenceScore !== null && (
                    <span className="text-[10px] font-mono text-[#a1a1a1]">{session.confidenceScore}%</span>
                  )}
                </div>
                <p className="mt-1 text-[10px] font-mono text-[#c0c0c0]">
                  {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer — User Profile */}
        <div className="border-t border-[#ebebeb] p-3">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-[#171717] truncate">{profile?.full_name}</p>
              <p className="text-[10px] text-[#8f8f8f] truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-[32px] w-full items-center justify-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[12px] font-medium text-[#4d4d4d] transition-all hover:bg-[#fafafa] hover:border-[#171717] focus:outline-none"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <div className="flex items-center gap-3 border-b border-[#ebebeb] bg-white px-5 py-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[#8f8f8f] hover:bg-[#f5f5f5] hover:text-[#171717] transition-colors"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Layers className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-[#ebebeb]" />
          {view === 'input' && (
            <span className="text-[13px] font-medium text-[#171717]">Research Workspace</span>
          )}
          {view === 'streaming' && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
              <span className="text-[13px] font-medium text-[#171717]">Research Running</span>
              {currentAgent && (
                <span className="text-[12px] text-[#8f8f8f]">— {currentAgent}</span>
              )}
            </div>
          )}
          {view === 'report' && activeReport && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[13px] font-medium text-[#171717] truncate max-w-[400px]">
                {activeReport.session.question}
              </span>
            </div>
          )}
        </div>

        {/* ── INPUT VIEW ─────────────────────────────────────────────────── */}
        {view === 'input' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            {/* Decorative bloom */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-200/30 via-violet-100/20 to-[#fafafa] opacity-70 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[640px]">
              <div className="mb-8 text-center">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50/50 px-3 py-1 text-[11px] font-medium text-violet-700 font-mono">
                  <Sparkles className="h-3 w-3" />
                  AI Research Engine
                </div>
                <h1 className="text-[28px] font-bold tracking-[-0.8px] text-[#171717]">
                  What do you want to verify?
                </h1>
                <p className="mt-2 text-[14px] text-[#8f8f8f]">
                  Ask any factual question. Veriq will research, verify, and synthesize a transparent report.
                </p>
              </div>

              {/* Input Card */}
              <div className="rounded-[12px] border border-[#ebebeb] bg-white p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)]">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8f8f8f] mb-2">
                  Research Question
                </label>
                <textarea
                  value={question}
                  onChange={(e) => { setQuestion(e.target.value); setQuestionError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
                  placeholder="e.g. Is intermittent fasting effective for long-term weight loss?"
                  rows={4}
                  maxLength={charLimit}
                  disabled={submitting}
                  className="w-full resize-none rounded-[6px] border border-[#ebebeb] bg-[#fafafa] px-3.5 py-3 text-[14px] text-[#171717] placeholder-[#a1a1a1] focus:border-[#171717] focus:bg-white focus:outline-none transition-colors disabled:opacity-50"
                />

                {/* Error + Char Counter */}
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    {questionError && (
                      <p className="text-[12px] text-red-500">{questionError}</p>
                    )}
                    {streamError && (
                      <p className="text-[12px] text-red-500">{streamError}</p>
                    )}
                  </div>
                  <span className={`text-[11px] font-mono ${charCount > charLimit * 0.9 ? 'text-amber-500' : 'text-[#a1a1a1]'}`}>
                    {charCount}/{charLimit}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting || question.trim().length < 10}
                  className="mt-3 flex h-[40px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#171717] px-4 text-[14px] font-medium text-white transition-all hover:bg-[#2c2c2c] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Starting research...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Begin Verification</>
                  )}
                </button>

                <p className="mt-2.5 text-center text-[11px] font-mono text-[#a1a1a1]">
                  ⌘+Enter to submit
                </p>
              </div>

              {/* Quick start examples */}
              <div className="mt-5">
                <p className="text-[11px] font-mono text-[#a1a1a1] uppercase tracking-wider mb-2 text-center">Try an example</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'Does coffee reduce Alzheimer\'s risk?',
                    'Can renewable energy replace fossil fuels?',
                    'Is passive investing better than active?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuestion(q)}
                      className="rounded-full border border-[#ebebeb] bg-white px-3 py-1.5 text-[12px] text-[#4d4d4d] hover:border-[#171717] hover:text-[#171717] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STREAMING VIEW ─────────────────────────────────────────────── */}
        {view === 'streaming' && (
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto max-w-[640px]">

              {/* Live status banner */}
              <div className="mb-5 rounded-[10px] border border-blue-200 bg-blue-50/60 p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500 shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-blue-900">Research in Progress</p>
                    {currentAgent && (
                      <p className="text-[12px] text-blue-700 mt-0.5">
                        Active: <span className="font-medium">{currentAgent}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {streamError && (
                <div className="mb-5 rounded-[10px] border border-red-200 bg-red-50/60 p-4 flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-red-900">Pipeline Error</p>
                    <p className="text-[12px] text-red-700 mt-0.5">{streamError}</p>
                    <button
                      onClick={() => { setView('input'); setStreamError(null); }}
                      className="mt-2 flex items-center gap-1 text-[12px] font-medium text-red-700 hover:text-red-900 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" /> Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Agent Log Feed */}
              <div className="rounded-[10px] border border-[#ebebeb] bg-white overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#ebebeb] px-4 py-3">
                  <p className="text-[12px] font-mono font-medium uppercase tracking-wider text-[#8f8f8f]">
                    Live Agent Feed
                  </p>
                  <span className="text-[11px] font-mono text-[#a1a1a1]">{streamLogs.length} events</span>
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                  {streamLogs.length === 0 && !streamError && (
                    <div className="flex items-center gap-3 px-4 py-5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#a1a1a1]" />
                      <p className="text-[12px] text-[#8f8f8f]">Initializing agents...</p>
                    </div>
                  )}

                  {streamLogs.map((log, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 px-4 py-3 border-b border-[#f5f5f5] last:border-none"
                    >
                      <LogDot status={log.status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <AgentIcon agentName={log.agentName} />
                          <span className="text-[12px] font-medium text-[#171717]">{log.agentName}</span>
                        </div>
                        <p className="mt-0.5 text-[12px] text-[#8f8f8f] leading-snug">{log.message}</p>
                      </div>
                      {log.durationMs && (
                        <span className="shrink-0 text-[10px] font-mono text-[#c0c0c0]">
                          {(log.durationMs / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>

              {/* Visual Progress Pipeline */}
              <div className="mt-5 rounded-[10px] border border-[#ebebeb] bg-white p-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#a1a1a1] mb-3">Agent Pipeline</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    'Research Strategist',
                    'Search Specialist',
                    'Research Analyst',
                    'Evidence Analyst',
                    'Verification Specialist',
                    'Contradiction Detector',
                    'Confidence Scorer',
                    'Report Writer',
                  ].map((name, i) => {
                    const isActive = currentAgent === name;
                    const isDone = streamLogs.some(l => l.agentName === name && l.status === 'completed') ||
                      streamLogs.some(l => l.agentName === name);
                    return (
                      <React.Fragment key={name}>
                        <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-mono transition-all ${
                          isActive ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          isDone ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          'bg-[#f5f5f5] text-[#a1a1a1] border border-transparent'
                        }`}>
                          <AgentIcon agentName={name} className="h-2.5 w-2.5" />
                          {name.split(' ')[0]}
                        </div>
                        {i < 7 && <ChevronRight className="h-3 w-3 text-[#d4d4d4] shrink-0" />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── REPORT VIEW ─────────────────────────────────────────────────── */}
        {view === 'report' && (
          <div className="flex-1 overflow-y-auto">
            {loadingReport && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-[#8f8f8f]" />
                  <span className="text-[13px] font-mono text-[#a1a1a1]">Loading report...</span>
                </div>
              </div>
            )}

            {reportError && !loadingReport && (
              <div className="flex items-center justify-center h-full px-6">
                <div className="rounded-[10px] border border-red-200 bg-red-50 p-6 max-w-[400px] text-center">
                  <XCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <p className="text-[14px] font-medium text-red-900">{reportError}</p>
                  <button
                    onClick={() => { setView('input'); setReportError(null); }}
                    className="mt-4 text-[13px] text-red-700 hover:text-red-900 underline"
                  >
                    Back to workspace
                  </button>
                </div>
              </div>
            )}

            {activeReport && !loadingReport && !reportError && (
              <ReportPanel report={activeReport} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Report Panel ──────────────────────────────────────────────────────────────
// Extracted as a separate component to keep WorkspacePage lean.

function ReportPanel({ report }: { report: GetResearchSessionResponse }) {
  const { session, sources, claims, contradictions, agentLogs } = report;
  const [showLogs, setShowLogs] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const verifiedCount = claims.filter(c => c.status === 'verified').length;
  const mixedCount = claims.filter(c => c.status === 'mixed').length;
  const unsupportedCount = claims.filter(c => c.status === 'unsupported').length;

  return (
    <div className="px-6 py-7">
      <div className="mx-auto max-w-[800px] space-y-5">

        {/* Report Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={session.status} />
              {session.retryCount > 0 && (
                <span className="text-[10px] font-mono text-[#a1a1a1]">{session.retryCount} retry</span>
              )}
            </div>
            <h2 className="text-[20px] font-bold tracking-[-0.5px] text-[#171717] leading-snug">
              {session.question}
            </h2>
            <p className="mt-1 text-[12px] font-mono text-[#a1a1a1]">
              Completed {session.completedAt
                ? new Date(session.completedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                : '—'}
            </p>
          </div>
          {session.finalReport && (
            <CopyButton text={session.finalReport} label="Copy Report" />
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Sources', value: sources.length, color: 'text-[#171717]' },
            { label: 'Claims', value: claims.length, color: 'text-[#171717]' },
            { label: 'Verified', value: verifiedCount, color: 'text-emerald-600' },
            { label: 'Contradictions', value: contradictions.length, color: contradictions.length > 0 ? 'text-amber-600' : 'text-[#171717]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-[8px] border border-[#ebebeb] bg-white p-3 text-center">
              <p className={`text-[22px] font-bold tracking-tight ${color}`}>{value}</p>
              <p className="text-[11px] font-mono text-[#a1a1a1] uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Confidence Score */}
        {session.confidenceScore !== null && (
          <div className="rounded-[10px] border border-[#ebebeb] bg-white p-4">
            <ConfidenceMeter score={session.confidenceScore} />
            {session.confidenceReasoning && (
              <div className="mt-4 space-y-3">
                <p className="text-[12px] text-[#4d4d4d] leading-relaxed">{session.confidenceReasoning.reason}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {session.confidenceReasoning.supportingFactors.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono font-medium uppercase tracking-wider text-emerald-700 mb-1.5">Supporting</p>
                      <ul className="space-y-1">
                        {session.confidenceReasoning.supportingFactors.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[12px] text-[#4d4d4d]">
                            <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {session.confidenceReasoning.detractingFactors.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono font-medium uppercase tracking-wider text-red-700 mb-1.5">Detracting</p>
                      <ul className="space-y-1">
                        {session.confidenceReasoning.detractingFactors.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[12px] text-[#4d4d4d]">
                            <XCircle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Final Report */}
        {session.finalReport && (
          <div className="rounded-[10px] border border-[#ebebeb] bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-mono font-medium uppercase tracking-wider text-[#8f8f8f]">Research Report</p>
              <CopyButton text={session.finalReport} label="Copy" />
            </div>
            <MarkdownReport content={session.finalReport} />
          </div>
        )}

        {/* Claims */}
        {claims.length > 0 && (
          <div className="rounded-[10px] border border-[#ebebeb] bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-mono font-medium uppercase tracking-wider text-[#8f8f8f]">
                Claims — Verification Results
              </p>
              <div className="flex items-center gap-2">
                {verifiedCount > 0 && <span className="text-[10px] font-mono text-emerald-600">{verifiedCount} verified</span>}
                {mixedCount > 0 && <span className="text-[10px] font-mono text-amber-600">{mixedCount} mixed</span>}
                {unsupportedCount > 0 && <span className="text-[10px] font-mono text-red-600">{unsupportedCount} unsupported</span>}
              </div>
            </div>
            <div className="space-y-2.5">
              {claims.map((c) => <ClaimCard key={c.id} claim={c} />)}
            </div>
          </div>
        )}

        {/* Contradictions */}
        {contradictions.length > 0 && (
          <div className="rounded-[10px] border border-amber-200 bg-amber-50/40 p-4">
            <p className="text-[12px] font-mono font-medium uppercase tracking-wider text-amber-700 mb-3">
              Contradictions Detected — {contradictions.length}
            </p>
            <div className="space-y-2.5">
              {contradictions.map((c) => <ContradictionCard key={c.id} contradiction={c} />)}
            </div>
          </div>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <div className="rounded-[10px] border border-[#ebebeb] bg-white p-4">
            <p className="text-[12px] font-mono font-medium uppercase tracking-wider text-[#8f8f8f] mb-3">
              Sources Analyzed — {sources.length}
            </p>
            <div className="space-y-2.5">
              {sources.map((s, i) => <SourceCard key={s.id} source={s} index={i} />)}
            </div>
          </div>
        )}

        {/* Collapsible: Research Notes */}
        {session.researchNotes && (
          <div className="rounded-[10px] border border-[#ebebeb] bg-white overflow-hidden">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#fafafa] transition-colors"
            >
              <p className="text-[12px] font-mono font-medium uppercase tracking-wider text-[#8f8f8f]">
                Raw Research Notes
              </p>
              {showNotes ? <ChevronUp className="h-4 w-4 text-[#a1a1a1]" /> : <ChevronDown className="h-4 w-4 text-[#a1a1a1]" />}
            </button>
            {showNotes && (
              <div className="border-t border-[#ebebeb] px-4 py-4">
                <p className="text-[12px] text-[#4d4d4d] leading-relaxed font-mono whitespace-pre-wrap">{session.researchNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Collapsible: Agent Logs */}
        {agentLogs.length > 0 && (
          <div className="rounded-[10px] border border-[#ebebeb] bg-white overflow-hidden">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#fafafa] transition-colors"
            >
              <p className="text-[12px] font-mono font-medium uppercase tracking-wider text-[#8f8f8f]">
                Agent Execution Log — {agentLogs.length} events
              </p>
              {showLogs ? <ChevronUp className="h-4 w-4 text-[#a1a1a1]" /> : <ChevronDown className="h-4 w-4 text-[#a1a1a1]" />}
            </button>
            {showLogs && (
              <div className="border-t border-[#ebebeb] max-h-[360px] overflow-y-auto">
                {agentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 px-4 py-3 border-b border-[#f5f5f5] last:border-none">
                    <LogDot status={log.status} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <AgentIcon agentName={log.agentName} />
                        <span className="text-[12px] font-medium text-[#171717]">{log.agentName}</span>
                        <StatusBadge status={log.status} />
                      </div>
                      <p className="mt-0.5 text-[11px] text-[#8f8f8f]">{log.message}</p>
                    </div>
                    {log.durationMs && (
                      <span className="shrink-0 text-[10px] font-mono text-[#c0c0c0]">
                        {(log.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[11px] font-mono text-[#c0c0c0] uppercase tracking-wider pb-4">
          Veriq • AI Research & Fact Verification
        </p>
      </div>
    </div>
  );
}
