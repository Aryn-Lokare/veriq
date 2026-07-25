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

function renderInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-[#171717] dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={index} className="font-mono text-xs bg-[#fafafa] dark:bg-zinc-800 text-[#171717] dark:text-zinc-200 px-1.5 py-0.5 rounded border border-[#ebebeb] dark:border-zinc-700">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function FormattedMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!currentList) return;
    if (currentList.type === 'ol') {
      elements.push(
        <ol key={key} className="space-y-2.5 pl-1 my-3">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[#4d4d4d] dark:text-zinc-300 text-xs sm:text-sm bg-[#fafafa] dark:bg-zinc-800/60 p-3 rounded-[10px] border border-[#ebebeb] dark:border-zinc-800">
              <span className="font-mono text-[#171717] dark:text-white font-bold shrink-0 text-xs mt-0.5">{idx + 1}.</span>
              <span className="flex-1 min-w-0 break-words leading-relaxed">{renderInlineFormatting(item)}</span>
            </li>
          ))}
        </ol>
      );
    } else {
      elements.push(
        <ul key={key} className="space-y-2.5 pl-1 my-3">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[#4d4d4d] dark:text-zinc-300 text-xs sm:text-sm bg-[#fafafa] dark:bg-zinc-800/60 p-3 rounded-[10px] border border-[#ebebeb] dark:border-zinc-800">
              <span className="h-1.5 w-1.5 rounded-full bg-[#171717] dark:bg-white shrink-0 mt-2" />
              <span className="flex-1 min-w-0 break-words leading-relaxed">{renderInlineFormatting(item)}</span>
            </li>
          ))}
        </ul>
      );
    }
    currentList = null;
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(`flush-${idx}`);
      return;
    }

    // Numbered List Item (e.g., "1. ", "7. ")
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      const itemContent = numberedMatch[2];
      if (!currentList || currentList.type !== 'ol') {
        flushList(`flush-${idx}`);
        currentList = { type: 'ol', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      return;
    }

    // Bullet List Item (e.g., "- ", "* ", "• ")
    const bulletMatch = line.match(/^[-*•]\s+(.*)/);
    if (bulletMatch) {
      const itemContent = bulletMatch[1];
      if (!currentList || currentList.type !== 'ul') {
        flushList(`flush-${idx}`);
        currentList = { type: 'ul', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      return;
    }

    // Regular line - flush list first
    flushList(`flush-${idx}`);

    // Section Headers
    if (line.startsWith('#') || (line.startsWith('**') && line.endsWith('**') && line.length < 80)) {
      const headerText = line.replace(/^#+\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '');
      elements.push(
        <h4 key={`header-${idx}`} className="text-sm font-bold text-[#171717] dark:text-white tracking-wide pt-3 pb-1.5 flex items-center gap-2 border-b border-[#ebebeb] dark:border-zinc-800 mt-2">
          <span className="h-2 w-2 rounded-full bg-[#171717] dark:bg-white" />
          {headerText}
        </h4>
      );
      return;
    }

    // Regular Paragraph Line
    elements.push(
      <p key={`p-${idx}`} className="text-[#4d4d4d] dark:text-zinc-300 leading-relaxed text-xs sm:text-sm my-1.5">
        {renderInlineFormatting(line)}
      </p>
    );
  });

  flushList('flush-final');

  return <div className="space-y-1 text-sm text-[#171717] dark:text-zinc-100 font-sans">{elements}</div>;
}

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
    <div className="report-panel print-area max-w-full box-border space-y-6 font-sans">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-[#171717] dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#171717] dark:text-white" />
            Verified Research Report
          </h2>
          <span className="text-[11px] font-mono text-[#8f8f8f] dark:text-zinc-400">Generated: {report.timestamp}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShareReport}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-1.5 text-[12px] font-medium text-[#171717] dark:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>

          <button
            onClick={onExportPDF}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] dark:bg-white px-4 py-1.5 text-[12px] font-medium text-white dark:text-[#171717] shadow-sm hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 active:scale-[0.98] transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Confidence Gauge */}
      <ConfidenceGauge confidence={report.overallConfidence} />

      {/* Executive Summary */}
      <div className="rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#f2f2f2] dark:border-zinc-800 pb-3">
          <h3 className="text-[11px] font-mono font-medium text-[#171717] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#171717] dark:text-white" />
            Executive Summary
          </h3>
          <span className="text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400">AI Synthesized</span>
        </div>

        <FormattedMarkdown content={report.executiveSummary} />
      </div>

      {/* Verified Claims Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-mono font-medium text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Extracted & Verified Claims ({report.verifiedClaims.length})
          </h3>
          <span className="text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400">Click to inspect evidence</span>
        </div>

        <div className="space-y-3">
          {report.verifiedClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} onInspectClaim={onInspectClaim} />
          ))}
        </div>
      </div>

      {/* Contradiction Warning Alert */}
      {report.contradictions && report.contradictions.length > 0 && (
        <div className="rounded-[16px] border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 p-5 shadow-sm space-y-3">
          <h3 className="text-[11px] font-mono font-medium text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Detected Contradiction & Discrepancies ({report.contradictions.length})
          </h3>

          {report.contradictions.map((cnt) => (
            <div key={cnt.id} className="text-[12px] space-y-1 bg-white dark:bg-zinc-900 p-3.5 rounded-[10px] border border-amber-200 dark:border-amber-900/40">
              <span className="font-bold text-amber-900 dark:text-amber-300">{cnt.topic}</span>
              <p className="text-[#4d4d4d] dark:text-zinc-300 leading-normal">{cnt.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div className="rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <h3 className="text-[11px] font-mono font-medium text-[#171717] dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-[#171717] dark:text-white" />
          Evidence-Based Action Recommendations
        </h3>
        <ul className="space-y-2 text-[13px] text-[#4d4d4d] dark:text-zinc-300 font-sans">
          {report.recommendations.map((rec, rIdx) => (
            <li key={rIdx} className="flex items-start gap-2.5 bg-[#fafafa] dark:bg-zinc-800/60 p-3 rounded-[10px] border border-[#ebebeb] dark:border-zinc-800">
              <span className="font-mono text-[#171717] dark:text-white font-bold shrink-0">{rIdx + 1}.</span>
              <span className="flex-1 min-w-0 break-words">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* References & Citations */}
      <div className="rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <h3 className="text-[11px] font-mono font-medium text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#171717] dark:text-white" />
          Primary Literature References ({report.sources.length})
        </h3>
        <div className="space-y-2 text-[12px]">
          {report.sources.map((src) => (
            <div key={src.id} className="flex items-center justify-between bg-[#fafafa] dark:bg-zinc-800/60 p-3 rounded-[10px] border border-[#ebebeb] dark:border-zinc-800">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-medium text-[#171717] dark:text-white truncate">{src.title}</span>
                <span className="text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400">
                  {src.domain} • Score: {src.credibilityScore}/100
                </span>
              </div>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-[6px] text-[#8f8f8f] dark:text-zinc-400 hover:text-[#171717] dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors"
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
