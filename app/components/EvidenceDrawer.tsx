'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Claim, Source, Contradiction } from '@/lib/types';
import { X, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck, Quote, BookOpen } from 'lucide-react';

interface EvidenceDrawerProps {
  claim: Claim | null;
  sources: Source[];
  contradictions: Contradiction[];
  onClose: () => void;
}

export default function EvidenceDrawer({ claim, sources, contradictions, onClose }: EvidenceDrawerProps) {
  if (!claim) return null;

  const supportingSources = sources.filter((s) => claim.supportingSourceIds.includes(s.id));
  const conflictingSources = sources.filter((s) => claim.conflictingSourceIds.includes(s.id));
  const relatedContradiction = contradictions.find(
    (c) => claim.supportingSourceIds.includes(c.sourceAId) || claim.conflictingSourceIds.includes(c.sourceBId)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl bg-[#09090b] border-l border-white/10 p-6 sm:p-8 shadow-2xl h-full overflow-y-auto z-10 font-sans flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Evidence & Verification Drawer
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Claim Statement */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 mb-6">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                Target Claim Statement
              </span>
              <h2 className="text-lg font-bold text-white mt-1 leading-snug">
                &quot;{claim.statement}&quot;
              </h2>

              <div className="mt-3 flex items-center justify-between border-t border-cyan-500/20 pt-3 text-xs font-mono">
                <span className="text-zinc-400">Extracted by: <span className="text-white font-bold">{claim.extractedByAgent}</span></span>
                <span className="text-cyan-300 font-bold">{claim.confidenceScore}% Certainty</span>
              </div>
            </div>

            {/* Verification Reasoning */}
            <div className="mb-6 space-y-2">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-400" />
                Verification Reasoning
              </h4>
              <p className="text-sm text-zinc-300 bg-white/5 p-4 rounded-2xl border border-white/5 leading-relaxed">
                {claim.reasoning}
              </p>
            </div>

            {/* Supporting Quotes */}
            {claim.keyQuotes && claim.keyQuotes.length > 0 && (
              <div className="mb-6 space-y-3">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Quote className="h-4 w-4 text-emerald-400" />
                  Extracted Primary Quotes
                </h4>
                {claim.keyQuotes.map((quote, qIdx) => (
                  <div
                    key={qIdx}
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4 text-xs font-serif italic text-emerald-200"
                  >
                    &ldquo;{quote}&rdquo;
                  </div>
                ))}
              </div>
            )}

            {/* Contradictions Section if any */}
            {relatedContradiction && (
              <div className="mb-6 space-y-3">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Detected Contradiction & Discrepancy
                </h4>
                <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 space-y-2 text-xs">
                  <div className="font-bold text-amber-300">{relatedContradiction.topic}</div>
                  <p className="text-zinc-300 leading-relaxed">{relatedContradiction.explanation}</p>
                  <div className="font-mono text-[10px] text-amber-400 font-bold">
                    Confidence Impact: {relatedContradiction.impactOnConfidence} pts
                  </div>
                </div>
              </div>
            )}

            {/* Primary Sources */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Primary Supporting Documents ({supportingSources.length})
              </h4>
              {supportingSources.map((src) => (
                <div
                  key={src.id}
                  className="rounded-2xl border border-white/10 bg-[#121215] p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {src.type} • Score: {src.credibilityScore}/100
                    </span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[10px]"
                    >
                      {src.domain} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <h5 className="font-semibold text-white">{src.title}</h5>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">{src.snippet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-white/10 pt-4 mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white shadow-lg"
            >
              Close Evidence Drawer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
