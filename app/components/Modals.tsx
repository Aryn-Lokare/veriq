'use client';

import React, { useState } from 'react';
import { ResearchReport } from '@/lib/types';
import {
  X,
  Printer,
  Download,
  Share2,
  Copy,
  Check,
  Settings,
  Cpu,
  Globe,
  Sliders,
  Loader2,
} from 'lucide-react';

interface ExportModalProps {
  report: ResearchReport | null;
  onClose: () => void;
}

export function ExportModal({ report, onClose }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);

  if (!report) return null;

  const handlePrint = async () => {
    setIsExporting(true);
    const reportElement = document.querySelector('.report-panel');
    const htmlContent = reportElement ? reportElement.innerHTML : '';
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ htmlContent, query: report.query }),
      });
      if (!res.ok) throw new Error('PDF export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `veriq-report-${report.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onClose();
    } catch {
      onClose();
      setTimeout(() => {
        window.print();
      }, 150);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `veriq-report-${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-[#ebebeb] dark:border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-[#171717] dark:text-white" />
            <h3 className="text-[15px] font-bold text-[#171717] dark:text-white">Export Evidence-Backed Report</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 text-[#8f8f8f] dark:text-zinc-400 hover:text-[#171717] dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-[13px]">
          <p className="text-[#4d4d4d] dark:text-zinc-300">
            Export full verified report for query: <span className="text-[#171717] dark:text-white font-semibold">&quot;{report.query}&quot;</span>
          </p>

          <div className="rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-800/60 p-4 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between text-[#8f8f8f] dark:text-zinc-400">
              <span>Overall Confidence Score:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{report.overallConfidence.finalScore}%</span>
            </div>
            <div className="flex justify-between text-[#8f8f8f] dark:text-zinc-400">
              <span>Verified Claims:</span>
              <span className="text-[#171717] dark:text-white font-bold">{report.verifiedClaims.length} Claims</span>
            </div>
            <div className="flex justify-between text-[#8f8f8f] dark:text-zinc-400">
              <span>Citations:</span>
              <span className="text-[#171717] dark:text-white font-bold">{report.sources.length} Sources</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handlePrint}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 rounded-full bg-[#171717] dark:bg-white p-2.5 font-medium text-white dark:text-[#171717] shadow-sm hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
              <span>{isExporting ? 'Generating PDF...' : 'Export PDF / Save Report'}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center justify-center gap-2 rounded-full border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 font-medium text-[#171717] dark:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-800 transition-colors"
            >
              <Download className="h-4 w-4 text-[#171717] dark:text-white" />
              <span>Download Raw JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShareModalProps {
  report: ResearchReport | null;
  onClose: () => void;
}

export function ShareModal({ report, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/workspace?reportId=${report.id}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-[#ebebeb] dark:border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-[#171717] dark:text-white" />
            <h3 className="text-[15px] font-bold text-[#171717] dark:text-white">Share Verified Report</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 text-[#8f8f8f] dark:text-zinc-400 hover:text-[#171717] dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-[13px]">
          <p className="text-[#4d4d4d] dark:text-zinc-300">
            Anyone with this link can view the interactive evidence graph and verification breakdown.
          </p>

          <div className="flex items-center gap-2 rounded-[8px] border border-[#ebebeb] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-800 p-2.5 font-mono">
            <input type="text" readOnly value={shareUrl} className="w-full bg-transparent text-[#171717] dark:text-white focus:outline-none truncate text-[12px]" />
            <button onClick={handleCopy} className="px-3 py-1 rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[11px] font-medium shrink-0 hover:bg-[#2c2c2c] dark:hover:bg-zinc-200">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="border-t border-[#ebebeb] dark:border-zinc-800 pt-3 text-[11px] font-mono text-[#8f8f8f] dark:text-zinc-400 flex justify-between">
            <span>Link Expiry: Never</span>
            <span className="text-[#171717] dark:text-white font-medium">Public Read-Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [model, setModel] = useState('gpt-4o');
  const [depth, setDepth] = useState('deep');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-[#ebebeb] dark:border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#171717] dark:text-white" />
            <h3 className="text-[15px] font-bold text-[#171717] dark:text-white">Autonomous Agent Settings</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 text-[#8f8f8f] dark:text-zinc-400 hover:text-[#171717] dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 text-[13px]">
          {/* Model Selection */}
          <div className="space-y-2">
            <label className="font-mono text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider font-medium text-[11px] flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-[#171717] dark:text-white" /> Core Agent Engine
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-[8px] border border-[#ebebeb] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-800 p-2.5 text-[#171717] dark:text-white focus:outline-none focus:border-[#171717] dark:focus:border-zinc-400"
            >
              <option value="gpt-4o">Llama 3.3 Versatile Multi-Agent Mesh</option>
              <option value="claude-3-5">Anthropic Claude 3.5 Sonnet</option>
              <option value="gemini-2-5">Google Gemini 2.5 Flash</option>
            </select>
          </div>

          {/* Research Depth */}
          <div className="space-y-2">
            <label className="font-mono text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider font-medium text-[11px] flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-[#171717] dark:text-white" /> Verification Depth
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['fast', 'deep', 'exhaustive'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`p-2.5 rounded-[8px] border font-mono text-[12px] capitalize transition-all ${
                    depth === d ? 'border-[#171717] dark:border-white bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-medium' : 'border-[#ebebeb] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-800 text-[#4d4d4d] dark:text-zinc-300 hover:border-[#171717] dark:hover:border-zinc-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Search Endpoints */}
          <div className="space-y-2 border-t border-[#ebebeb] dark:border-zinc-800 pt-4">
            <label className="font-mono text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider font-medium text-[11px] flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#171717] dark:text-white" /> Connected Search Providers
            </label>
            <div className="space-y-1.5 text-[#4d4d4d] dark:text-zinc-300 font-mono text-[11px]">
              <div className="flex justify-between items-center bg-[#fafafa] dark:bg-zinc-800 p-2 rounded-[6px] border border-[#ebebeb] dark:border-zinc-700">
                <span>Tavily Search API</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center bg-[#fafafa] dark:bg-zinc-800 p-2 rounded-[6px] border border-[#ebebeb] dark:border-zinc-700">
                <span>Firecrawl Web Scraper</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center bg-[#fafafa] dark:bg-zinc-800 p-2 rounded-[6px] border border-[#ebebeb] dark:border-zinc-700">
                <span>PubMed & arXiv Academic Engine</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Connected</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#ebebeb] dark:border-zinc-800 pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-[#171717] dark:bg-white text-[13px] font-medium text-white dark:text-[#171717] hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
