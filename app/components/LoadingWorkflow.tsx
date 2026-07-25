'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AgentInfo } from '@/lib/types';
import { Cpu, Zap, Activity } from 'lucide-react';

interface LoadingWorkflowProps {
  agents: AgentInfo[];
  activeAgentId?: string;
}

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
        </div>
      </div>

      {/* Interactive SVG Node Map */}
      <div className="relative w-full h-[280px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

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
          );
        })}
      </div>
    </div>
  );
}
