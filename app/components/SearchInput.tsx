'use client';

import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, CornerDownLeft, Mic } from 'lucide-react';
import { PRESET_QUERIES } from '@/lib/mockData';
import { PresetQuery } from '@/lib/types';

interface SearchInputProps {
  onSearch: (question: string) => void;
  onSelectPreset: (preset: PresetQuery) => void;
  isExecuting?: boolean;
}

export default function SearchInput({ onSearch, onSelectPreset, isExecuting }: SearchInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isExecuting) return;
    onSearch(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 opacity-40 blur-md group-hover:opacity-75 transition-opacity" />

        <div className="relative flex flex-col rounded-3xl border border-white/10 bg-[#121215]/90 backdrop-blur-2xl p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mt-1">
              <Search className="h-5 w-5" />
            </div>

            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any research question... (e.g. Should I trust intermittent fasting?)"
              rows={2}
              className="w-full bg-transparent text-white text-base sm:text-lg placeholder:text-zinc-500 focus:outline-none resize-none pt-2"
            />
          </div>

          {/* Bottom Toolbar inside Input Box */}
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px]">
                <CornerDownLeft className="h-3 w-3" /> ⌘ + Enter
              </span>
              <span className="text-[11px] text-cyan-400 font-semibold">9 Agents Ready</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>

              <button
                type="submit"
                disabled={!value.trim() || isExecuting}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{isExecuting ? 'Researching...' : 'Start Research'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-purple-400" /> Preset Questions:
        </span>
        {PRESET_QUERIES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300 backdrop-blur-md"
          >
            {preset.question}
          </button>
        ))}
      </div>
    </div>
  );
}
