'use client';

import React from 'react';
import { AgentInfo } from '@/lib/types';
import { Cpu } from 'lucide-react';

interface LoadingWorkflowProps {
  agents: AgentInfo[];
  activeAgentId?: string;
}

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
        </div>
      </div>

      {/* Interactive SVG Node Map */}
      <div className="relative w-full h-[280px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

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
          );
        })}
      </div>
    </div>
  );
}
