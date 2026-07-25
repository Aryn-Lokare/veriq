'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AgentInfo } from '@/lib/types';
import { formatMs } from '@/lib/utils';
import { CheckCircle2, RefreshCw, AlertCircle, Clock, ChevronDown } from 'lucide-react';

interface AgentCardProps {
  agent: AgentInfo;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function AgentCard({ agent, isExpanded, onToggleExpand }: AgentCardProps) {
  const isRunning = agent.status === 'running' || agent.status === 'retrying';
  const isCompleted = agent.status === 'completed';
  const isRetrying = agent.status === 'retrying';

  return (
    <motion.div
      layout
      className={`rounded-2xl border p-4 transition-all duration-300 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
        isCompleted
          ? 'border-emerald-500/40 bg-emerald-950/10 shadow-lg shadow-emerald-500/10 glow-emerald'
          : isRunning
          ? 'border-cyan-500/50 bg-cyan-950/20 shadow-lg shadow-cyan-500/20 glow-cyan ring-1 ring-cyan-500/30'
          : 'border-white/10 bg-[#121215]/60 hover:border-white/20'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce-slow">{agent.icon}</span>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight leading-none">{agent.name}</h4>
              <span className="text-[10px] font-mono text-zinc-400">{agent.role}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5">
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Done
              </span>
            )}

            {isRunning && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                <RefreshCw className="h-3 w-3 animate-spin" /> {isRetrying ? 'Retrying' : 'Running'}
              </span>
            )}

            {agent.status === 'idle' && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                Idle
              </span>
            )}
          </div>
        </div>

        {/* Current Task Description */}
        <p className="text-xs text-zinc-300 mt-2 font-mono line-clamp-2 min-h-[32px]">
          {agent.currentTask}
        </p>
      </div>

      {/* Bottom Progress & Timer */}
      <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-zinc-400 flex items-center gap-1">
            <Clock className="h-3 w-3 text-zinc-500" />
            {formatMs(agent.durationMs)}
          </span>
          <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {agent.progress}%
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${agent.progress}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full rounded-full ${
              isCompleted
                ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500'
            }`}
          />
        </div>

        {/* Output Summary toggle if available */}
        {agent.outputSummary && (
          <button
            onClick={onToggleExpand}
            className="w-full mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-400 hover:text-cyan-300 pt-1"
          >
            <span>Inspect Output</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}

        {isExpanded && agent.outputSummary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 rounded-xl border border-white/10 bg-black/40 p-2.5 text-[11px] font-mono text-zinc-300"
          >
            {agent.outputSummary}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
