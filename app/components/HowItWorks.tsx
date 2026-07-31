'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  MapPin,
  Search,
  BookOpen,
  CheckCircle,
  Swords,
  Gauge,
  FileCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const STAGES = [
  {
    step: '01',
    title: 'User Question',
    agent: 'User Input',
    icon: HelpCircle,
    desc: 'You submit any complex research question, hypothesis, or policy inquiry.',
    color: 'text-zinc-300 border-zinc-500/40 bg-zinc-800/50',
    detail: 'Input parsed & pre-tokenized before passing to Orchestrator.',
  },
  {
    step: '02',
    title: 'Research Strategy',
    agent: 'Research Strategist',
    icon: MapPin,
    desc: 'Decomposes prompt into 4-6 discrete factual sub-objectives.',
    color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    detail: 'Generates targeted query vectors for web & academic APIs.',
  },
  {
    step: '03',
    title: 'Search Sources',
    agent: 'Search Specialist',
    icon: Search,
    desc: 'Queries Tavily, Firecrawl, arXiv, PubMed, and government endpoints.',
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    detail: 'Retrieves top 15+ primary documents and verifies SSL/DOI domain authority.',
  },
  {
    step: '04',
    title: 'Analyze Evidence',
    agent: 'Research Analyst',
    icon: BookOpen,
    desc: 'Reads full texts, extracts statistics, and builds structured notes.',
    color: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
    detail: 'Parses methodology sections and empirical sample sizes.',
  },
  {
    step: '05',
    title: 'Verify Claims',
    agent: 'Verification Specialist',
    icon: CheckCircle,
    desc: 'Isolates atomic factual claims and cross-checks with secondary sources.',
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    detail: 'Flags claims as Verified, Mixed Evidence, or Unsupported.',
  },
  {
    step: '06',
    title: 'Detect Contradictions',
    agent: 'Contradiction Detector',
    icon: Swords,
    desc: 'Actively searches for opposing literature to challenge verified claims.',
    color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    detail: 'Identifies methodological discrepancies and conflicting trial results.',
  },
  {
    step: '07',
    title: 'Confidence Score',
    agent: 'Confidence Scorer',
    icon: Gauge,
    desc: 'Calculates mathematical trust score based on explicit factor weights.',
    color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    detail: 'Applies +30 source bonus, +20 peer-review bonus, -15 contradiction penalty.',
  },
  {
    step: '08',
    title: 'Final Report',
    agent: 'Report Writer',
    icon: FileCheck,
    desc: 'Synthesizes verified claims, citations, and actionable recommendations.',
    color: 'text-teal-400 border-teal-500/40 bg-teal-500/10',
    detail: 'Outputs transparent research workspace report ready for PDF export.',
  },
];

export default function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="how-it-works" className="py-20 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold mb-3">
            Autonomous Orchestration Architecture
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
<<<<<<< HEAD
            How Veritas AI Verifies Information
=======
            How Veriq AI Verifies Information
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          </p>
          <p className="mt-4 text-zinc-400 text-base">
            Click any step to inspect the underlying agent logic and execution details.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === idx;
            return (
              <motion.div
                key={idx}
                onClick={() => setActiveStage(idx)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden backdrop-blur-xl ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                    : 'border-white/10 bg-[#121215]/60 hover:border-white/20 hover:bg-[#121215]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-zinc-500 font-bold">{stage.step}</span>
                  <div className={`p-2 rounded-xl border ${stage.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight mb-1">{stage.title}</h3>
                <span className="inline-block font-mono text-[11px] text-cyan-400 font-semibold mb-2">
                  {stage.agent}
                </span>

                <p className="text-xs text-zinc-400 leading-relaxed">{stage.desc}</p>

                {isSelected && (
                  <motion.div
                    layoutId="active-indicator"
                    className="mt-3 border-t border-cyan-500/30 pt-2 flex items-center justify-between text-[11px] font-mono text-cyan-300"
                  >
                    <span>{stage.detail}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Active Stage Deep-Dive Card */}
        <div className="mt-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase">
                  Stage {STAGES[activeStage].step} Detail
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="text-xs text-zinc-300 font-medium">{STAGES[activeStage].agent}</span>
              </div>
              <h4 className="text-xl font-bold text-white mt-1">{STAGES[activeStage].title} Execution Phase</h4>
              <p className="text-sm text-zinc-300 mt-1 max-w-2xl">{STAGES[activeStage].detail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : STAGES.length - 1))}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-zinc-300 hover:bg-white/10"
            >
              ← Previous
            </button>
            <button
              onClick={() => setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0))}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-xs font-mono text-zinc-950 font-bold hover:bg-cyan-400"
            >
              Next Step →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
