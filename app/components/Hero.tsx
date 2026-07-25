'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldAlert, Play, CheckCircle2, Cpu, Activity } from 'lucide-react';

interface HeroProps {
  onSeeDemo?: () => void;
}

export default function Hero({ onSeeDemo }: HeroProps) {
  return (
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-medium text-cyan-300 backdrop-blur-md mb-8 shadow-inner shadow-cyan-500/20"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>Next-Gen Autonomous Multi-Agent Verification</span>
          <span className="h-1 w-1 rounded-full bg-cyan-400" />
          <span className="text-zinc-400">Zero Hallucinations</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
        >
          Don&apos;t Trust One AI.{' '}
          <br className="hidden sm:inline" />
          <span className="gradient-text">Trust a Team of AI Researchers.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-xl text-zinc-400 leading-relaxed font-normal"
        >
          Veritas AI autonomously researches, verifies, challenges and validates information using specialized AI agents before producing an evidence-backed report.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Research</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <button
            onClick={onSeeDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/80 px-8 py-4 text-base font-semibold text-zinc-200 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 backdrop-blur-xl"
          >
            <Play className="h-4 w-4 fill-cyan-400 text-cyan-400" />
            <span>See Interactive Demo</span>
          </button>
        </motion.div>

        {/* Live Teaser / Hero Preview Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#121215]/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-zinc-500">veritas-ai // live-mission-control</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              9 Agents Active
            </div>
          </div>

          {/* Grid Teaser of Agent Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-left">
            {[
              { icon: '🧠', name: 'Orchestrator', task: 'Planning execution strategy', status: 'Active', color: 'border-cyan-500/40 bg-cyan-500/10' },
              { icon: '🗺', name: 'Strategist', task: 'Decomposed 4 research vectors', status: 'Done', color: 'border-purple-500/40 bg-purple-500/10' },
              { icon: '🔍', name: 'Search Specialist', task: 'Discovered 14 primary sources', status: 'Done', color: 'border-blue-500/40 bg-blue-500/10' },
              { icon: '📚', name: 'Research Analyst', task: 'Summarizing paper extracts', status: 'Active', color: 'border-indigo-500/40 bg-indigo-500/10' },
              { icon: '📝', name: 'Evidence Analyst', task: 'Extracted 6 atomic claims', status: 'Active', color: 'border-cyan-500/40 bg-cyan-500/10' },
              { icon: '✅', name: 'Verifier', task: 'Cross-checking with NEJM', status: 'Active', color: 'border-emerald-500/40 bg-emerald-500/10' },
              { icon: '⚔', name: 'Contradiction Detector', task: 'Flagged exercise discrepancy', status: 'Warning', color: 'border-amber-500/40 bg-amber-500/10' },
              { icon: '📊', name: 'Confidence Scorer', task: 'Calculated 94% Trust Score', status: 'Done', color: 'border-emerald-500/40 bg-emerald-500/10' },
            ].map((agent, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border ${agent.color} p-3 transition-all hover:scale-[1.02] backdrop-blur-md`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{agent.icon}</span>
                  <span className="font-mono text-[10px] uppercase font-semibold text-zinc-300 bg-white/10 px-1.5 py-0.5 rounded">
                    {agent.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white tracking-tight">{agent.name}</h4>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">{agent.task}</p>
              </div>
            ))}
          </div>

          {/* Floating Confidence Highlight */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 p-4">
            <div className="flex items-center gap-3 text-left mb-2 sm:mb-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Autonomous Evidence Verification Engine</h4>
                <p className="text-xs text-zinc-400 font-mono">100% Citation Traceability • Zero Black-Box Answers</p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
              Overall Confidence: <span className="text-sm font-bold text-white">94%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
