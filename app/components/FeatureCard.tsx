'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Network, ShieldCheck, Swords, Gauge, FileText, Check } from 'lucide-react';

const FEATURES = [
  {
    icon: Network,
    title: 'Multi-Agent Research',
    description: 'Nine autonomous AI agents collaborate in sequence and parallel to break down, search, analyze, and cross-examine evidence.',
    accent: 'from-blue-500/20 to-cyan-500/10 text-cyan-400 border-cyan-500/30',
    bullets: ['Decomposed research vectors', 'Parallel search specialists', 'Autonomous retry logic'],
  },
  {
    icon: ShieldCheck,
    title: 'Evidence Verification',
    description: 'Every claim is parsed into atomic statements and independently verified against peer-reviewed journals and government repos.',
    accent: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    bullets: ['Atomic claim isolation', 'Peer-reviewed cross-checks', 'Source reliability indexing'],
  },
  {
    icon: Swords,
    title: 'Contradiction Detection',
    description: 'Unlike standard single-pass LLMs, our Contradiction Detector actively searches for opposing evidence to challenge conclusions.',
    accent: 'from-amber-500/20 to-rose-500/10 text-amber-400 border-amber-500/30',
    bullets: ['Adversarial disagreement search', 'Methodological discrepancy flags', 'Conflicting study alerts'],
  },
  {
    icon: Gauge,
    title: 'Confidence Scoring',
    description: 'Derives an explainable mathematical trust score based on trusted sources (+30), peer reviews (+20), and contradiction penalties (-15).',
    accent: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
    bullets: ['Transparent math breakdown', 'Zero hidden heuristics', 'Quantified certainty metrics'],
  },
  {
    icon: FileText,
    title: 'Transparent Reports',
    description: 'Generates evidence-backed research reports complete with executive summaries, claim drawers, and downloadable PDF exports.',
    accent: 'from-indigo-500/20 to-blue-500/10 text-indigo-400 border-indigo-500/30',
    bullets: ['Clickable inline citations', 'Slide-out evidence drawers', 'Export to PDF & Markdown'],
  },
];

export default function FeatureCard() {
  return (
    <section id="features" className="py-20 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-3">
            Architected for Absolute Trust
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Why Single-Agent LLMs Fail & How Veritas AI Solves It
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group hover:border-white/20 relative overflow-hidden"
              >
                <div>
                  {/* Icon Header */}
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.accent} border mb-6 shadow-md`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                    {feat.description}
                  </p>
                </div>

                {/* Bullet Highlights */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                  {feat.bullets.map((item, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
