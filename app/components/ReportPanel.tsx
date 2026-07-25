'use client';

import React from 'react';
import { ResearchReport, Claim } from '@/lib/types';
import ConfidenceGauge from './ConfidenceGauge';
import ClaimCard from './ClaimCard';
import {
  FileText,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Download,
  Share2,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ReportPanelProps {
  report: ResearchReport;
  onInspectClaim: (claim: Claim) => void;
  onExportPDF: () => void;
  onShareReport: () => void;
}

export default function ReportPanel({
  report,
  onInspectClaim,
  onExportPDF,
  onShareReport,
}: ReportPanelProps) {
  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            Verified Research Report
          </h2>
          <span className="text-[10px] font-mono text-zinc-400">Generated: {report.timestamp}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShareReport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>

          <button
            onClick={onExportPDF}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Confidence Gauge */}
      <ConfidenceGauge confidence={report.overallConfidence} />

      {/* Executive Summary */}
      <div className="rounded-3xl border border-white/10 bg-[#121215]/80 p-5 shadow-xl backdrop-blur-xl space-y-3">
        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          Executive Summary
        </h3>
        <p className="text-sm text-zinc-200 font-sans leading-relaxed">
          {report.executiveSummary}
        </p>
      </div>

      {/* Verified Claims Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Extracted & Verified Claims ({report.verifiedClaims.length})
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">Click to inspect evidence</span>
        </div>

        <div className="space-y-3">
          {report.verifiedClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} onInspectClaim={onInspectClaim} />
          ))}
        </div>
      </div>

      {/* Contradiction Warning Alert */}
      {report.contradictions && report.contradictions.length > 0 && (
        <div className="rounded-3xl border border-amber-500/40 bg-amber-950/20 p-5 shadow-xl backdrop-blur-xl space-y-3">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Detected Contradiction & Discrepancies ({report.contradictions.length})
          </h3>

          {report.contradictions.map((cnt) => (
            <div key={cnt.id} className="text-xs space-y-1 bg-white/5 p-3 rounded-2xl border border-amber-500/20">
              <span className="font-bold text-amber-300">{cnt.topic}</span>
              <p className="text-zinc-300 leading-normal">{cnt.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div className="rounded-3xl border border-white/10 bg-[#121215]/80 p-5 shadow-xl backdrop-blur-xl space-y-3">
        <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-purple-400" />
          Evidence-Based Action Recommendations
        </h3>
        <ul className="space-y-2 text-xs text-zinc-300 font-sans">
          {report.recommendations.map((rec, rIdx) => (
            <li key={rIdx} className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
              <span className="font-mono text-purple-400 font-bold shrink-0">{rIdx + 1}.</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* References & Citations */}
      <div className="rounded-3xl border border-white/10 bg-[#121215]/80 p-5 shadow-xl backdrop-blur-xl space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-400" />
          Primary Literature References ({report.sources.length})
        </h3>
        <div className="space-y-2 text-xs">
          {report.sources.map((src) => (
            <div key={src.id} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-semibold text-white truncate">{src.title}</span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {src.domain} • Score: {src.credibilityScore}/100
                </span>
              </div>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                title="Open Source"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
