'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { INITIAL_AGENTS, PRESET_QUERIES, generateDynamicReport } from '@/lib/mockData';
import { AGENT_OUTPUTS } from '@/lib/agentOutputs';
import { AgentInfo, Claim, PresetQuery, ResearchReport, TimelineEvent, LogEntry, AgentId } from '@/lib/types';
import ThemeToggle from '@/app/components/ThemeToggle';
import {
  ShieldCheck, Plus, History, LogOut, User,
  ArrowLeft, Search, CornerDownLeft, Sparkles,
  RefreshCw, CheckCircle2, AlertTriangle, ExternalLink,
  Cpu, Activity, X, Download, Share2, Layers
} from 'lucide-react';

// ─── TYPES ─────────────────────────────────────────────────────────────────
type WorkspacePhase = 'idle' | 'processing' | 'complete';

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
function WorkspaceSidebar({
  phase,
  agents,
  activeAgentId,
  onSelectAgent,
  onNewResearch,
  onSelectPreset,
  currentQueryId,
  completedReport,
}: {
  phase: WorkspacePhase;
  agents: AgentInfo[];
  activeAgentId: string | null;
  onSelectAgent: (id: AgentId) => void;
  onNewResearch: () => void;
  onSelectPreset: (preset: PresetQuery) => void;
  currentQueryId?: string;
  completedReport?: ResearchReport;
}) {
  return (
    <aside className="w-64 shrink-0 border-r border-white/8 bg-[#0a0a0d]/95 backdrop-blur-xl flex flex-col h-full overflow-hidden">
      {/* Brand */}
      <div className="p-4 border-b border-white/8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] shadow-md shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#09090b]">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">Veritas AI</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* New Research */}
        <button
          onClick={onNewResearch}
          className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 p-2.5 text-xs font-semibold text-white shadow-md transition-all hover:scale-[1.01] mb-3"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Research</span>
        </button>

        {phase === 'idle' && (
          <>
            <p className="px-2 pt-2 text-[10px] font-mono uppercase text-zinc-500 tracking-widest font-bold flex items-center gap-1.5 mb-1">
              <History className="h-3 w-3 text-cyan-400" /> History
            </p>
            {PRESET_QUERIES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`w-full text-left rounded-xl p-2.5 text-xs flex items-center justify-between group transition-all ${
                  currentQueryId === preset.id
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-white'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <span className="truncate pr-2">{preset.title}</span>
                <span className="text-[10px] font-mono text-zinc-500 shrink-0">{preset.report.overallConfidence.finalScore}%</span>
              </button>
            ))}
          </>
        )}

        {(phase === 'processing' || phase === 'complete') && (
          <>
            {/* Agent list in sidebar */}
            <p className="px-2 pt-2 text-[10px] font-mono uppercase text-zinc-500 tracking-widest font-bold flex items-center gap-1.5 mb-1">
              <Layers className="h-3 w-3 text-purple-400" /> Agent Pipeline
            </p>
            {agents.map((agent) => {
              const isRunning = agent.status === 'running';
              const isDone = agent.status === 'completed';
              const isActive = activeAgentId === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => isDone && onSelectAgent(agent.id as AgentId)}
                  disabled={!isDone && phase !== 'complete'}
                  className={`w-full text-left rounded-xl p-2.5 text-xs flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-white'
                      : isDone
                      ? 'text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent cursor-pointer'
                      : 'text-zinc-600 border border-transparent cursor-default'
                  }`}
                >
                  <span className="text-base shrink-0">{agent.icon}</span>
                  <span className="truncate flex-1">{agent.name}</span>
                  {isDone && <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />}
                  {isRunning && <RefreshCw className="h-3 w-3 text-cyan-400 animate-spin shrink-0" />}
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* Footer: theme toggle + profile */}
      <div className="p-3 border-t border-white/8 space-y-1">
        {/* Theme Toggle — full variant */}
        <ThemeToggle variant="full" />

        {/* Profile row */}
        <div className="flex items-center gap-2.5 p-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500">
            <User className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-white truncate">Lead Researcher</span>
            <span className="text-[10px] font-mono text-cyan-400">Autonomous Tier</span>
          </div>
          <Link href="/" className="p-1 rounded-lg text-zinc-400 hover:text-rose-400 transition-colors">
            <LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ─── AGENT GRAPH NODE ───────────────────────────────────────────────────────
interface NodeDef {
  id: AgentId; label: string; icon: string;
  x: number; y: number;
  color: string;
}

const NODES: NodeDef[] = [
  { id: 'orchestrator',  label: 'Orchestrator',     icon: '🧠', x: 50,  y: 8,  color: 'cyan' },
  { id: 'strategist',   label: 'Strategist',        icon: '🗺',  x: 22,  y: 28, color: 'purple' },
  { id: 'search',       label: 'Search',            icon: '🔍', x: 50,  y: 28, color: 'blue' },
  { id: 'analyst',      label: 'Analyst',           icon: '📚', x: 78,  y: 28, color: 'indigo' },
  { id: 'evidence',     label: 'Evidence',          icon: '📝', x: 50,  y: 52, color: 'cyan' },
  { id: 'verifier',     label: 'Verifier',          icon: '✅', x: 28,  y: 73, color: 'emerald' },
  { id: 'contradiction',label: 'Contradictions',    icon: '⚔',  x: 72,  y: 73, color: 'amber' },
  { id: 'scorer',       label: 'Confidence',        icon: '📊', x: 50,  y: 91, color: 'purple' },
  { id: 'writer',       label: 'Report Writer',     icon: '📄', x: 82,  y: 91, color: 'teal' },
];

const EDGES: [string, string][] = [
  ['orchestrator','strategist'], ['orchestrator','search'], ['orchestrator','analyst'],
  ['strategist','search'], ['search','analyst'], ['analyst','evidence'],
  ['evidence','verifier'], ['evidence','contradiction'],
  ['verifier','scorer'], ['contradiction','scorer'], ['scorer','writer'],
];

function AgentGraph({
  agents,
  activeAgentId,
  onNodeClick,
  phase,
}: {
  agents: AgentInfo[];
  activeAgentId: string | null;
  onNodeClick: (id: AgentId) => void;
  phase: WorkspacePhase;
}) {
  const getStatus = (id: string) => agents.find(a => a.id === id)?.status ?? 'idle';

  return (
    <div className="relative w-full" style={{ paddingBottom: '60%' }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {EDGES.map(([from, to], i) => {
          const fn = NODES.find(n => n.id === from)!;
          const tn = NODES.find(n => n.id === to)!;
          const fromStatus = getStatus(from);
          const toStatus = getStatus(to);
          const active = fromStatus === 'running' || toStatus === 'running';
          const done = fromStatus === 'completed' && toStatus === 'completed';
          return (
            <line key={i}
              x1={`${fn.x}%`} y1={`${fn.y}%`}
              x2={`${tn.x}%`} y2={`${tn.y}%`}
              stroke={done ? '#34d399' : active ? '#38bdf8' : 'rgba(255,255,255,0.08)'}
              strokeWidth={done ? 1.5 : active ? 2 : 1}
              strokeDasharray={active ? '6 4' : undefined}
              className={active ? 'animate-beam' : undefined}
            />
          );
        })}
      </svg>

      {NODES.map(node => {
        const status = getStatus(node.id);
        const isRunning = status === 'running';
        const isDone = status === 'completed';
        const isSelected = activeAgentId === node.id;
        const isClickable = isDone && phase === 'complete';

        return (
          <button
            key={node.id}
            onClick={() => isClickable && onNodeClick(node.id)}
            disabled={!isClickable}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group z-10 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {/* Node circle */}
            <motion.div
              animate={isRunning ? { scale: [1, 1.12, 1], boxShadow: ['0 0 0px #38bdf8', '0 0 16px #38bdf8', '0 0 0px #38bdf8'] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-cyan-300 bg-cyan-950/80 shadow-lg shadow-cyan-400/40 scale-110'
                  : isDone
                  ? 'border-emerald-500 bg-emerald-950/60 shadow-md shadow-emerald-500/20 hover:scale-110 hover:border-emerald-300'
                  : isRunning
                  ? 'border-cyan-400 bg-cyan-950/80 shadow-lg shadow-cyan-400/40'
                  : 'border-white/10 bg-[#1a1a20]'
              }`}
            >
              <span className="text-xl leading-none">{node.icon}</span>
            </motion.div>

            {/* Label */}
            <span className={`text-[10px] font-mono font-bold whitespace-nowrap px-2 py-0.5 rounded-full border transition-all ${
              isSelected ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-200'
              : isDone ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : isRunning ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-200'
              : 'border-white/8 bg-white/5 text-zinc-500'
            }`}>
              {node.label}
            </span>

            {/* "View Output" hint on hover for completed nodes */}
            {isClickable && (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono text-cyan-400 font-bold">
                View Output →
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── AGENT OUTPUT VIEW ──────────────────────────────────────────────────────
function AgentOutputView({
  agent,
  onBack,
}: {
  agent: AgentInfo;
  onBack: () => void;
}) {
  const lines = AGENT_OUTPUTS[agent.id as AgentId] || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-full overflow-y-auto p-6 space-y-5"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to overview
      </button>

      <div className="rounded-3xl border border-white/10 bg-[#121215]/80 p-6 space-y-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{agent.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-white">{agent.name}</h2>
            <span className="text-xs font-mono text-cyan-400">{agent.role}</span>
          </div>
          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">{agent.description}</p>

        <div className="flex items-center justify-between font-mono text-[11px] border-t border-white/10 pt-3">
          <span className="text-zinc-500">Execution Time</span>
          <span className="text-white font-bold">{(agent.durationMs / 1000).toFixed(2)}s</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="rounded-3xl border border-white/10 bg-[#09090b] p-5 font-mono space-y-2">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3">
          <Cpu className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Agent Execution Log</span>
        </div>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`text-xs leading-relaxed ${
              line.startsWith('  ') ? 'text-zinc-400 pl-4' :
              line.includes('✅') ? 'text-emerald-400' :
              line.includes('⚠') ? 'text-amber-400' :
              line.includes('❌') ? 'text-rose-400' :
              line.includes('CONTRADICTION') || line.includes('FINAL') ? 'text-cyan-300 font-bold' :
              'text-zinc-200'
            }`}
          >
            {!line.startsWith('  ') && (
              <span className="text-zinc-600 mr-2 select-none">›</span>
            )}
            {line}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── MAIN WORKSPACE ─────────────────────────────────────────────────────────
export default function WorkspacePage() {
  const [phase, setPhase] = useState<WorkspacePhase>('idle');
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [agents, setAgents] = useState<AgentInfo[]>(
    INITIAL_AGENTS.map(a => ({ ...a, status: 'idle', progress: 0, durationMs: 0 }))
  );
  const [activeReport, setActiveReport] = useState<ResearchReport | null>(null);
  const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null);
  const [viewingAgentOutput, setViewingAgentOutput] = useState<AgentInfo | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [currentQueryId, setCurrentQueryId] = useState<string | undefined>();
  const [speedMultiplier] = useState(1);

  const handleNewResearch = useCallback(() => {
    setPhase('idle');
    setQuery('');
    setInputValue('');
    setAgents(INITIAL_AGENTS.map(a => ({ ...a, status: 'idle', progress: 0, durationMs: 0 })));
    setActiveReport(null);
    setActiveAgentId(null);
    setViewingAgentOutput(null);
    setTimelineEvents([]);
    setLogs([]);
    setCurrentQueryId(undefined);
  }, []);

  const runSimulation = useCallback((queryText: string, targetReport?: ResearchReport) => {
    setQuery(queryText);
    setPhase('processing');
    setViewingAgentOutput(null);
    setActiveAgentId(null);

    const reportToUse = targetReport || generateDynamicReport(queryText);

    // Reset agents
    const fresh = INITIAL_AGENTS.map(a => ({
      ...a, status: 'idle' as const, progress: 0, durationMs: 0,
      currentTask: 'Queued in pipeline...',
    }));
    setAgents(fresh);

    const nowTime = new Date().toLocaleTimeString();
    setTimelineEvents([{
      id: Date.now().toString(), timestamp: nowTime, agentId: 'orchestrator',
      agentName: 'Orchestrator', agentIcon: '🧠',
      message: `Research initiated: "${queryText}"`, type: 'info',
    }]);
    setLogs([{
      id: Date.now().toString(), timestamp: nowTime, level: 'info',
      agentId: 'orchestrator', message: `Question received: "${queryText}"`,
    }]);

    const agentSequence: { id: AgentId; task: string; delay: number; log: string }[] = [
      { id: 'orchestrator',   task: 'Building multi-agent execution graph...',              delay: 400,  log: 'Parsing intent and delegating to Research Strategist.' },
      { id: 'strategist',     task: 'Decomposing into 4 research vectors...',               delay: 900,  log: 'Generated 12 targeted search queries.' },
      { id: 'search',         task: 'Querying Tavily, PubMed & arXiv...',                  delay: 1600, log: 'Retrieved 14 primary sources.' },
      { id: 'analyst',        task: 'Extracting key findings and statistics...',            delay: 2400, log: 'Synthesized 3,400-word research notes.' },
      { id: 'evidence',       task: 'Isolating atomic claims for verification...',          delay: 3100, log: 'Extracted 6 atomic verifiable claims.' },
      { id: 'verifier',       task: 'Cross-checking against peer-reviewed repos...',        delay: 3900, log: '4 claims verified, 1 mixed, 1 unsupported.' },
      { id: 'contradiction',  task: 'Scanning for conflicting evidence...',                 delay: 4700, log: '⚠ Contradiction: muscle preservation discrepancy found.' },
      { id: 'scorer',         task: `Computing confidence score...`,                        delay: 5400, log: `Final score: ${reportToUse.overallConfidence.finalScore}%` },
      { id: 'writer',         task: 'Assembling final research report...',                  delay: 6000, log: 'Report generated successfully.' },
    ];

    agentSequence.forEach((step, index) => {
      setTimeout(() => {
        const stepTime = new Date().toLocaleTimeString();
        setActiveAgentId(step.id);

        setAgents(prev => prev.map((a, ai) => {
          if (a.id === step.id) {
            return { ...a, status: 'running', currentTask: step.task, progress: 60 };
          }
          if (index > 0 && a.id === agentSequence[index - 1].id) {
            return { ...a, status: 'completed', progress: 100, durationMs: 500 + Math.floor(Math.random() * 400) };
          }
          return a;
        }));

        setTimelineEvents(prev => [...prev, {
          id: Date.now().toString() + index, timestamp: stepTime,
          agentId: step.id, agentName: step.id, agentIcon: INITIAL_AGENTS.find(ia => ia.id === step.id)?.icon || '🤖',
          message: step.task,
          type: index === 7 ? 'milestone' : index === 6 ? 'warning' : 'info',
        }]);

        setLogs(prev => [...prev, {
          id: Date.now().toString() + index, timestamp: stepTime,
          level: index === 6 ? 'warn' : index === 7 ? 'system' : 'success',
          agentId: step.id, message: step.log,
        }]);

        if (index === agentSequence.length - 1) {
          setTimeout(() => {
            setAgents(prev => prev.map(a => ({
              ...a, status: 'completed', progress: 100, durationMs: a.durationMs || 600,
            })));
            setActiveReport(reportToUse);
            setActiveAgentId(null);
            setPhase('complete');
          }, 700);
        }
      }, step.delay / speedMultiplier);
    });
  }, [speedMultiplier]);

  const handleSelectPreset = useCallback((preset: PresetQuery) => {
    setCurrentQueryId(preset.id);
    setQuery(preset.question);
    setActiveReport(preset.report);
    setAgents(INITIAL_AGENTS.map(a => ({
      ...a,
      status: 'completed',
      progress: 100,
      durationMs: 400 + Math.floor(Math.random() * 300),
    })));
    setViewingAgentOutput(null);
    setActiveAgentId(null);
    setPhase('complete');
  }, []);

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    const found = PRESET_QUERIES.find(p => p.question === q.trim());
    if (found) {
      setCurrentQueryId(found.id);
      runSimulation(found.question, found.report);
    } else {
      setCurrentQueryId(undefined);
      runSimulation(q.trim());
    }
  };

  const handleNodeClick = (id: AgentId) => {
    const agent = agents.find(a => a.id === id);
    if (agent && agent.status === 'completed') {
      setViewingAgentOutput(agent);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-white overflow-hidden font-sans">
      {/* SIDEBAR */}
      <WorkspaceSidebar
        phase={phase}
        agents={agents}
        activeAgentId={viewingAgentOutput?.id || null}
        onSelectAgent={(id) => handleNodeClick(id)}
        onNewResearch={handleNewResearch}
        onSelectPreset={handleSelectPreset}
        currentQueryId={currentQueryId}
        completedReport={activeReport || undefined}
      />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* ── PHASE: IDLE ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-6 pb-16 relative overflow-hidden"
            >
              {/* Background glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)' }}
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl space-y-6 relative z-10"
              >
                <div className="text-center space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-semibold text-cyan-300">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                    9 Autonomous Agents · Ready to Research
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    What do you want to{' '}
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      verify?
                    </span>
                  </h1>
                  <p className="text-base text-zinc-400 max-w-xl mx-auto">
                    Ask any question. A team of 9 AI agents will research, verify, and challenge information before giving you a trustworthy answer.
                  </p>
                </div>

                {/* Search Box */}
                <IdleSearchBox
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={handleSubmit}
                />

                {/* Preset chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  {PRESET_QUERIES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all backdrop-blur-md"
                    >
                      {p.question}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── PHASE: PROCESSING ───────────────────────────── */}
          {phase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Floating question at top */}
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="shrink-0 px-6 pt-5 pb-4 border-b border-white/10"
              >
                <div className="flex items-center gap-3 max-w-3xl">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    &ldquo;{query}&rdquo;
                  </p>
                  <span className="ml-auto flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-mono font-bold text-amber-400 shrink-0">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Researching...
                  </span>
                </div>
              </motion.div>

              {/* Agent Graph in processing */}
              <div className="flex-1 overflow-y-auto p-6">
                <ProcessingView
                  agents={agents}
                  activeAgentId={activeAgentId}
                  timelineEvents={timelineEvents}
                  logs={logs}
                  onNodeClick={(id) => {}} // no-op during processing
                />
              </div>
            </motion.div>
          )}

          {/* ── PHASE: COMPLETE ──────────────────────────────── */}
          {phase === 'complete' && activeReport && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Question bar */}
              <div className="shrink-0 px-6 pt-5 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 max-w-4xl">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-white truncate">
                    &ldquo;{query}&rdquo;
                  </p>
                  <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-3 w-3" /> {activeReport.overallConfidence.finalScore}% Confidence
                  </span>
                  <button
                    onClick={handleNewResearch}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" /> New
                  </button>
                </div>
              </div>

              {/* Main content: 2-column if viewing agent output, else graph+report */}
              <div className="flex-1 overflow-hidden flex">
                <AnimatePresence mode="wait">
                  {viewingAgentOutput ? (
                    <motion.div
                      key={`agent-${viewingAgentOutput.id}`}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 overflow-hidden"
                    >
                      <AgentOutputView
                        agent={viewingAgentOutput}
                        onBack={() => setViewingAgentOutput(null)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="complete-overview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 overflow-y-auto"
                    >
                      <CompleteView
                        agents={agents}
                        activeReport={activeReport}
                        onNodeClick={handleNodeClick}
                        onInspectClaim={setSelectedClaim}
                        onExport={() => setShowExport(true)}
                        timelineEvents={timelineEvents}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Evidence Drawer */}
      <AnimatePresence>
        {selectedClaim && activeReport && (
          <EvidenceDrawerInline
            claim={selectedClaim}
            sources={activeReport.sources}
            contradictions={activeReport.contradictions}
            onClose={() => setSelectedClaim(null)}
          />
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && activeReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowExport(false)} />
            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#121215] p-6 shadow-2xl z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Export Report</h3>
                </div>
                <button onClick={() => setShowExport(false)} className="p-1.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 p-3 font-semibold text-white">
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeReport, null, 2));
                    a.download = `veritas-report.json`;
                    a.click();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 font-semibold text-zinc-200"
                >
                  Download JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── IDLE SEARCH BOX ────────────────────────────────────────────────────────
function IdleSearchBox({ value, onChange, onSubmit }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  const charCount = question.length;
  const charLimit = 1000;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 opacity-30 blur-md group-hover:opacity-60 transition-opacity" />
      <div className="relative flex flex-col rounded-3xl border border-white/10 bg-[#121215]/90 p-4 backdrop-blur-2xl">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mt-1">
            <Search className="h-5 w-5" />
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask any research question..."
            rows={2}
            className="w-full bg-transparent text-white text-lg placeholder:text-zinc-500 focus:outline-none resize-none pt-1.5"
          />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
            <CornerDownLeft className="h-3 w-3" /> Press Enter to research
          </span>
          <button
            onClick={() => onSubmit(value)}
            disabled={!value.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Start Research →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PROCESSING VIEW ────────────────────────────────────────────────────────
function ProcessingView({ agents, activeAgentId, timelineEvents, logs, onNodeClick }: {
  agents: AgentInfo[];
  activeAgentId: string | null;
  timelineEvents: TimelineEvent[];
  logs: LogEntry[];
  onNodeClick: (id: AgentId) => void;
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Agent Graph */}
      <div className="rounded-3xl border border-white/10 bg-[#0d0d10]/90 p-6 backdrop-blur-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5">
          <Cpu className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Live Agent Execution Graph</span>
          <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            Processing
          </div>
        </div>
        <AgentGraph agents={agents} activeAgentId={activeAgentId} onNodeClick={onNodeClick} phase="processing" />
      </div>

      {/* Active Agent Status */}
      {activeAgentId && (() => {
        const agent = agents.find(a => a.id === activeAgentId);
        if (!agent) return null;
        return (
          <motion.div
            key={activeAgentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-cyan-500/40 bg-cyan-950/20 p-5 flex items-center gap-4 backdrop-blur-xl"
          >
            <span className="text-3xl">{agent.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-sm">{agent.name}</span>
                <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                  <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Running
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-mono truncate">{agent.currentTask}</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                />
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* Live log feed */}
      <div className="rounded-3xl border border-white/10 bg-[#09090b] p-5 font-mono max-h-48 overflow-y-auto">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Telemetry</span>
        </div>
        {logs.map(log => (
          <div key={log.id} className="flex gap-2 text-[11px] py-0.5">
            <span className="text-zinc-600 shrink-0">{log.timestamp}</span>
            <span className={`shrink-0 uppercase text-[9px] font-bold px-1 rounded ${
              log.level === 'success' ? 'text-emerald-400 bg-emerald-500/10' :
              log.level === 'warn' ? 'text-amber-400 bg-amber-500/10' :
              'text-cyan-400 bg-cyan-500/10'
            }`}>{log.level}</span>
            <span className="text-zinc-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPLETE VIEW ──────────────────────────────────────────────────────────
function CompleteView({
  agents, activeReport, onNodeClick, onInspectClaim, onExport, timelineEvents,
}: {
  agents: AgentInfo[];
  activeReport: ResearchReport;
  onNodeClick: (id: AgentId) => void;
  onInspectClaim: (c: Claim) => void;
  onExport: () => void;
  timelineEvents: TimelineEvent[];
}) {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Agent Graph + Timeline */}
        <div className="lg:col-span-7 space-y-5">
          {/* Agent Graph — nodes now clickable */}
          <div className="rounded-3xl border border-white/10 bg-[#0d0d10]/90 p-6 backdrop-blur-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Agent Execution Graph</span>
              <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" /> All Agents Complete
              </div>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mb-4 text-center">Click any agent node to view their output</p>
            <AgentGraph agents={agents} activeAgentId={null} onNodeClick={onNodeClick} phase="complete" />
          </div>

          {/* Timeline */}
          <div className="rounded-3xl border border-white/10 bg-[#121215]/80 p-5 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">Research Timeline</span>
            </div>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {timelineEvents.map((evt, i) => (
                <div key={evt.id} className="flex gap-3 items-start text-xs">
                  <span className="text-zinc-600 font-mono text-[10px] shrink-0 pt-0.5">{evt.timestamp}</span>
                  <span className="text-base shrink-0">{evt.agentIcon}</span>
                  <span className={`leading-relaxed ${
                    evt.type === 'success' ? 'text-emerald-300' :
                    evt.type === 'warning' ? 'text-amber-300' :
                    evt.type === 'milestone' ? 'text-purple-300 font-semibold' :
                    'text-zinc-300'
                  }`}>{evt.message}</span>
                </div>
              ))}
            </div>
          </div>
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

        {/* Right: Report Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Confidence Badge */}
          <div className="rounded-3xl border border-white/10 bg-[#121215]/80 p-5 text-center backdrop-blur-xl">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">Overall Confidence Score</p>
            <p className="text-6xl font-extrabold text-emerald-400">{activeReport.overallConfidence.finalScore}%</p>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed px-2">{activeReport.overallConfidence.explanation}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={onExport} className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-2 text-xs font-semibold text-white">
                <Download className="h-3.5 w-3.5" /> Export PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-zinc-200">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="rounded-3xl border border-white/10 bg-[#121215]/80 p-5 backdrop-blur-xl space-y-2">
            <h3 className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Executive Summary
            </h3>
            <p className="text-xs text-zinc-200 leading-relaxed">{activeReport.executiveSummary}</p>
          </div>

          {/* Claims */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
              Verified Claims ({activeReport.verifiedClaims.length})
            </p>
            {activeReport.verifiedClaims.map(claim => (
              <div
                key={claim.id}
                className="rounded-2xl border border-white/10 bg-[#121215]/70 p-4 space-y-2 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    claim.status === 'verified' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                    claim.status === 'mixed' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                    'text-rose-400 border-rose-500/30 bg-rose-500/10'
                  }`}>
                    {claim.status === 'verified' ? '✅ Verified' : claim.status === 'mixed' ? '⚠ Mixed' : '❌ Unsupported'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{claim.confidenceScore}%</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed">&ldquo;{claim.statement}&rdquo;</p>
                <button
                  onClick={() => onInspectClaim(claim)}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Inspect Evidence →
                </button>
              </div>
            ))}
          </div>

          {/* Contradictions */}
          {activeReport.contradictions.length > 0 && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
              <h4 className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Contradictions Detected
              </h4>
              {activeReport.contradictions.map(c => (
                <p key={c.id} className="text-xs text-zinc-300 leading-relaxed">{c.explanation}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EVIDENCE DRAWER (inline) ───────────────────────────────────────────────
function EvidenceDrawerInline({ claim, sources, contradictions, onClose }: {
  claim: Claim;
  sources: any[];
  contradictions: any[];
  onClose: () => void;
}) {
  const supportingSources = sources.filter(s => claim.supportingSourceIds.includes(s.id));

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#09090b] border-l border-white/10 p-6 shadow-2xl overflow-y-auto z-50"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <h3 className="text-sm font-bold text-white">Evidence Inspector</h3>
          <button onClick={onClose} className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 mb-5">
          <p className="text-xs font-mono text-cyan-400 font-bold uppercase mb-2">Claim Statement</p>
          <p className="text-sm font-semibold text-white">&ldquo;{claim.statement}&rdquo;</p>
        </div>

        <div className="mb-5 space-y-2">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Verification Reasoning</p>
          <p className="text-xs text-zinc-300 leading-relaxed bg-white/5 p-3 rounded-xl">{claim.reasoning}</p>
        </div>

        {claim.keyQuotes.length > 0 && (
          <div className="mb-5 space-y-2">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Primary Quotes</p>
            {claim.keyQuotes.map((q, i) => (
              <div key={i} className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-3 text-xs italic text-emerald-200">
                &ldquo;{q}&rdquo;
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Sources ({supportingSources.length})</p>
          {supportingSources.map(src => (
            <div key={src.id} className="rounded-xl border border-white/10 bg-[#121215] p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold">{src.type}</span>
                <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="font-semibold text-white">{src.title}</p>
              <p className="text-zinc-400 leading-relaxed">{src.snippet}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white">
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
}
