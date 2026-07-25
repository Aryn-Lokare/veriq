'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineEvent } from '@/lib/types';
import { Activity, CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121215]/80 p-5 shadow-xl backdrop-blur-xl flex flex-col h-full max-h-[420px]">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Live Execution Timeline
          </h3>
        </div>
        <span className="font-mono text-[10px] text-zinc-500">{events.length} Events Logged</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-zinc-500 font-mono text-xs">
              <Sparkles className="h-6 w-6 mb-2 text-zinc-600 animate-pulse" />
              <span>Awaiting research execution timeline events...</span>
            </div>
          ) : (
            events.map((evt, idx) => (
              <motion.div
                key={evt.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 relative pl-2 group"
              >
                {/* Vertical line indicator */}
                <div className="absolute left-[15px] top-7 bottom-0 w-[1px] bg-white/10 group-last:hidden" />

                {/* Event Icon Node */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs z-10 ${
                    evt.type === 'success'
                      ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400'
                      : evt.type === 'warning'
                      ? 'border-amber-500/40 bg-amber-950/60 text-amber-400'
                      : evt.type === 'milestone'
                      ? 'border-purple-500/40 bg-purple-950/60 text-purple-300'
                      : 'border-cyan-500/40 bg-cyan-950/60 text-cyan-400'
                  }`}
                >
                  {evt.agentIcon || '🤖'}
                </div>

                <div className="flex flex-col min-w-0 flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-white truncate">
                      {evt.agentName}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">{evt.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{evt.message}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
