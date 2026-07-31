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
<<<<<<< HEAD
  const conflictingSources = sources.filter((s) => claim.conflictingSourceIds.includes(s.id));
=======

>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
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
<<<<<<< HEAD
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
=======
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
<<<<<<< HEAD
          className="relative w-full max-w-xl bg-[#09090b] border-l border-white/10 p-6 sm:p-8 shadow-2xl h-full overflow-y-auto z-10 font-sans flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
=======
          className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border-l border-[#ebebeb] dark:border-zinc-800 p-6 sm:p-8 shadow-2xl h-full overflow-y-auto z-10 font-sans flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ebebeb] dark:border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#171717] dark:text-white" />
                <h3 className="text-[11px] font-mono font-medium text-[#171717] dark:text-white uppercase tracking-wider">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
                  Evidence & Verification Drawer
                </h3>
              </div>
              <button
                onClick={onClose}
<<<<<<< HEAD
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
=======
                className="p-1.5 rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-800 text-[#171717] dark:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-700 transition-colors"
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Claim Statement */}
<<<<<<< HEAD
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
=======
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
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
              </div>
            </div>

            {/* Verification Reasoning */}
            <div className="mb-6 space-y-2">
<<<<<<< HEAD
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-400" />
                Verification Reasoning
              </h4>
              <p className="text-sm text-zinc-300 bg-white/5 p-4 rounded-2xl border border-white/5 leading-relaxed">
=======
              <h4 className="text-[11px] font-mono font-medium text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#171717] dark:text-white" />
                Verification Reasoning
              </h4>
              <p className="text-[13px] text-[#4d4d4d] dark:text-zinc-300 bg-[#fafafa] dark:bg-zinc-800/60 p-4 rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 leading-relaxed">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
                {claim.reasoning}
              </p>
            </div>

            {/* Supporting Quotes */}
            {claim.keyQuotes && claim.keyQuotes.length > 0 && (
              <div className="mb-6 space-y-3">
<<<<<<< HEAD
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Quote className="h-4 w-4 text-emerald-400" />
=======
                <h4 className="text-[11px] font-mono font-medium text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Quote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
                  Extracted Primary Quotes
                </h4>
                {claim.keyQuotes.map((quote, qIdx) => (
                  <div
                    key={qIdx}
<<<<<<< HEAD
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4 text-xs font-serif italic text-emerald-200"
=======
                    className="rounded-[12px] border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 text-[12px] italic text-emerald-900 dark:text-emerald-200 leading-relaxed"
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
                  >
                    &ldquo;{quote}&rdquo;
                  </div>
                ))}
              </div>
            )}

<<<<<<< HEAD
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
=======
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
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
                </div>
              </div>
            )}

<<<<<<< HEAD
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
=======
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
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
<<<<<<< HEAD
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
=======
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
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
