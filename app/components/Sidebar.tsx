'use client';

import React from 'react';
import Link from 'next/link';
import {
<<<<<<< HEAD
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
=======
  History,
  Bookmark,
  Settings,
  User,
  LogOut,
  Trash2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import type { SessionSummaryDTO } from '@/lib/backend/types';
import ThemeToggle from '@/app/components/ThemeToggle';

interface SidebarProps {
  isOpen?: boolean;
  sessions?: SessionSummaryDTO[];
  loadingSessions?: boolean;
  currentQueryId?: string | null;
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string, e: React.MouseEvent) => void;
  deletingId?: string | null;
  onSelectQuery?: (question: string) => void;
  onNewResearch?: () => void;
  onOpenSettings?: () => void;
  onOpenSaved?: () => void;
  userName?: string;
  userEmail?: string;
  onSignOut?: () => void;
}

export default function Sidebar({
  isOpen = true,
  sessions,
  loadingSessions,
  currentQueryId,
  onSelectSession,
  onDeleteSession,
  deletingId,
  onNewResearch,
  onOpenSettings,
  onOpenSaved,
  userName = 'Lead Researcher',
  userEmail,
  onSignOut,
}: SidebarProps) {
  const historyCount = sessions?.length ?? 0;

  return (
    <aside
      className={`relative z-20 shrink-0 bg-white dark:bg-[#09090b] transition-all duration-300 ease-in-out font-sans flex flex-col justify-between h-full selection:bg-[#d3e5ff] dark:selection:bg-zinc-800 ${
        isOpen ? 'w-64 border-r border-[#ebebeb] dark:border-zinc-800 p-4' : 'w-0 border-r-0 p-0 overflow-hidden opacity-0'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col space-y-6">
        {/* Geist Brand Header */}
        <Link href="/" className="flex items-center justify-between px-2 group">
          <div className="flex items-center gap-2">
            <span className="text-[22px] font-bold tracking-[-0.6px] text-[#171717] dark:text-white">
              Veriq
            </span>
            <span className="rounded-full bg-[#fafafa] dark:bg-zinc-900 border border-[#ebebeb] dark:border-zinc-800 px-2 py-0.5 text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider">
              Workspace
            </span>
          </div>
        </Link>

        {/* Vercel Pill CTA: New Research */}
        <button
          onClick={onNewResearch}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#171717] dark:bg-white py-2.5 px-4 text-[13px] font-medium text-white dark:text-[#171717] shadow-sm transition-all hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 active:scale-[0.98]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Research</span>
        </button>

        {/* Geist Technical Eyebrow & Session History */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between px-2 text-[10px] font-mono uppercase text-[#8f8f8f] dark:text-zinc-400 tracking-wider">
            <span className="flex items-center gap-1.5 font-medium">
              <History className="h-3 w-3 text-[#171717] dark:text-zinc-300" />
              History
            </span>
            <span className="text-[10px] text-[#8f8f8f] dark:text-zinc-400 font-mono">{historyCount}</span>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-64 pr-1">
            {loadingSessions && (
              <div className="flex items-center gap-2 py-4 justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-[#8f8f8f] dark:text-zinc-400" />
                <span className="text-[12px] font-mono text-[#8f8f8f] dark:text-zinc-400">Loading...</span>
              </div>
            )}

            {!loadingSessions && sessions && sessions.length === 0 && (
              <div className="py-4 text-center text-[12px] font-mono text-[#8f8f8f] dark:text-zinc-500">
                No past sessions
              </div>
            )}

            {/* Real Sessions list in Vercel Geist style */}
            {!loadingSessions && sessions && sessions.map((s) => {
              const isSelected = currentQueryId === s.sessionId;
              return (
                <div
                  key={s.sessionId}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSession?.(s.sessionId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelectSession?.(s.sessionId);
                  }}
                  className={`w-full text-left rounded-[8px] p-2.5 transition-all text-[13px] flex items-center justify-between group cursor-pointer border ${
                    isSelected
                      ? 'bg-[#171717] dark:bg-white border-[#171717] dark:border-white text-white dark:text-[#171717] font-medium shadow-sm'
                      : 'text-[#4d4d4d] dark:text-zinc-300 bg-transparent border-transparent hover:bg-[#fafafa] dark:hover:bg-zinc-900 hover:border-[#ebebeb] dark:hover:border-zinc-800 hover:text-[#171717] dark:hover:text-white'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate leading-snug">{s.question}</span>
                    <span className={`text-[10px] font-mono truncate mt-0.5 ${isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-[#8f8f8f] dark:text-zinc-400'}`}>
                      {s.confidenceScore !== null ? `Confidence: ${s.confidenceScore}%` : s.status}
                    </span>
                  </div>
                  {onDeleteSession && (
                    <button
                      onClick={(e) => onDeleteSession(s.sessionId, e)}
                      disabled={deletingId === s.sessionId}
                      title="Delete session"
                      className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-[4px] ${
                        isSelected ? 'text-zinc-300 dark:text-zinc-600 hover:text-rose-300 hover:bg-white/10' : 'text-[#8f8f8f] dark:text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                      }`}
                    >
                      {deletingId === s.sessionId ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    </button>
                  )}
                </div>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
              );
            })}
          </div>
        </div>

        {/* Navigation Tools */}
<<<<<<< HEAD
        <div className="flex flex-col space-y-1 border-t border-white/10 pt-4">
          <button
            onClick={onOpenSaved}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Bookmark className="h-4 w-4 text-purple-400" />
=======
        <div className="flex flex-col space-y-1 border-t border-[#ebebeb] dark:border-zinc-800 pt-4">
          <ThemeToggle variant="full" />

          <button
            onClick={onOpenSaved}
            className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13px] font-medium text-[#4d4d4d] dark:text-zinc-300 hover:bg-[#fafafa] dark:hover:bg-zinc-900 hover:text-[#171717] dark:hover:text-white transition-colors"
          >
            <Bookmark className="h-4 w-4 text-[#171717] dark:text-zinc-200" />
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
            <span>Saved Reports</span>
          </button>

          <button
            onClick={onOpenSettings}
<<<<<<< HEAD
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4 text-indigo-400" />
=======
            className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13px] font-medium text-[#4d4d4d] dark:text-zinc-300 hover:bg-[#fafafa] dark:hover:bg-zinc-900 hover:text-[#171717] dark:hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4 text-[#171717] dark:text-zinc-200" />
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
            <span>Agent Settings</span>
          </button>
        </div>
      </div>

      {/* User Profile Card */}
<<<<<<< HEAD
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
=======
      <div className="border-t border-[#ebebeb] dark:border-zinc-800 pt-4 mt-auto">
        <div className="rounded-[10px] border border-[#ebebeb] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-medium text-xs">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium text-[#171717] dark:text-white truncate leading-tight">{userName}</span>
              <span className="text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400 truncate">{userEmail || 'Pro Researcher'}</span>
            </div>
          </div>

          {onSignOut ? (
            <button
              onClick={onSignOut}
              title="Sign Out"
              className="p-1.5 rounded-[6px] text-[#8f8f8f] dark:text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <Link href="/" title="Sign Out" className="p-1.5 rounded-[6px] text-[#8f8f8f] dark:text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
              <LogOut className="h-4 w-4" />
            </Link>
          )}
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
        </div>
      </div>
    </aside>
  );
}
