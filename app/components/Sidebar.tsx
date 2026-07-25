'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plus,
  History,
  Bookmark,
  Settings,
  ShieldCheck,
  User,
  ChevronRight,
  LogOut,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PRESET_QUERIES } from '@/lib/mockData';
import { PresetQuery } from '@/lib/types';

interface SidebarProps {
  currentQueryId?: string;
  onSelectQuery?: (preset: PresetQuery) => void;
  onNewResearch?: () => void;
  onOpenSettings?: () => void;
  onOpenSaved?: () => void;
}

export default function Sidebar({
  currentQueryId,
  onSelectQuery,
  onNewResearch,
  onOpenSettings,
  onOpenSaved,
}: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-[#09090b]/90 backdrop-blur-xl flex flex-col justify-between h-full p-4 selection:bg-cyan-500/30">
      {/* Top Section */}
      <div className="flex flex-col space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] shadow-md shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#09090b]">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight">Veritas AI</span>
            <span className="text-[10px] font-mono text-zinc-400">Agent Network v2.0</span>
          </div>
        </Link>

        {/* New Research Button */}
        <button
          onClick={onNewResearch}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 p-3 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/35 hover:scale-[1.01] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>New Research</span>
        </button>

        {/* Recent Research History */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
            <span className="flex items-center gap-1.5">
              <History className="h-3 w-3 text-cyan-400" />
              History
            </span>
            <span className="text-[10px] text-zinc-400 font-bold">{PRESET_QUERIES.length}</span>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-56 pr-1">
            {PRESET_QUERIES.map((preset) => {
              const isSelected = currentQueryId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectQuery?.(preset)}
                  className={`w-full text-left rounded-xl p-2.5 transition-all text-xs flex items-center justify-between group ${
                    isSelected
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-white font-semibold'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate">{preset.title}</span>
                    <span className="text-[10px] font-mono text-zinc-400 truncate">
                      Confidence: {preset.report.overallConfidence.finalScore}%
                    </span>
                  </div>
                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-zinc-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tools */}
        <div className="flex flex-col space-y-1 border-t border-white/10 pt-4">
          <button
            onClick={onOpenSaved}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Bookmark className="h-4 w-4 text-purple-400" />
            <span>Saved Reports</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4 text-indigo-400" />
            <span>Agent Settings</span>
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="border-t border-white/10 pt-4 mt-auto">
        <div className="rounded-2xl border border-white/10 bg-[#121215] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white font-bold text-xs">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">Lead Researcher</span>
              <span className="text-[10px] font-mono text-cyan-400 truncate">Autonomous Tier</span>
            </div>
          </div>

          <Link href="/" title="Sign Out" className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
