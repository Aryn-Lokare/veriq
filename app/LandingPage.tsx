'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import HowItWorks from './components/HowItWorks';
import { ExportModal, ShareModal } from './components/Modals';
import { ShieldCheck, ArrowRight, Sparkles, Layers, Terminal, Lock, Mail, Github } from 'lucide-react';

interface LandingPageProps {
  user?: any;
}

export default function LandingPage({ user }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      {/* Background Canvas Particles */}
      <AnimatedBackground />

      {/* Header Bar */}
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />

      <main className="relative z-10">
        {/* Hero Section */}
        <Hero onSeeDemo={() => {
          const el = document.getElementById('how-it-works');
          el?.scrollIntoView({ behavior: 'smooth' });
        }} />

        {/* Feature Cards Grid */}
        <FeatureCard />

        {/* How It Works Timeline */}
        <HowItWorks />

        {/* Bottom CTA Banner */}
        <section className="py-24 relative z-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl overflow-hidden">
              {/* Glow Accent */}
              <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />

              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono font-bold text-cyan-300 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Hackathon Demo Day Ready
              </span>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Experience Transparent AI Research?
              </h2>

              <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
                Stop accepting black-box LLM hallucinations. Deploy 9 autonomous AI agents to verify every claim.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/workspace"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 relative z-10 bg-[#09090b]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white">Veritas AI Framework</span>
          </div>

          <p className="text-xs font-mono text-zinc-500">
            Autonomous Multi-Agent Research Workspace • Designed with Linear & Vercel AI aesthetics
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAuthModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#121215] p-6 sm:p-8 shadow-2xl z-10 font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  {authMode === 'login' ? 'Sign In to Veritas AI' : 'Create Researcher Account'}
                </h3>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <Link
                href="/workspace"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 p-3 font-semibold text-white shadow-lg"
              >
                <span>Continue as Demo Researcher</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink mx-4 text-zinc-500 font-mono text-[10px] uppercase">Or standard login</span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="researcher@veritas.ai"
                    className="w-full rounded-2xl border border-white/10 bg-black p-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-black p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <Link
                  href="/workspace"
                  className="w-full block text-center rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-semibold text-zinc-200 hover:bg-white/10"
                >
                  {authMode === 'login' ? 'Sign In' : 'Register'}
                </Link>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-xs text-cyan-400 hover:underline font-mono"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
