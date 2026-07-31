'use client';

import React from 'react';
import { Claim } from '@/lib/types';
<<<<<<< HEAD
import { CheckCircle2, AlertCircle, HelpCircle, ArrowUpRight, ExternalLink } from 'lucide-react';
=======
import { CheckCircle2, AlertCircle, HelpCircle, ArrowUpRight } from 'lucide-react';
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c

interface ClaimCardProps {
  claim: Claim;
  onInspectClaim: (claim: Claim) => void;
}

export default function ClaimCard({ claim, onInspectClaim }: ClaimCardProps) {
  return (
<<<<<<< HEAD
    <div className="group rounded-2xl border border-white/10 bg-[#121215]/80 p-4 transition-all hover:border-white/20 hover:bg-[#121215] backdrop-blur-xl flex flex-col justify-between">
=======
    <div className="group rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-all hover:border-[#171717] dark:hover:border-zinc-500 hover:shadow-md flex flex-col justify-between font-sans">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
      <div>
        {/* Status & Confidence Header */}
        <div className="flex items-center justify-between mb-3">
          {claim.status === 'verified' && (
<<<<<<< HEAD
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
=======
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-800 dark:text-emerald-300">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified Claim
            </span>
          )}

          {claim.status === 'mixed' && (
<<<<<<< HEAD
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-400">
=======
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-[11px] font-mono font-medium text-amber-800 dark:text-amber-300">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
              <AlertCircle className="h-3.5 w-3.5" /> Mixed Evidence
            </span>
          )}

          {claim.status === 'unsupported' && (
<<<<<<< HEAD
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-400">
=======
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 text-[11px] font-mono font-medium text-rose-800 dark:text-rose-300">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
              <HelpCircle className="h-3.5 w-3.5" /> Unsupported
            </span>
          )}

<<<<<<< HEAD
          <span className="font-mono text-xs font-bold text-zinc-300">
=======
          <span className="font-mono text-[11px] font-medium text-[#4d4d4d] dark:text-zinc-400">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
            {claim.confidenceScore}% Certainty
          </span>
        </div>

        {/* Claim Text */}
<<<<<<< HEAD
        <h4 className="text-sm font-semibold text-white leading-relaxed mb-2">
=======
        <h4 className="text-[14px] font-semibold text-[#171717] dark:text-white leading-relaxed mb-2 min-w-0 break-words">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          &quot;{claim.statement}&quot;
        </h4>

        {/* Reasoning snippet */}
<<<<<<< HEAD
        <p className="text-xs text-zinc-400 font-sans leading-normal line-clamp-2">
=======
        <p className="text-[12px] text-[#4d4d4d] dark:text-zinc-400 leading-normal line-clamp-2 min-w-0 break-words">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          {claim.reasoning}
        </p>
      </div>

      {/* Footer Info & Drawer Trigger */}
<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span>{claim.supportingSourceIds.length} Supporting Sources</span>
          {claim.conflictingSourceIds.length > 0 && (
            <span className="text-amber-400 font-bold">• {claim.conflictingSourceIds.length} Conflict</span>
=======
      <div className="mt-4 flex items-center justify-between border-t border-[#f2f2f2] dark:border-zinc-800 pt-3">
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#8f8f8f] dark:text-zinc-400">
          <span>{claim.supportingSourceIds.length} Supporting Sources</span>
          {claim.conflictingSourceIds.length > 0 && (
            <span className="text-amber-600 dark:text-amber-400 font-medium">• {claim.conflictingSourceIds.length} Conflict</span>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          )}
        </div>

        <button
          onClick={() => onInspectClaim(claim)}
<<<<<<< HEAD
          className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/20"
        >
          <span>Inspect Evidence</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
=======
          className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#171717] dark:text-white hover:bg-[#171717] hover:text-white dark:hover:bg-white dark:hover:text-[#171717] transition-all bg-[#fafafa] dark:bg-zinc-800 px-3 py-1 rounded-full border border-[#ebebeb] dark:border-zinc-700"
        >
          <span>Inspect Evidence</span>
          <ArrowUpRight className="h-3 w-3" />
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
        </button>
      </div>
    </div>
  );
}
