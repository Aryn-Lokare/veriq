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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border-l border-[#ebebeb] dark:border-zinc-800 p-6 sm:p-8 shadow-2xl h-full overflow-y-auto z-10 font-sans flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ebebeb] dark:border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#171717] dark:text-white" />
                <h3 className="text-[11px] font-mono font-medium text-[#171717] dark:text-white uppercase tracking-wider">
                  Evidence & Verification Drawer
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-800 text-[#171717] dark:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Claim Statement */}
            <div className="rounded-[12px] border border-[#171717] dark:border-zinc-700 bg-[#fafafa] dark:bg-zinc-800/80 p-5 mb-6">
              <span className="font-mono text-[10px] font-medium text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-widest">
                Target Claim Statement
              </span>
              <h2 className="text-[16px] font-bold text-[#171717] dark:text-white mt-1 leading-snug">
                &quot;{claim.statement}&quot;
              </h2>

              <div className="mt-3 flex items-center justify-between border-t border-[#ebebeb] dark:border-zinc-700 pt-3 text-[11px] font-mono">
                <span className="text-[#8f8f8f] dark:text-zinc-400">Extracted by: <span className="text-[#171717] dark:text-white font-medium">{claim.extractedByAgent}</span></span>
                <span className="text-[#171717] dark:text-white font-bold">{claim.confidenceScore}% Certainty</span>
              </div>
            </div>

            {/* Verification Reasoning */}
            <div className="mb-6 space-y-2">
              <h4 className="text-[11px] font-mono font-medium text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#171717] dark:text-white" />
                Verification Reasoning
              </h4>
              <p className="text-[13px] text-[#4d4d4d] dark:text-zinc-300 bg-[#fafafa] dark:bg-zinc-800/60 p-4 rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 leading-relaxed">
                {claim.reasoning}
              </p>
            </div>

            {/* Supporting Quotes */}
            {claim.keyQuotes && claim.keyQuotes.length > 0 && (
              <div className="mb-6 space-y-3">
                <h4 className="text-[11px] font-mono font-medium text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Quote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Extracted Primary Quotes
                </h4>
                {claim.keyQuotes.map((quote, qIdx) => (
                  <div
                    key={qIdx}
                    className="rounded-[12px] border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 text-[12px] italic text-emerald-900 dark:text-emerald-200 leading-relaxed"
                  >
                    &ldquo;{quote}&rdquo;
                  </div>
                ))}
              </div>
            )}

            {/* Contradictions */}
            {relatedContradiction && (
              <div className="mb-6 space-y-2">
                <h4 className="text-[11px] font-mono font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Detected Discrepancy
                </h4>
                <div className="rounded-[12px] border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/30 p-4 text-[12px] text-amber-900 dark:text-amber-200 space-y-1">
                  <span className="font-bold">{relatedContradiction.topic}</span>
                  <p>{relatedContradiction.explanation}</p>
                </div>
              </div>
            )}

            {/* Supporting Sources */}
            <div className="mb-6 space-y-3">
              <h4 className="text-[11px] font-mono font-medium text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Supporting Literature ({supportingSources.length})
              </h4>
              <div className="space-y-2">
                {supportingSources.map((src) => (
                  <div key={src.id} className="rounded-[10px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-800/60 p-3 flex items-center justify-between text-[12px]">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-medium text-[#171717] dark:text-white truncate">{src.title}</span>
                      <span className="font-mono text-[10px] text-[#8f8f8f] dark:text-zinc-400">{src.domain} • Score: {src.credibilityScore}/100</span>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-[6px] text-[#8f8f8f] dark:text-zinc-400 hover:text-[#171717] dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-700 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#ebebeb] dark:border-zinc-800">
            <button
              onClick={onClose}
              className="w-full rounded-full bg-[#171717] dark:bg-white py-2.5 text-[13px] font-medium text-white dark:text-[#171717] shadow-sm hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 transition-colors"
            >
              Close Drawer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
