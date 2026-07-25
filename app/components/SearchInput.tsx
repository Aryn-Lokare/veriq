'use client';

import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, CornerDownLeft, Mic } from 'lucide-react';

interface SearchInputProps {
  onSearch: (question: string) => void;
  onSelectPreset?: (question: string) => void;
  isExecuting?: boolean;
  compact?: boolean;
}

const DEFAULT_PRESET_QUESTIONS = [
  'Does coffee reduce Alzheimer\'s risk?',
  'Will AI replace software engineers?',
  'Can renewable energy replace fossil fuels?',
];

export default function SearchInput({ onSearch, onSelectPreset, isExecuting, compact = false }: SearchInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isExecuting) return;
    onSearch(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (compact) {
    return (
      <div className="w-full max-w-3xl mx-auto font-sans">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center gap-3 rounded-full border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 shadow-sm transition-all focus-within:border-[#171717] dark:focus-within:border-zinc-400">
            <Search className="h-4 w-4 text-[#8f8f8f] dark:text-zinc-400 shrink-0" />

            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up research question..."
              rows={1}
              className="w-full bg-transparent text-[#171717] dark:text-white text-[13px] placeholder:text-[#8f8f8f] dark:placeholder:text-zinc-500 focus:outline-none resize-none py-1 leading-normal max-h-24"
            />

            <button
              type="submit"
              disabled={!value.trim() || isExecuting}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] dark:bg-white px-4 py-1.5 text-[12px] font-medium text-white dark:text-[#171717] shadow-sm transition-all hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <span>{isExecuting ? 'Running...' : 'Research'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 font-sans">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex flex-col rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm transition-all focus-within:border-[#171717] dark:focus-within:border-zinc-400">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] dark:bg-zinc-800 border border-[#ebebeb] dark:border-zinc-700 text-[#171717] dark:text-white mt-1">
              <Search className="h-4 w-4" />
            </div>

            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any research question... (e.g. Should I trust intermittent fasting?)"
              rows={2}
              className="w-full bg-transparent text-[#171717] dark:text-white text-[15px] placeholder:text-[#8f8f8f] dark:placeholder:text-zinc-500 focus:outline-none resize-none pt-1.5 leading-relaxed font-sans"
            />
          </div>

          {/* Bottom Toolbar inside Input Box */}
          <div className="mt-3 flex items-center justify-between border-t border-[#f2f2f2] dark:border-zinc-800 pt-3">
            <div className="flex items-center gap-2 text-[12px] font-mono text-[#8f8f8f] dark:text-zinc-400">
              <span className="hidden sm:inline-flex items-center gap-1 rounded-[4px] bg-[#fafafa] dark:bg-zinc-800 border border-[#ebebeb] dark:border-zinc-700 px-1.5 py-0.5 text-[10px] text-[#4d4d4d] dark:text-zinc-300">
                <CornerDownLeft className="h-3 w-3" /> Enter to send
              </span>
              <span className="text-[11px] text-[#171717] dark:text-zinc-200 font-medium">8 Autonomous Agents</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-[6px] text-[#8f8f8f] dark:text-zinc-400 hover:text-[#171717] dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-zinc-800 transition-colors"
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>

              <button
                type="submit"
                disabled={!value.trim() || isExecuting}
                className="inline-flex items-center gap-2 rounded-full bg-[#171717] dark:bg-white px-5 py-2 text-[13px] font-medium text-white dark:text-[#171717] shadow-sm transition-all hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{isExecuting ? 'Synthesizing...' : 'Start Research'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preset Suggestions Chips */}
      {onSelectPreset && (
        <div className="flex flex-wrap items-center gap-2 justify-center pt-2">
          <span className="text-[11px] font-mono text-[#8f8f8f] dark:text-zinc-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#171717] dark:text-zinc-300" /> Try Asking:
          </span>
          {DEFAULT_PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPreset(q)}
              className="rounded-full border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1 text-[12px] text-[#4d4d4d] dark:text-zinc-300 transition-all hover:border-[#171717] dark:hover:border-zinc-500 hover:text-[#171717] dark:hover:text-white shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
