'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ArrowRight, Layers, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: () => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#09090b]">
              <ShieldCheck className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
<<<<<<< HEAD
                Veritas <span className="text-cyan-400">AI</span>
=======
                Veriq <span className="text-cyan-400">AI</span>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
              </span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-cyan-300">
                v2.0 MVP
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              Autonomous Verification
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#agents" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            9 Agents
          </a>
          <Link href="/workspace" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            Workspace
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 transition-all hover:bg-white/10 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            Sign In
          </button>

          <Link
            href="/workspace"
            className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Research</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
