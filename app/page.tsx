import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] font-sans selection:bg-[#d3e5ff]">
      {/* 1. Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-[#ebebeb] bg-[#fafafa]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-[64px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-[18px] font-semibold tracking-[-0.4px] text-[#171717]">
              Veriq
            </span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-[14px] text-[#4d4d4d] hover:text-[#171717] transition-colors">
              Features
            </a>
            <a href="#architecture" className="text-[14px] text-[#4d4d4d] hover:text-[#171717] transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="text-[14px] text-[#4d4d4d] hover:text-[#171717] transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/workspace"
                  className="flex h-[32px] items-center justify-center rounded-[6px] bg-[#171717] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#2c2c2c]"
                >
                  Go to Workspace
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex h-[32px] items-center justify-center rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[13px] font-medium text-[#171717] transition-colors hover:bg-[#fafafa]"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex h-[32px] items-center justify-center rounded-[6px] bg-[#171717] px-3 text-[13px] font-medium text-white transition-colors hover:bg-[#2c2c2c]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="relative overflow-hidden px-6 py-24 md:py-36 text-center border-b border-[#ebebeb]">
        {/* Soft bloom mesh gradient backdrop */}
        <div className="absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden pointer-events-none">
          <div className="h-[500px] w-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-200/40 via-violet-100/30 to-[#fafafa] opacity-60 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8ccf1] bg-[#d8ccf1]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#7928ca] font-mono mb-6">
            ✨ MVP v2.0 Hackathon Edition
          </div>

          <h1 className="text-[44px] md:text-[64px] font-bold tracking-[-2.4px] leading-[1.05] text-[#171717]">
            Don't trust one AI.<br />
            Trust a team of AI researchers.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[16px] md:text-[18px] leading-7 text-[#4d4d4d]">
            Veritas AI is an autonomous multi-agent research platform where specialized AI agents
            collaborate to research, verify, challenge, and synthesize facts before producing transparent reports.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link
                href="/workspace"
                className="flex h-[48px] items-center justify-center rounded-full bg-[#171717] px-8 text-[15px] font-medium text-white transition-transform hover:scale-102 shadow-[0px_2px_4px_rgba(0,0,0,0.06)]"
              >
                Enter Research Workspace →
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="flex h-[48px] items-center justify-center rounded-full bg-[#171717] px-8 text-[15px] font-medium text-white transition-transform hover:scale-102 shadow-[0px_2px_4px_rgba(0,0,0,0.06)]"
                >
                  Start Researching
                </Link>
                <Link
                  href="/login?demo=true"
                  className="flex h-[48px] items-center justify-center rounded-full border border-[#ebebeb] bg-white px-8 text-[15px] font-medium text-[#171717] transition-colors hover:bg-[#fafafa]"
                >
                  Try Demo Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. Logo Strip */}
      <section className="border-b border-[#ebebeb] bg-[#fafafa] py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">
            Collaborating specialized LLM architectures
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-12 grayscale opacity-45">
            <span className="text-[16px] font-semibold tracking-tight text-[#171717]">GPT-5.5 RESEARCHER</span>
            <span className="text-[16px] font-semibold tracking-tight text-[#171717]">TAVILY SEARCH</span>
            <span className="text-[16px] font-semibold tracking-tight text-[#171717]">LANGGRAPH CORE</span>
            <span className="text-[16px] font-semibold tracking-tight text-[#171717]">FIRECRAWL EXTRACT</span>
          </div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">Why Veritas AI</span>
          <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717]">
            Factual integrity, built by design.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 font-mono font-bold text-lg">01</div>
            <h3 className="mt-6 text-[18px] font-semibold tracking-[-0.4px] text-[#171717]">
              Multi-Agent Orchestration
            </h3>
            <p className="mt-3 text-[14px] leading-6 text-[#4d4d4d]">
              Orchestrates multiple independent AI agents, separating strategists, web searchers, and logic challenge layers.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-violet-100 text-violet-700 font-mono font-bold text-lg">02</div>
            <h3 className="mt-6 text-[18px] font-semibold tracking-[-0.4px] text-[#171717]">
              Claim-Level Verification
            </h3>
            <p className="mt-3 text-[14px] leading-6 text-[#4d4d4d]">
              Extracts core statements and challenges them individually against academic journals and official records.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-pink-100 text-pink-700 font-mono font-bold text-lg">03</div>
            <h3 className="mt-6 text-[18px] font-semibold tracking-[-0.4px] text-[#171717]">
              Contradiction Detection
            </h3>
            <p className="mt-3 text-[14px] leading-6 text-[#4d4d4d]">
              Deploys an independent agent with the explicit goal of proving claims wrong, flagging key conflicts.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="mt-auto border-t border-[#ebebeb] bg-[#fafafa] py-16">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-6 overflow-hidden rounded-[4px] border border-[#ebebeb] bg-white p-0.5">
              <Image
                src="/logo-veriq (2).svg"
                alt="Veritas AI Logo"
                fill
                className="object-contain mix-blend-multiply"
              />
            </div>
            <span className="text-[14px] font-semibold text-[#171717]">Veritas AI</span>
          </div>
          <p className="text-[12px] text-[#8f8f8f]">
            &copy; 2026 Veritas AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
