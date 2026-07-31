'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LogEntry } from '@/lib/types';
<<<<<<< HEAD
import { Terminal, Copy, Check, Filter } from 'lucide-react';
=======
import { Terminal, Copy, Check } from 'lucide-react';
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c

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
<<<<<<< HEAD
    <div className="rounded-3xl border border-white/10 bg-[#09090b] p-5 shadow-2xl backdrop-blur-2xl flex flex-col h-full max-h-[420px] font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="font-bold text-white uppercase tracking-wider">Live Agent Telemetry Stream</span>
=======
    <div className="rounded-[16px] border border-[#171717] bg-[#171717] p-5 shadow-lg flex flex-col h-full max-h-[420px] font-mono text-white selection:bg-zinc-700">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="font-medium text-white uppercase tracking-wider text-[11px]">Telemetry Stream</span>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter Buttons */}
<<<<<<< HEAD
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px]">
=======
          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-[6px] border border-zinc-800 text-[10px]">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
            {(['all', 'info', 'success', 'warn'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
<<<<<<< HEAD
                className={`px-2 py-0.5 rounded-lg capitalize transition-colors ${
                  filter === lvl ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
=======
                className={`px-2 py-0.5 rounded-[4px] capitalize transition-colors ${
                  filter === lvl ? 'bg-zinc-700 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyLogs}
<<<<<<< HEAD
            className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
=======
            className="p-1 rounded-[6px] border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
            title="Copy Telemetry Logs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Output */}
<<<<<<< HEAD
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
=======
      <div className="flex-1 overflow-y-auto space-y-1.5 text-[11px] pr-1">
        {filteredLogs.length === 0 ? (
          <div className="text-zinc-500 italic text-center py-12">No telemetry events recorded yet...</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-zinc-800/50 p-1 rounded">
              <span className="text-zinc-500 shrink-0 text-[10px]">{log.timestamp}</span>
              <span
                className={`shrink-0 uppercase text-[9px] font-mono font-medium px-1.5 py-0.2 rounded ${
                  log.level === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : log.level === 'warn'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : log.level === 'error'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
                }`}
              >
                {log.level}
              </span>
<<<<<<< HEAD
              <span className="text-zinc-400 font-semibold shrink-0">[{log.agentId}]</span>
=======
              <span className="text-zinc-300 font-semibold shrink-0">[{log.agentId}]</span>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
              <span className="text-zinc-200 break-all">{log.message}</span>
            </div>
          ))
        )}
        <div ref={feedEndRef} />
      </div>
    </div>
  );
}
