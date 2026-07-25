'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LogEntry } from '@/lib/types';
import { Terminal, Copy, Check, Filter } from 'lucide-react';

interface ActivityFeedProps {
  logs: LogEntry[];
}

export default function ActivityFeed({ logs }: ActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warn'>('all');
  const [copied, setCopied] = useState(false);
  const feedEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter((l) => (filter === 'all' ? true : l.level === filter));

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.agentId}]: ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#09090b] p-5 shadow-2xl backdrop-blur-2xl flex flex-col h-full max-h-[420px] font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="font-bold text-white uppercase tracking-wider">Live Agent Telemetry Stream</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter Buttons */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px]">
            {(['all', 'info', 'success', 'warn'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-2 py-0.5 rounded-lg capitalize transition-colors ${
                  filter === lvl ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
            title="Copy Telemetry Logs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto space-y-1.5 text-xs pr-1">
        {filteredLogs.length === 0 ? (
          <div className="text-zinc-600 italic text-center py-12">No telemetry events recorded yet...</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-white/[0.02] p-1 rounded">
              <span className="text-zinc-500 shrink-0 text-[10px]">{log.timestamp}</span>
              <span
                className={`shrink-0 uppercase text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  log.level === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : log.level === 'warn'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : log.level === 'error'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                {log.level}
              </span>
              <span className="text-zinc-400 font-semibold shrink-0">[{log.agentId}]</span>
              <span className="text-zinc-200 break-all">{log.message}</span>
            </div>
          ))
        )}
        <div ref={feedEndRef} />
      </div>
    </div>
  );
}
