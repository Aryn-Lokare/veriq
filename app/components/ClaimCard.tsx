'use client';

import React from 'react';
import { Claim } from '@/lib/types';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowUpRight, ExternalLink } from 'lucide-react';

interface ClaimCardProps {
  claim: Claim;
  onInspectClaim: (claim: Claim) => void;
}

export default function ClaimCard({ claim, onInspectClaim }: ClaimCardProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#121215]/80 p-4 transition-all hover:border-white/20 hover:bg-[#121215] backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Status & Confidence Header */}
        <div className="flex items-center justify-between mb-3">
          {claim.status === 'verified' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified Claim
            </span>
          )}

          {claim.status === 'mixed' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-400">
              <AlertCircle className="h-3.5 w-3.5" /> Mixed Evidence
            </span>
          )}

          {claim.status === 'unsupported' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-400">
              <HelpCircle className="h-3.5 w-3.5" /> Unsupported
            </span>
          )}

          <span className="font-mono text-xs font-bold text-zinc-300">
            {claim.confidenceScore}% Certainty
          </span>
        </div>

        {/* Claim Text */}
        <h4 className="text-sm font-semibold text-white leading-relaxed mb-2">
          &quot;{claim.statement}&quot;
        </h4>

        {/* Reasoning snippet */}
        <p className="text-xs text-zinc-400 font-sans leading-normal line-clamp-2">
          {claim.reasoning}
        </p>
      </div>

      {/* Footer Info & Drawer Trigger */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span>{claim.supportingSourceIds.length} Supporting Sources</span>
          {claim.conflictingSourceIds.length > 0 && (
            <span className="text-amber-400 font-bold">• {claim.conflictingSourceIds.length} Conflict</span>
          )}
        </div>

        <button
          onClick={() => onInspectClaim(claim)}
          className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/20"
        >
          <span>Inspect Evidence</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
