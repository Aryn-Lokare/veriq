'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResearchReport } from '@/lib/types';
import {
  X,
  Printer,
  Download,
  Share2,
  Copy,
  Check,
  Settings,
  Shield,
  Cpu,
  Globe,
  Sliders,
} from 'lucide-react';

interface ExportModalProps {
  report: ResearchReport | null;
  onClose: () => void;
}

export function ExportModal({ report, onClose }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `veritas-report-${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#121215] p-6 sm:p-8 shadow-2xl z-10 font-sans">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Export Evidence-Backed Report</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-zinc-300">
            Export full verified report for query: <span className="text-white font-bold">&quot;{report.query}&quot;</span>
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex justify-between text-zinc-400 font-mono text-[11px]">
              <span>Overall Confidence Score:</span>
              <span className="text-emerald-400 font-bold">{report.overallConfidence.finalScore}%</span>
            </div>
            <div className="flex justify-between text-zinc-400 font-mono text-[11px]">
              <span>Verified Claims:</span>
              <span className="text-white font-bold">{report.verifiedClaims.length} Claims</span>
            </div>
            <div className="flex justify-between text-zinc-400 font-mono text-[11px]">
              <span>Citations:</span>
              <span className="text-white font-bold">{report.sources.length} Sources</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 p-3 font-semibold text-white shadow-lg"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 font-semibold text-zinc-200 hover:bg-white/10"
            >
              <Download className="h-4 w-4 text-purple-400" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#121215] p-6 shadow-2xl z-10 font-sans">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Share Verified Report</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-zinc-300">
            Anyone with this link can view the interactive evidence graph and verification breakdown.
          </p>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black p-3 font-mono">
            <input type="text" readOnly value={shareUrl} className="w-full bg-transparent text-zinc-300 focus:outline-none truncate text-xs" />
            <button onClick={handleCopy} className="p-2 rounded-xl bg-cyan-500 text-zinc-950 font-bold shrink-0">
              {copied ? <Check className="h-4 w-4 text-emerald-950" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="border-t border-white/10 pt-3 text-[11px] font-mono text-zinc-500 flex justify-between">
            <span>Link Expiry: Never</span>
            <span className="text-cyan-400">Public Read-Only</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#121215] p-6 sm:p-8 shadow-2xl z-10 font-sans">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Autonomous Agent Settings</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 text-xs">
          {/* Model Selection */}
          <div className="space-y-2">
            <label className="font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" /> Core Agent Engine
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black p-3 text-white focus:outline-none"
            >
              <option value="gpt-4o">OpenAI GPT-4o Multi-Agent Matrix</option>
              <option value="claude-3-5">Anthropic Claude 3.5 Sonnet</option>
              <option value="gemini-1-5">Google Gemini 1.5 Pro</option>
            </select>
          </div>

          {/* Research Depth */}
          <div className="space-y-2">
            <label className="font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-purple-400" /> Verification Depth
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['fast', 'deep', 'exhaustive'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`p-3 rounded-2xl border font-mono capitalize transition-all ${
                    depth === d ? 'border-cyan-500 bg-cyan-500/10 text-white font-bold' : 'border-white/10 bg-white/5 text-zinc-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Search Endpoints */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <label className="font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-emerald-400" /> Connected Search Providers
            </label>
            <div className="space-y-1.5 text-zinc-300 font-mono text-[11px]">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                <span>Tavily Search API</span>
                <span className="text-emerald-400 font-bold">Connected</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                <span>Firecrawl Web Scraper</span>
                <span className="text-emerald-400 font-bold">Connected</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                <span>PubMed & arXiv Academic Engine</span>
                <span className="text-emerald-400 font-bold">Connected</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-cyan-500 text-xs font-bold text-zinc-950 hover:bg-cyan-400"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
