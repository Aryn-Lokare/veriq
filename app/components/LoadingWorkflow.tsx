'use client';

import React from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { AgentInfo } from '@/lib/types';
import { Cpu, Zap, Activity } from 'lucide-react';
=======
import { AgentInfo } from '@/lib/types';
import { Cpu } from 'lucide-react';
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c

interface LoadingWorkflowProps {
  agents: AgentInfo[];
  activeAgentId?: string;
}

<<<<<<< HEAD
export default function LoadingWorkflow({ agents, activeAgentId }: LoadingWorkflowProps) {
  // Graph nodes layout
  const nodes = [
    { id: 'orchestrator', label: 'Orchestrator', icon: '🧠', x: 50, y: 15, col: 'cyan' },
    { id: 'strategist', label: 'Strategist', icon: '🗺', x: 20, y: 35, col: 'purple' },
    { id: 'search', label: 'Search', icon: '🔍', x: 50, y: 35, col: 'blue' },
    { id: 'analyst', label: 'Analyst', icon: '📚', x: 80, y: 35, col: 'indigo' },
    { id: 'evidence', label: 'Evidence', icon: '📝', x: 50, y: 58, col: 'cyan' },
    { id: 'verifier', label: 'Verifier', icon: '✅', x: 30, y: 78, col: 'emerald' },
    { id: 'contradiction', label: 'Contradictions', icon: '⚔', x: 70, y: 78, col: 'amber' },
    { id: 'scorer', label: 'Confidence', icon: '📊', x: 50, y: 92, col: 'purple' },
    { id: 'writer', label: 'Writer', icon: '📄', x: 85, y: 92, col: 'teal' },
=======
export default function LoadingWorkflow({ agents }: LoadingWorkflowProps) {
  // Graph nodes layout
  const nodes = [
    { id: 'orchestrator', label: 'Orchestrator', icon: '🧠', x: 50, y: 15 },
    { id: 'strategist', label: 'Strategist', icon: '🗺', x: 20, y: 35 },
    { id: 'search', label: 'Search', icon: '🔍', x: 50, y: 35 },
    { id: 'analyst', label: 'Analyst', icon: '📚', x: 80, y: 35 },
    { id: 'evidence', label: 'Evidence', icon: '📝', x: 50, y: 58 },
    { id: 'verifier', label: 'Verifier', icon: '✅', x: 30, y: 78 },
    { id: 'contradiction', label: 'Contradictions', icon: '⚔', x: 70, y: 78 },
    { id: 'scorer', label: 'Confidence', icon: '📊', x: 50, y: 92 },
    { id: 'writer', label: 'Writer', icon: '📄', x: 85, y: 92 },
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
  ];

  // Graph connecting edges
  const edges = [
    { from: 'orchestrator', to: 'strategist' },
    { from: 'orchestrator', to: 'search' },
    { from: 'orchestrator', to: 'analyst' },
    { from: 'strategist', to: 'search' },
    { from: 'search', to: 'analyst' },
    { from: 'analyst', to: 'evidence' },
    { from: 'evidence', to: 'verifier' },
    { from: 'evidence', to: 'contradiction' },
    { from: 'verifier', to: 'scorer' },
    { from: 'contradiction', to: 'scorer' },
    { from: 'scorer', to: 'writer' },
  ];

  return (
<<<<<<< HEAD
    <div className="relative w-full rounded-3xl border border-white/10 bg-[#0d0d10]/90 p-6 shadow-2xl backdrop-blur-2xl overflow-hidden min-h-[360px]">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Live Multi-Agent Mesh Execution Graph
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          Neural Pipeline Active
=======
    <div className="relative w-full rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden min-h-[360px] font-sans">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#f2f2f2] dark:border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[#171717] dark:text-white" />
          <span className="text-[11px] font-mono font-medium text-[#171717] dark:text-white uppercase tracking-wider">
            Live Multi-Agent Mesh Topology
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#8f8f8f] dark:text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-[#171717] dark:bg-white animate-pulse" />
          Pipeline Execution Active
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
        </div>
      </div>

      {/* Interactive SVG Node Map */}
      <div className="relative w-full h-[280px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

<<<<<<< HEAD
            const fromAgent = agents.find((a) => a.id === edge.from);
            const toAgent = agents.find((a) => a.id === edge.to);
            const isActive = fromAgent?.status === 'running' || toAgent?.status === 'running';

            return (
              <g key={idx}>
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={isActive ? 'url(#active-gradient)' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? '6 6' : undefined}
                  className={isActive ? 'animate-beam' : ''}
                />
              </g>
            );
          })}

          <defs>
            <linearGradient id="active-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const agent = agents.find((a) => a.id === node.id);
          const isRunning = agent?.status === 'running' || agent?.status === 'retrying';
          const isCompleted = agent?.status === 'completed';

          return (
            <motion.div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400 shadow-md shadow-emerald-500/20'
                    : isRunning
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-lg shadow-cyan-400/40 scale-110 animate-pulse'
                    : 'border-white/10 bg-[#121215] text-zinc-400 hover:border-white/30'
                }`}
              >
                <span className="text-lg">{node.icon}</span>
              </div>
              <span
                className={`mt-1 font-mono text-[10px] font-semibold whitespace-nowrap px-2 py-0.5 rounded-full border ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : isRunning
                    ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-200'
                    : 'border-white/10 bg-white/5 text-zinc-400'
                }`}
              >
                {node.label}
              </span>
            </motion.div>
=======
            return (
              <line
                key={idx}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-[#ebebeb] dark:text-zinc-800"
              />
            );
          })}
        </svg>

        {nodes.map((node) => {
          const agent = agents.find((a) => a.id === node.id);
          const isRunning = agent?.status === 'running';
          const isCompleted = agent?.status === 'completed';

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full px-3 py-1.5 border transition-all shadow-sm ${
                isRunning
                  ? 'border-[#171717] dark:border-white bg-[#171717] dark:bg-white text-white dark:text-[#171717] scale-105 shadow-md'
                  : isCompleted
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                  : 'border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-800 text-[#4d4d4d] dark:text-zinc-400'
              }`}
            >
              <span className="text-xs">{node.icon}</span>
              <span className="text-[11px] font-mono font-medium truncate max-w-[85px] sm:max-w-[110px]">
                {node.label}
              </span>
            </div>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          );
        })}
      </div>
    </div>
  );
}
