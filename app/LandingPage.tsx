'use client';

<<<<<<< HEAD
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import HowItWorks from './components/HowItWorks';
import { ExportModal, ShareModal } from './components/Modals';
import { ShieldCheck, ArrowRight, Sparkles, Layers, Terminal, Lock, Mail, Github } from 'lucide-react';
=======
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  Layers,
  Check,
  ChevronRight,
  TrendingUp,
  Cpu,
  Brain,
  ShieldCheck,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c

interface LandingPageProps {
  user?: any;
}

export default function LandingPage({ user }: LandingPageProps) {
<<<<<<< HEAD
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
=======
  // --- Simulation State ---
  const [query, setQuery] = useState("Will AI replace software engineers?");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(-1);
  const [showReport, setShowReport] = useState(false);
  const [activeQuestionCategory, setActiveQuestionCategory] = useState("technology");
  const [activeArchitectureAgent, setActiveArchitectureAgent] = useState("orchestrator");
  const [activeWorksStep, setActiveWorksStep] = useState(0);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // --- Example Questions ---
  const questionsByCategory: Record<string, { label: string; query: string }> = {
    technology: {
      label: "Will AI replace software engineers?",
      query: "Will AI replace software engineers?",
    },
    healthcare: {
      label: "Does intermittent fasting improve long-term health?",
      query: "Does intermittent fasting improve long-term health?",
    },
    climate: {
      label: "Can renewable energy replace fossil fuels?",
      query: "Can renewable energy replace fossil fuels?",
    },
    finance: {
      label: "Is passive investing better than active investing?",
      query: "Is passive investing better than active investing?",
    },
    science: {
      label: "What is the current state of quantum computing?",
      query: "What is the current state of quantum computing?",
    },
  };

  // --- Agent Simulation Steps ---
  const agentSteps: AgentStep[] = [
    {
      name: "🧠 Orchestrator",
      icon: <Brain className="h-4 w-4 text-cyan-500" />,
      message: "Orchestration initialized. Booting specialist pipeline...",
      duration: 1000,
    },
    {
      name: "🗺️ Research Strategist",
      icon: <Layers className="h-4 w-4 text-blue-500" />,
      message: "Decomposing user research question into targeted search queries...",
      duration: 1200,
    },
    {
      name: "🔍 Search Specialist",
      icon: <Search className="h-4 w-4 text-violet-500" />,
      message: "Running parallel Tavily queries. Scraping academic sources via Firecrawl...",
      duration: 1800,
    },
    {
      name: "📚 Research Analyst",
      icon: <FileText className="h-4 w-4 text-pink-500" />,
      message: "Structuring raw search documents into clean markdown notes...",
      duration: 1400,
    },
    {
      name: "📝 Evidence Analyst",
      icon: <TrendingUp className="h-4 w-4 text-amber-500" />,
      message: "Converting research notes into atomic, testable claims...",
      duration: 1000,
    },
    {
      name: "✅ Verification Specialist",
      icon: <ShieldCheck className="h-4 w-4 text-green-500" />,
      message: "Parallel check: batched validation of claim truth status...",
      duration: 1500,
    },
    {
      name: "⚔️ Contradiction Detector",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      message: "Parallel check: searching adversarial resources for conflicts...",
      duration: 1300,
    },
    {
      name: "📊 Confidence Scorer",
      icon: <Cpu className="h-4 w-4 text-teal-500" />,
      message: "Programmatic calculation + LLM reasoning evaluation...",
      duration: 1200,
    },
    {
      name: "📄 Report Writer",
      icon: <Sparkles className="h-4 w-4 text-purple-500" />,
      message: "Assembling markdown document with verified data citations...",
      duration: 1000,
    },
  ];

  // --- Start Typing Simulation ---
  const triggerSimulation = (selectedQuery: string) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setShowReport(false);
    setSimulationStep(-1);
    setQuery("");

    // Simulate keyboard typing effect
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < selectedQuery.length) {
        setQuery((prev) => prev + selectedQuery[charIndex]);
        charIndex++;
      } else {
        clearInterval(interval);
        startAgentSteps();
      }
    }, 30);
  };

  // --- Run through Agent Flow Steps ---
  const startAgentSteps = () => {
    let currentStep = 0;
    setSimulationStep(0);

    const executeStep = () => {
      if (currentStep < agentSteps.length) {
        const step = agentSteps[currentStep];
        setTimeout(() => {
          currentStep++;
          setSimulationStep(currentStep);
          executeStep();
        }, step.duration);
      } else {
        setTimeout(() => {
          setIsSimulating(false);
          setShowReport(true);
        }, 800);
      }
    };
    executeStep();
  };

  useEffect(() => {
    if (terminalEndRef.current && terminalEndRef.current.parentElement) {
      terminalEndRef.current.parentElement.scrollTop = terminalEndRef.current.parentElement.scrollHeight;
    }
  }, [simulationStep]);

  // --- Auto-trigger one simulation on page mount ---
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerSimulation("Will AI replace software engineers?");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- Multi-Agent Architecture Data ---
  const architectureAgents: Record<
    string,
    {
      title: string;
      model: string;
      responsibility: string;
      metric: string;
      details: string;
    }
  > = {
    orchestrator: {
      title: "🧠 Orchestrator",
      model: "LangGraph Core State Engine",
      responsibility: "Maintains research state, controls sequence of execution, handles conditional retries.",
      metric: "State Transition Time: ~5ms",
      details: "Acts as the nervous system. Ensures information flows sequentially from strategy to report assembly. Manages the reducer channels that append data over loops.",
    },
    strategist: {
      title: "🗺️ Research Strategist",
      model: "llama-3.3-70b-versatile (Temp 0.2)",
      responsibility: "Receives user question, breaks it down into 3-5 distinct objectives / search queries.",
      metric: "Average Generation Time: ~700ms",
      details: "Translates high-level inquiries into structured Google-style search queries to query different angles (controversies, statistics, authoritative papers).",
    },
    searcher: {
      title: "🔍 Search Specialist",
      model: "No LLM (Tavily Advanced Search + Firecrawl Scrape)",
      responsibility: "Queries web pages, deduplicates by URL, and pulls full markdown bodies from top sources.",
      metric: "Network Latency: ~3-10s",
      details: "Applies heuristic check for government/academic domains (.gov / .edu). Restricts snippets to maximum tokens to optimize downstream context.",
    },
    analyst: {
      title: "📚 Research Analyst",
      model: "llama-3.3-70b-versatile (Temp 0.1)",
      responsibility: "Assembles raw search snippets into organized research notes. No conclusions allowed.",
      metric: "Context Truncation: 12,000 chars max",
      details: "Extracts factual blocks, dates, and statistics, ensuring every single bullet point retains a source URL reference.",
    },
    evidence: {
      title: "📝 Evidence Analyst",
      model: "llama-3.1-8b-instant (Temp 0.1)",
      responsibility: "Converts notes into plain declarative claims that can be tested independently.",
      metric: "Extracts: 5-15 atomic claims",
      details: "Splits complex combined sentences into single, atomic facts, stripping away conversational adjectives or biases.",
    },
    verifier: {
      title: "✅ Verification Specialist",
      model: "llama-3.1-8b-instant (Temp 0.1)",
      responsibility: "Batches all claims to verify them against sources. Emits verified / mixed / unsupported.",
      metric: "TPM Efficient batch processing",
      details: "Compares every claim side-by-side with compiled sources in a single pass. Requires explicit source references for verification.",
    },
    contradiction: {
      title: "⚔️ Contradiction Detector",
      model: "llama-3.3-70b-versatile (Temp 0.2)",
      responsibility: "Adversarial agent trying to disprove every claim by hunting for conflicting evidence.",
      metric: "Identifies conflicts across sources",
      details: "Acts as a devil's advocate. Looks for opposing numbers, limitations of scope, or conflicting studies to ensure the pipeline isn't confirmation-biased.",
    },
    scorer: {
      title: "📊 Confidence Scorer",
      model: "llama-3.3-70b-versatile (Temp 0.1)",
      responsibility: "Programmatically calculates final score and writes structured justification factors.",
      metric: "Confidence Clamping: 0 - 100%",
      details: "Employs a strict mathematical formula (base 50, trusted source addition, gov/acad bonus, contradiction deductions) and writes the reasons.",
    },
    writer: {
      title: "📄 Report Writer",
      model: "gemini-2.5-flash (Temp 0.2)",
      responsibility: "Compiles all finalized verified data, contradictions, and sources into a structured report.",
      metric: "Google Gemini 2.5 Flash pipeline",
      details: "Templates the final markdown document. Extremely fast completion, bypassing Groq TPM limits entirely.",
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] dark:bg-[#09090b] font-sans text-[#171717] dark:text-zinc-100 selection:bg-[#d3e5ff] dark:selection:bg-zinc-800 antialiased transition-colors duration-200">
      
      {/* ── Hero Section (Navigation bar resides inside here, transparent and non-sticky) ── */}
      <header className="relative px-6 pt-6 pb-16 text-center border-b border-[#ebebeb] dark:border-zinc-800 bg-gradient-to-b from-[#fff1eb] via-[#ace0f9]/30 to-[#fafafa] dark:from-[#121215] dark:via-[#16161a] dark:to-[#09090b] transition-colors duration-200">

        {/* Navigation Bar: Part of the hero section, scrolling naturally with page */}
        <nav className="mx-auto flex max-w-7xl h-[72px] items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <span className="text-[36px] font-bold tracking-[-0.8px] text-[#171717] dark:text-white">
              Veriq
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle variant="icon" />

            {user ? (
              <Link
                href="/workspace"
                className="flex h-[40px] items-center justify-center rounded-[8px] bg-[#171717] dark:bg-white px-5 text-[15px] font-medium text-white dark:text-[#171717] transition-colors hover:bg-[#2c2c2c] dark:hover:bg-zinc-200"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex h-[40px] items-center justify-center rounded-[8px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 text-[15px] font-medium text-[#171717] dark:text-white transition-colors hover:bg-[#fafafa] dark:hover:bg-zinc-800"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex h-[40px] items-center justify-center rounded-[8px] bg-[#171717] dark:bg-white px-5 text-[15px] font-medium text-white dark:text-[#171717] transition-colors hover:bg-[#2c2c2c] dark:hover:bg-zinc-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Marketing Copy Content */}
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#7928ca] dark:text-violet-400 mb-6 shadow-[0px_1px_2px_rgba(0,0,0,0.02)]">
            <Sparkles className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400 animate-pulse" />
            Built for Trustworthy AI Research
          </div>

          <h1 className="text-[44px] md:text-[68px] font-bold tracking-[-2.4px] leading-[1.05] text-[#171717] dark:text-white">
            Don't Trust One AI.<br />
            Trust a Team of AI Researchers.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[16px] md:text-[18px] leading-7 text-[#4d4d4d] dark:text-zinc-400">
            Veriq is an autonomous multi-agent research platform that plans, researches, verifies, challenges, and scores information before generating a transparent, evidence-backed report.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link
                href="/workspace"
                className="flex h-[48px] items-center justify-center rounded-full bg-[#171717] dark:bg-white px-8 text-[15px] font-medium text-white dark:text-[#171717] transition-all hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 hover:scale-[1.02]"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="flex h-[48px] items-center justify-center rounded-full bg-[#171717] dark:bg-white px-8 text-[15px] font-medium text-white dark:text-[#171717] transition-all hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 hover:scale-[1.02]"
                >
                  Start Researching
                </Link>
                <a
                  href="#how-it-works"
                  className="flex h-[48px] items-center justify-center rounded-full border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 text-[15px] font-medium text-[#171717] dark:text-white transition-colors hover:bg-[#fafafa] dark:hover:bg-zinc-800"
                >
                  Explore the Architecture
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Product Preview Simulator ────────────────────── */}
      <section className="border-b border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-[#09090b] py-16 px-6 transition-colors duration-200">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400">Interactive Simulator</span>
            <h3 className="text-[20px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">See Veriq Agents Collaborate in Real-Time</h3>
          </div>

          {/* Interactive Question Prompts Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(questionsByCategory).map(([key, item]) => (
              <button
                key={key}
                disabled={isSimulating}
                onClick={() => {
                  setActiveQuestionCategory(key);
                  triggerSimulation(item.query);
                }}
                className={`h-[36px] px-4 rounded-full text-[13px] font-medium transition-all ${
                  activeQuestionCategory === key
                    ? "bg-[#171717] text-white"
                    : "bg-[#fafafa] border border-[#ebebeb] text-[#4d4d4d] hover:bg-[#f2f2f2]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-12 rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 overflow-hidden bg-[#fafafa] dark:bg-zinc-950 shadow-[0px_8px_30px_rgb(0,0,0,0.02)]">
            
            {/* Left Column: Input + Report Display */}
            <div className="lg:col-span-7 p-6 border-r border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between min-h-[460px]">
              
              {!showReport ? (
                // Input State / Planning View
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#8f8f8f] block mb-2">Research Question Input</span>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={query}
                        className="w-full h-[48px] pl-10 pr-4 rounded-[6px] border border-[#ebebeb] dark:border-zinc-700 bg-[#fafafa] dark:bg-zinc-800 text-[14px] text-[#171717] dark:text-white focus:outline-none"
                      />
                      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#8f8f8f] dark:text-zinc-400" />
                    </div>
                  </div>

                  <div className="my-auto text-center py-12 px-6">
                    {isSimulating ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative h-10 w-10">
                          <div className="absolute inset-0 rounded-full border-2 border-[#171717]/10 animate-pulse"></div>
                          <div className="absolute inset-0 rounded-full border-t-2 border-[#171717] animate-spin"></div>
                        </div>
                        <p className="text-[14px] text-[#4d4d4d] animate-pulse">Running autonomous multi-agent validation loops...</p>
                      </div>
                    ) : (
                      <div>
                        <Play className="h-8 w-8 text-[#8f8f8f] mx-auto mb-3" />
                        <p className="text-[14px] text-[#8f8f8f]">Select a question category above to trigger the agent research workflow simulator.</p>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={isSimulating}
                    onClick={() => triggerSimulation(query)}
                    className="w-full h-[44px] rounded-full bg-[#171717] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#2c2c2c] transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" /> Run Verification Workflow
                  </button>
                </div>
              ) : (
                // Report State View
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#ebebeb] dark:border-zinc-800 pb-3 mb-4">
                      <div>
                        <span className="text-[11px] font-mono uppercase text-[#8f8f8f] dark:text-zinc-400">Final Report Generated</span>
                        <h4 className="text-[16px] font-semibold tracking-[-0.4px] mt-0.5 text-[#171717] dark:text-white">{query}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#d3e5ff] px-2.5 py-1 rounded-full text-[12px] font-semibold text-[#0070f3]">
                        Score: 80%
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      <div>
                        <span className="text-[11px] font-mono uppercase text-teal-600 block">1. Executive Summary</span>
                        <p className="text-[13px] text-[#4d4d4d] leading-5">
                          Extensive multi-agent analysis verifies that AI assists but does not replace software engineers. Core tasks like systems architecture design, user-empathy logic mapping, and complex validation are strongly verification-safe.
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono uppercase text-green-600 block">2. Verified Claims</span>
                        <ul className="space-y-1.5 mt-1">
                          <li className="text-[13px] text-[#171717] flex items-start gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span>Gartner projects 75% of developers will use AI assistants by 2028.</span>
                          </li>
                          <li className="text-[13px] text-[#171717] flex items-start gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span>System design and high-level architectural reasoning cannot be automated.</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono uppercase text-red-600 dark:text-red-400 block">3. Detected Contradictions</span>
                        <p className="text-[13px] text-[#4d4d4d] dark:text-zinc-300 leading-5 bg-red-50/50 dark:bg-red-950/20 p-2.5 rounded border border-red-100 dark:border-red-900/50 flex items-start gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                          <span>Minor conflicts found regarding productivity speed vs logical consistency rates.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowReport(false);
                      setIsSimulating(false);
                      setSimulationStep(-1);
                    }}
                    className="w-full h-[40px] rounded-full border border-[#ebebeb] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#171717] dark:text-white text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#fafafa] dark:hover:bg-zinc-700 transition-colors mt-4"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Simulator
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Code Terminal steps */}
            <div className="lg:col-span-5 p-6 bg-[#171717] text-[#fafafa] font-mono text-[12px] flex flex-col justify-between h-[460px]">
              <div>
                <div className="flex items-center gap-1.5 pb-4 border-b border-white/10 mb-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-[11px] text-white/40 ml-2">veriq-agent-timeline.log</span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[340px] pr-2 scrollbar-none">
                  {simulationStep === -1 && (
                    <div className="text-white/40 italic">Waiting to execute queries...</div>
                  )}

                  {agentSteps.slice(0, simulationStep + 1).map((step, idx) => {
                    const isLast = idx === simulationStep;
                    return (
                      <div key={idx} className="transition-all duration-300">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          {step.icon}
                          <span>{step.name}</span>
                          {isLast && isSimulating && (
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                          )}
                        </div>
                        <p className={`pl-6 mt-0.5 text-[11px] ${isLast && isSimulating ? "text-cyan-300" : "text-white/60"}`}>
                          {step.message}
                        </p>
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>
              </div>

              <div className="text-white/30 text-[10px] text-right pt-4 border-t border-white/5">
                Veriq CLI Engine v2.0
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Problem & Solution Section ────────────────────── */}
      <section id="problem-solution" className="mx-auto max-w-6xl px-6 py-24 border-b border-[#ebebeb] dark:border-zinc-800">
        <h2 className="text-[32px] md:text-[36px] font-semibold tracking-[-1px] text-[#171717] dark:text-white text-center mb-12">
          Problem & solution
        </h2>

        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          
          {/* Left Card: Problem */}
          <div className="bg-white dark:bg-zinc-900 border border-[#ebebeb] dark:border-zinc-800 rounded-[24px] p-8 md:p-12 flex flex-col items-center text-center shadow-[0px_4px_20px_rgba(0,0,0,0.01)] min-h-[460px] justify-start">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
              Problem
            </span>
            
            <h3 className="mt-8 text-[22px] md:text-[25px] font-normal tracking-[-0.8px] leading-[1.3] text-[#4d4d4d] dark:text-zinc-300 max-w-md">
              In an information-heavy world, knowing <span className="text-[#171717] dark:text-white font-semibold">what to trust</span> and being aware of <span className="text-[#171717] dark:text-white font-semibold">hallucinations and bias</span> is more crucial than ever.
            </h3>
            
            <p className="mt-6 text-[13px] leading-relaxed text-[#8f8f8f] dark:text-zinc-400 max-w-sm">
              Traditional AI models generate answers instantly but offer zero traceability, presenting opinions and errors as verified truths.
            </p>
          </div>

          {/* Right Card: Solution */}
          <div className="bg-white dark:bg-zinc-900 border border-[#ebebeb] dark:border-zinc-800 rounded-[24px] p-8 md:p-12 flex flex-col items-center text-center shadow-[0px_4px_20px_rgba(0,0,0,0.01)] min-h-[460px] justify-between">
            <div className="flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                Solution
              </span>
              
              <h3 className="mt-8 text-[22px] md:text-[25px] font-normal tracking-[-0.8px] leading-[1.3] text-[#4d4d4d] dark:text-zinc-300 max-w-md">
                Veriq empowers you with <span className="text-[#171717] dark:text-white font-semibold">autonomous multi-agent validation</span> and instant source citations when you research questions.
              </h3>
              
              <p className="mt-6 text-[13px] leading-relaxed text-[#8f8f8f] dark:text-zinc-400 max-w-sm">
                By deploying specialized specialist and auditor nodes, Veriq challenges, validates, and fact-checks statements before you read them.
              </p>
            </div>

            <div className="mt-10 w-full flex flex-col items-center gap-6">
              <Link
                href={user ? "/workspace" : "/signup"}
                className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#171717] px-6 text-[13px] font-medium text-white transition-all hover:bg-[#2c2c2c] hover:scale-[1.02] shadow-[0px_2px_4px_rgba(0,0,0,0.06)]"
              >
                Start researching with Veriq
              </Link>
              
              {/* Mockup notification bubbles at bottom */}
              <div className="flex gap-3 items-center justify-center w-full max-w-xs select-none">
                

                {/* bubble 2 */}
                <div className="bg-[#fafafa] dark:bg-zinc-800 border border-[#ebebeb] dark:border-zinc-700 rounded-[10px] p-2 flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.01)] shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] text-blue-500 dark:text-blue-400">
                    🛡️
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-semibold text-[#171717] dark:text-white leading-tight">Confidence</div>
                    <div className="text-[8px] text-blue-500 dark:text-blue-400 font-mono leading-none font-semibold">94% score</div>
                  </div>
                </div>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c

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
<<<<<<< HEAD
=======

          </div>

        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-[#ebebeb] dark:border-zinc-800 py-24 px-6 bg-gradient-to-t from-[#ace0f9] to-[#fff1eb] dark:from-[#121215] dark:to-[#09090b] transition-colors duration-200">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400">Process Workflow</span>
            <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
              From Question to Verified Report
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {/* Step 1 */}
            <div
              onClick={() => setActiveWorksStep(0)}
              className={`rounded-[12px] border p-6 transition-all cursor-pointer ${
                activeWorksStep === 0
                  ? "border-[#171717] dark:border-zinc-400 bg-[#fafafa] dark:bg-zinc-800 shadow-[0px_2px_4px_rgba(0,0,0,0.02)]"
                  : "border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-mono text-xs font-bold mb-4">
                1
              </div>
              <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">Ask</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#4d4d4d] dark:text-zinc-300">
                Enter any research question. Veriq creates a research strategy and identifies what needs to be investigated.
              </p>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveWorksStep(1)}
              className={`rounded-[12px] border p-6 transition-all cursor-pointer ${
                activeWorksStep === 1
                  ? "border-[#171717] dark:border-zinc-400 bg-[#fafafa] dark:bg-zinc-800 shadow-[0px_2px_4px_rgba(0,0,0,0.02)]"
                  : "border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-mono text-xs font-bold mb-4">
                2
              </div>
              <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">Investigate</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#4d4d4d] dark:text-zinc-300">
                Specialized AI agents search trusted sources, analyze evidence, verify claims, and identify contradictions. Each focuses on one task.
              </p>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveWorksStep(2)}
              className={`rounded-[12px] border p-6 transition-all cursor-pointer ${
                activeWorksStep === 2
                  ? "border-[#171717] dark:border-zinc-400 bg-[#fafafa] dark:bg-zinc-800 shadow-[0px_2px_4px_rgba(0,0,0,0.02)]"
                  : "border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-mono text-xs font-bold mb-4">
                3
              </div>
              <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">Verify</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#4d4d4d] dark:text-zinc-300">
                Claims are independently validated and assigned confidence scores based on supporting evidence.
              </p>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => setActiveWorksStep(3)}
              className={`rounded-[12px] border p-6 transition-all cursor-pointer ${
                activeWorksStep === 3
                  ? "border-[#171717] dark:border-zinc-400 bg-[#fafafa] dark:bg-zinc-800 shadow-[0px_2px_4px_rgba(0,0,0,0.02)]"
                  : "border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-mono text-xs font-bold mb-4">
                4
              </div>
              <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">Report</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#4d4d4d] dark:text-zinc-300">
                Receive a structured report containing executive summaries, verified claims, contradictions, and actionable citations.
              </p>
            </div>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          </div>
        </section>
      </main>

<<<<<<< HEAD
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
=======
      {/* ── Multi-Agent Architecture Section ───────────────── */}
      <section id="architecture" className="mx-auto max-w-6xl px-6 py-24 border-b border-[#ebebeb] dark:border-zinc-800">
        <div className="text-center mb-16">
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400">Multi-Agent Architecture</span>
          <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            A Team of AI Specialists, Coordinated by One Orchestrator
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[14px] text-[#4d4d4d] dark:text-zinc-300">
            Veriq breaks complex research into specialized tasks handled by independent AI agents. Instead of one model trying to do everything, each agent contributes expertise.
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          </p>
        </div>
      </footer>

<<<<<<< HEAD
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
=======
        {/* Interactive Visual Graph Canvas (2-Row Layout on Desktop, Vertical Stack on Mobile) */}
        <div className="w-full bg-[radial-gradient(#ebebeb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#27272a_1.5px,transparent_1.5px)] [background-size:24px_24px] bg-[#fafafa] dark:bg-zinc-950 border border-[#ebebeb] dark:border-zinc-800 rounded-[16px] py-12 px-4 mb-8 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.02)] flex flex-col items-center gap-0">
          
          {/* DESKTOP VIEWPORT: 2-Row Layout */}
          <div className="hidden lg:flex flex-col items-center gap-6 w-full max-w-[1100px] py-2 relative">
            
            {/* ROW 1: Ingestion & Analysis */}
            <div className="flex items-center justify-between w-full">
              
              {/* Orchestrator */}
              <div
                onClick={() => setActiveArchitectureAgent("orchestrator")}
                className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[220px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all shrink-0 ${
                  activeArchitectureAgent === "orchestrator"
                    ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                    : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px]">🧠</span>
                    <span className="font-semibold text-[12px] text-[#171717] dark:text-white">Orchestrator</span>
                  </div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Start</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                    <span className="text-[#171717] dark:text-white font-mono font-semibold">LangGraph State Core</span>
                  </div>
                </div>
                <div className="border-t border-[#f2f2f2] dark:border-zinc-800 pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f] dark:text-zinc-400">
                  <span>Transition: ~5ms</span>
                  <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              </div>

              {/* Connector */}
              <div className="w-[50px] h-[60px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full" viewBox="0 0 50 60" fill="none">
                  <path d="M 0 30 L 50 30" stroke="currentColor" className="text-[#171717] dark:text-zinc-600" strokeWidth="2" />
                </svg>
              </div>

              {/* Research Strategist */}
              <div
                onClick={() => setActiveArchitectureAgent("strategist")}
                className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[220px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all shrink-0 ${
                  activeArchitectureAgent === "strategist"
                    ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                    : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px]">🗺️</span>
                    <span className="font-semibold text-[12px] text-[#171717] dark:text-white">Strategist</span>
                  </div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 1</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                    <span className="text-[#171717] font-mono font-medium">llama-3.3-70b</span>
                  </div>
                </div>
                <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                  <span>Duration: 0.7s</span>
                  <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              </div>

              {/* Connector */}
              <div className="w-[50px] h-[60px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full" viewBox="0 0 50 60" fill="none">
                  <path d="M 0 30 L 50 30" stroke="currentColor" className="text-[#171717] dark:text-zinc-600" strokeWidth="2" />
                </svg>
              </div>

              {/* Search Specialist */}
              <div
                onClick={() => setActiveArchitectureAgent("searcher")}
                className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[220px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all shrink-0 ${
                  activeArchitectureAgent === "searcher"
                    ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                    : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px]">🔍</span>
                    <span className="font-semibold text-[12px] text-[#171717] dark:text-white">Search Specialist</span>
                  </div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 2</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                    <span className="text-[#171717] font-mono font-medium">Tavily + Scrape API</span>
                  </div>
                </div>
                <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                  <span>Filters: .edu / .gov</span>
                  <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              </div>

              {/* Connector */}
              <div className="w-[50px] h-[60px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full" viewBox="0 0 50 60" fill="none">
                  <path d="M 0 30 L 50 30" stroke="currentColor" className="text-[#171717] dark:text-zinc-600" strokeWidth="2" />
                </svg>
              </div>

              {/* Research Analyst */}
              <div
                onClick={() => setActiveArchitectureAgent("analyst")}
                className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[220px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all shrink-0 ${
                  activeArchitectureAgent === "analyst"
                    ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                    : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px]">📚</span>
                    <span className="font-semibold text-[12px] text-[#171717] dark:text-white">Research Analyst</span>
                  </div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 3</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                    <span className="text-[#171717] font-mono font-medium">llama-3.3-70b</span>
                  </div>
                </div>
                <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                  <span>Markdown Notes</span>
                  <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              </div>

            </div>

            {/* Sweeping Loop Connector from Row 1 End to Row 2 Start */}
            <div className="w-full h-[50px] relative overflow-visible select-none pointer-events-none">
              <svg className="absolute w-[1100px] h-[50px] overflow-visible" viewBox="0 0 1100 50" fill="none">
                <path d="M 990 0 C 990 25, 110 25, 110 50" stroke="currentColor" className="text-[#171717] dark:text-zinc-600" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              </svg>
            </div>

            {/* ROW 2: Verification & Scoring */}
            <div className="flex items-center justify-between w-full">
              
              {/* Evidence Analyst */}
              <div
                onClick={() => setActiveArchitectureAgent("evidence")}
                className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[220px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all shrink-0 ${
                  activeArchitectureAgent === "evidence"
                    ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                    : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px]">📝</span>
                    <span className="font-semibold text-[12px] text-[#171717] dark:text-white">Evidence Analyst</span>
                  </div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 4</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                    <span className="text-[#171717] font-mono font-medium">llama-3.1-8b</span>
                  </div>
                </div>
                <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                  <span>Extracts: 5-15 Claims</span>
                  <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[4px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              </div>

              {/* Parallel Split Connector */}
              <div className="w-[50px] h-[160px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full" viewBox="0 0 50 160" fill="none">
                  <path d="M 0 80 C 25 80, 25 30, 50 30" stroke="currentColor" className="text-[#171717] dark:text-zinc-600" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 0 80 C 25 80, 25 130, 50 130" stroke="currentColor" className="text-[#171717] dark:text-zinc-600" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Parallel Column (Verifier & Contradiction stacked vertically) */}
              <div className="flex flex-col gap-4 justify-center shrink-0">
                
                {/* Verification Specialist */}
                <div
                  onClick={() => setActiveArchitectureAgent("verifier")}
                  className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-3 w-[220px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                    activeArchitectureAgent === "verifier"
                      ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                      : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px]">✅</span>
                      <span className="font-semibold text-[11px] text-[#171717] dark:text-white">Verifier</span>
                    </div>
                    <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[8px] uppercase tracking-wider">Parallel</span>
                  </div>
                  <div className="space-y-0.5 text-[9px]">
                    <div>
                      <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[7px] font-mono tracking-wider">Target Registry Model</span>
                      <span className="text-[#171717] font-mono font-medium">llama-3.1-8b</span>
                    </div>
                  </div>
                  <div className="border-t border-[#f2f2f2] pt-1.5 mt-2 flex justify-between items-center text-[8px] font-mono text-[#8f8f8f]">
                    <span>Mode: Batched</span>
                    <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
                </div>

                {/* Contradiction Detector */}
                <div
                  onClick={() => setActiveArchitectureAgent("contradiction")}
                  className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-3 w-[220px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                    activeArchitectureAgent === "contradiction"
                      ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                      : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px]">⚔️</span>
                      <span className="font-semibold text-[11px] text-[#171717] dark:text-white">Contradiction</span>
                    </div>
                    <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[8px] uppercase tracking-wider">Parallel</span>
                  </div>
                  <div className="space-y-0.5 text-[9px]">
                    <div>
                      <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[7px] font-mono tracking-wider">Target Registry Model</span>
                      <span className="text-[#171717] font-mono font-medium">llama-3.3-70b</span>
                    </div>
                  </div>
                  <div className="border-t border-[#f2f2f2] pt-1.5 mt-2 flex justify-between items-center text-[8px] font-mono text-[#8f8f8f]">
                    <span>Goal: Adversarial</span>
                    <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
                </div>

              </div>

              {/* Parallel Merge Connector */}
              <div className="w-[50px] h-[160px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full" viewBox="0 0 50 160" fill="none">
                  <path d="M 0 30 C 25 30, 25 80, 50 80" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 0 130 C 25 130, 25 80, 50 80" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Confidence Scorer */}
              <div
                onClick={() => setActiveArchitectureAgent("scorer")}
                className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[220px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all shrink-0 ${
                  activeArchitectureAgent === "scorer"
                    ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                    : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px]">📊</span>
                    <span className="font-semibold text-[12px] text-[#171717] dark:text-white">Confidence Scorer</span>
                  </div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 5</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                    <span className="text-[#171717] font-mono font-medium">llama-3.3-70b</span>
                  </div>
                </div>
                <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                  <span>Formula: Clamped</span>
                  <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              </div>

              {/* Connector */}
              <div className="w-[50px] h-[60px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full" viewBox="0 0 50 60" fill="none">
                  <path d="M 0 30 L 50 30" stroke="currentColor" className="text-[#171717] dark:text-zinc-600" strokeWidth="2" />
                </svg>
              </div>

              {/* Report Writer */}
              <div
                onClick={() => setActiveArchitectureAgent("writer")}
                className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[220px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all shrink-0 ${
                  activeArchitectureAgent === "writer"
                    ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                    : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px]">📄</span>
                    <span className="font-semibold text-[12px] text-[#171717] dark:text-white">Report Writer</span>
                  </div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">End</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                    <span className="text-[#171717] font-mono font-medium">gemini-2.5</span>
                  </div>
                </div>
                <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                  <span>Verified Markdown</span>
                  <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4px] h-2 w-2 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              </div>

            </div>

          </div>

          {/* MOBILE VIEWPORT: Vertical Stack Layout */}
          <div className="flex lg:hidden flex-col items-center gap-0 w-full">
            
            {/* Start Node */}
            <div
              onClick={() => setActiveArchitectureAgent("orchestrator")}
              className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[280px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                activeArchitectureAgent === "orchestrator"
                  ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                  : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px]">🧠</span>
                  <span className="font-semibold text-[13px] text-[#171717] dark:text-white">Orchestrator</span>
                </div>
                <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Start</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                  <span className="text-[#171717] font-mono font-medium">LangGraph State Core</span>
                </div>
              </div>
              <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                <span>Transition: ~5ms</span>
                <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
            </div>

            {/* Vertical Connector */}
            <div className="h-10 w-[2px] bg-[#171717] dark:bg-zinc-600 relative shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
            </div>

            {/* Research Strategist */}
            <div
              onClick={() => setActiveArchitectureAgent("strategist")}
              className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[280px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                activeArchitectureAgent === "strategist"
                  ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                  : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px]">🗺️</span>
                  <span className="font-semibold text-[13px] text-[#171717] dark:text-white">Research Strategist</span>
                </div>
                <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 1</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                  <span className="text-[#171717] font-mono font-medium">llama-3.3-70b</span>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
                </div>
              </div>
              <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                <span>Duration: 0.7s</span>
                <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
            </div>

            {/* Vertical Connector */}
            <div className="h-10 w-[2px] bg-[#171717] dark:bg-zinc-600 relative shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
            </div>

<<<<<<< HEAD
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
=======
            {/* Search Specialist */}
            <div
              onClick={() => setActiveArchitectureAgent("searcher")}
              className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[280px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                activeArchitectureAgent === "searcher"
                  ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                  : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px]">🔍</span>
                  <span className="font-semibold text-[13px] text-[#171717] dark:text-white">Search Specialist</span>
                </div>
                <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 2</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                  <span className="text-[#171717] font-mono font-medium">Tavily + Scrape API</span>
                </div>
              </div>
              <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                <span>Filters: .edu / .gov</span>
                <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
            </div>

            {/* Vertical Connector */}
            <div className="h-10 w-[2px] bg-[#171717] dark:bg-zinc-600 relative shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
            </div>

            {/* Research Analyst */}
            <div
              onClick={() => setActiveArchitectureAgent("analyst")}
              className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[280px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                activeArchitectureAgent === "analyst"
                  ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                  : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px]">📚</span>
                  <span className="font-semibold text-[13px] text-[#171717] dark:text-white">Research Analyst</span>
                </div>
                <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 3</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                  <span className="text-[#171717] font-mono font-medium">llama-3.3-70b</span>
                </div>
              </div>
              <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                <span>Markdown Notes</span>
                <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
            </div>

            {/* Vertical Connector */}
            <div className="h-10 w-[2px] bg-[#171717] dark:bg-zinc-600 relative shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
            </div>

            {/* Evidence Analyst */}
            <div
              onClick={() => setActiveArchitectureAgent("evidence")}
              className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[280px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                activeArchitectureAgent === "evidence"
                  ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                  : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px]">📝</span>
                  <span className="font-semibold text-[13px] text-[#171717] dark:text-white">Evidence Analyst</span>
                </div>
                <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 4</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                  <span className="text-[#171717] font-mono font-medium">llama-3.1-8b</span>
                </div>
              </div>
              <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                <span>Extracts: 5-15 Claims</span>
                <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
            </div>

            {/* Vertical Split Connector */}
            <div className="h-10 w-[2px] bg-[#171717] dark:bg-zinc-600 relative shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
            </div>

            {/* Verification Specialist Node */}
            <div
              onClick={() => setActiveArchitectureAgent("verifier")}
              className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[280px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                activeArchitectureAgent === "verifier"
                  ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                  : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px]">✅</span>
                  <span className="font-semibold text-[13px] text-[#171717] dark:text-white">Verification Specialist</span>
                </div>
                <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Parallel</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                  <span className="text-[#171717] font-mono font-medium">llama-3.1-8b</span>
                </div>
              </div>
              <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                <span>Mode: Batched Claims</span>
                <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
            </div>

            {/* Vertical Connector */}
            <div className="h-10 w-[2px] bg-[#171717] dark:bg-zinc-600 relative shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
            </div>

            {/* Contradiction Detector Node */}
            <div
              onClick={() => setActiveArchitectureAgent("contradiction")}
              className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[280px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                activeArchitectureAgent === "contradiction"
                  ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                  : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px]">⚔️</span>
                  <span className="font-semibold text-[13px] text-[#171717] dark:text-white">Contradiction Detector</span>
                </div>
                <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Parallel</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                  <span className="text-[#171717] font-mono font-medium">llama-3.3-70b</span>
                </div>
              </div>
              <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                <span>Goal: Adversarial Check</span>
                <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
            </div>

            {/* Vertical Connector */}
            <div className="h-10 w-[2px] bg-[#171717] dark:bg-zinc-600 relative shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
            </div>

            {/* Confidence Scorer */}
            <div
              onClick={() => setActiveArchitectureAgent("scorer")}
              className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[280px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all shrink-0 ${
                activeArchitectureAgent === "scorer"
                  ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                  : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px]">📊</span>
                  <span className="font-semibold text-[13px] text-[#171717] dark:text-white">Confidence Scorer</span>
                </div>
                <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Node 5</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                  <span className="text-[#171717] font-mono font-medium">llama-3.3-70b</span>
                </div>
              </div>
              <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                <span>Formula: Clamped</span>
                <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
            </div>

            {/* Vertical Connector */}
            <div className="h-10 w-[2px] bg-[#171717] dark:bg-zinc-600 relative shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900" />
            </div>

            {/* Report Writer */}
            <div
              onClick={() => setActiveArchitectureAgent("writer")}
              className={`relative cursor-pointer rounded-[12px] border bg-white dark:bg-zinc-900 p-4 w-[280px] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all shrink-0 ${
                activeArchitectureAgent === "writer"
                  ? "border-[#171717] dark:border-zinc-400 ring-1 ring-[#171717] dark:ring-zinc-400"
                  : "border-[#ebebeb] dark:border-zinc-800 hover:border-[#a1a1a1] dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px]">📄</span>
                  <span className="font-semibold text-[13px] text-[#171717] dark:text-white">Report Writer</span>
                </div>
                <span className="text-[#8f8f8f] dark:text-zinc-400 font-mono text-[9px] uppercase tracking-wider">End</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div>
                  <span className="text-[#8f8f8f] dark:text-zinc-400 block uppercase text-[8px] font-mono tracking-wider">Target Registry Model</span>
                  <span className="text-[#171717] font-mono font-medium">gemini-2.5-flash</span>
                </div>
              </div>
              <div className="border-t border-[#f2f2f2] pt-2 mt-3 flex justify-between items-center text-[9px] font-mono text-[#8f8f8f]">
                <span>Verified Markdown</span>
                <span className="text-[#10b77f] font-semibold flex items-center">✓ Enabled</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px] h-2.5 w-2.5 rounded-full border border-[#171717] dark:border-zinc-500 bg-white dark:bg-zinc-900 z-10" />
            </div>
            
          </div>
        </div>

        {/* Selected Agent Details Card (Below visual graph) */}
        <div className="rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-[0px_2px_8px_rgba(0,0,0,0.02)] min-h-[260px] flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="font-mono text-[11px] text-[#8f8f8f] dark:text-zinc-400 uppercase tracking-wider">
              Selected Agent Node Properties
            </div>
            <h3 className="text-[22px] font-semibold tracking-[-0.6px] text-[#171717] dark:text-white mt-1.5">
              {architectureAgents[activeArchitectureAgent]?.title || "🧠 Orchestrator"}
            </h3>
            
            <div className="mt-6 grid gap-8 md:grid-cols-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#8f8f8f] dark:text-zinc-400 tracking-wider block mb-1">Target Registry Model</span>
                <span className="text-[13px] font-mono font-semibold text-[#171717] dark:text-white">
                  {architectureAgents[activeArchitectureAgent]?.model}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-[#8f8f8f] dark:text-zinc-400 tracking-wider block mb-1">Primary Responsibility</span>
                <p className="text-[13px] text-[#4d4d4d] dark:text-zinc-300 leading-relaxed mt-0.5">
                  {architectureAgents[activeArchitectureAgent]?.responsibility}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-[#8f8f8f] dark:text-zinc-400 tracking-wider block mb-1">Core Details</span>
                <p className="text-[13px] text-[#8f8f8f] dark:text-zinc-400 leading-relaxed mt-0.5">
                  {architectureAgents[activeArchitectureAgent]?.details}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f2f2f2] dark:border-zinc-800 pt-5 mt-8 flex justify-between items-center text-[13px] font-mono text-[#8f8f8f] dark:text-zinc-400">
            <span>{architectureAgents[activeArchitectureAgent]?.metric}</span>
            <span className="text-[#10b77f] flex items-center gap-1 font-semibold">
              ✓ Enabled
            </span>
          </div>
        </div>
      </section>

      {/* ── Features List ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 border-b border-[#ebebeb] dark:border-zinc-800">
        <div className="text-center mb-16">
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400">Features</span>
          <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Designed for Absolute Integrity
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* F 1 */}
          <div className="rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">
              Multi-Agent Intelligence
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d] dark:text-zinc-300">
              Multiple specialized AI agents collaborate to solve one research problem, avoiding single-point model bias.
            </p>
          </div>

          {/* F 2 */}
          <div className="rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">
              Evidence-Backed Research
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d] dark:text-zinc-300">
              Every single claim is supported by direct URL citations and verified context, matching academic review patterns.
            </p>
          </div>

          {/* F 3 */}
          <div className="rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">
              Contradiction Detection
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d] dark:text-zinc-300">
              Veriq deploys a dedicated agent to actively challenge and attempt to disprove assertions.
            </p>
          </div>

          {/* F 4 */}
          <div className="rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">
              Explainable Confidence
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d] dark:text-zinc-300">
              We don't just output numbers. Every score outlines the exact positive and negative factors behind it.
            </p>
          </div>

          {/* F 5 */}
          <div className="rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">
              Transparent Citations
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d] dark:text-zinc-300">
              Direct links to raw papers, government releases, and academic journals that formed the research.
            </p>
          </div>

          {/* F 6 */}
          <div className="rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717] dark:text-white">
              Structured Research Reports
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d] dark:text-zinc-300">
              Receive beautifully organized reports that are easy to verify, download, and share.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Veriq Table (Comparison) ─────────────────── */}
      <section id="why-veriq" className="px-6 py-24 border-b border-[#ebebeb] dark:border-zinc-800" >
        <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400">Comparative Analysis</span>
          <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Traditional AI vs. Veriq
          </h2>
        </div>

        <div className="border border-[#ebebeb] dark:border-zinc-800 rounded-[12px] overflow-hidden bg-white dark:bg-zinc-900 shadow-[0px_1px_1px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] dark:bg-zinc-950 border-b border-[#ebebeb] dark:border-zinc-800">
                <th className="p-4 text-[13px] font-semibold uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400 font-mono w-1/3">Feature</th>
                <th className="p-4 text-[13px] font-semibold uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400 font-mono w-1/3">Traditional AI</th>
                <th className="p-4 text-[13px] font-semibold uppercase tracking-wider text-[#171717] dark:text-white font-mono w-1/3">Veriq</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              <tr className="border-b border-[#ebebeb] dark:border-zinc-800">
                <td className="p-4 font-semibold text-[#171717] dark:text-white">Execution Framework</td>
                <td className="p-4 text-[#4d4d4d] dark:text-zinc-300">Single AI model generation</td>
                <td className="p-4 text-[#0070f3] dark:text-blue-400 font-semibold">Multiple specialized AI agents</td>
              </tr>
              <tr className="border-b border-[#ebebeb] dark:border-zinc-800">
                <td className="p-4 font-semibold text-[#171717] dark:text-white">Reasoning Process</td>
                <td className="p-4 text-[#4d4d4d] dark:text-zinc-300">Hidden, non-traceable</td>
                <td className="p-4 text-[#0070f3] dark:text-blue-400 font-semibold">Research-first workflow</td>
              </tr>
              <tr className="border-b border-[#ebebeb] dark:border-zinc-800">
                <td className="p-4 font-semibold text-[#171717] dark:text-white">Verification Layer</td>
                <td className="p-4 text-[#4d4d4d] dark:text-zinc-300">None, prone to hallucination</td>
                <td className="p-4 text-[#0070f3] dark:text-blue-400 font-semibold">Independent claim verification</td>
              </tr>
              <tr className="border-b border-[#ebebeb] dark:border-zinc-800">
                <td className="p-4 font-semibold text-[#171717] dark:text-white">Bias Reduction</td>
                <td className="p-4 text-[#4d4d4d] dark:text-zinc-300">Accepts statements at face value</td>
                <td className="p-4 text-[#0070f3] dark:text-blue-400 font-semibold">Contradiction analysis checks</td>
              </tr>
              <tr className="border-b border-[#ebebeb] dark:border-zinc-800">
                <td className="p-4 font-semibold text-[#171717] dark:text-white">Citations & Links</td>
                <td className="p-4 text-[#4d4d4d] dark:text-zinc-300">Often missing or broken URLs</td>
                <td className="p-4 text-[#0070f3] dark:text-blue-400 font-semibold">Transparent, verified references</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#171717] dark:text-white">Output Style</td>
                <td className="p-4 text-[#4d4d4d] dark:text-zinc-300">Standard conversational text block</td>
                <td className="p-4 text-[#0070f3] dark:text-blue-400 font-semibold">Structured fact-checked report</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </section>

      {/* ── Product Preview List ─────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center border-b border-[#ebebeb] dark:border-zinc-800">
        <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400">Deliverables</span>
        <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
          What You'll Receive
        </h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {[
            "Executive Summary",
            "Research Timeline",
            "Verified Claims",
            "Contradictory Evidence",
            "Confidence Scores",
            "Supporting Sources",
            "Final Recommendations",
            "Citeable Citations",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 border-b border-[#ebebeb] dark:border-zinc-800 pb-2 text-[14px] text-[#4d4d4d] dark:text-zinc-300">
              <Check className="h-4 w-4 text-[#0070f3]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final Call To Action ──────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 py-24 text-center border-b border-[#ebebeb] dark:border-zinc-800 bg-gradient-to-t from-[#ace0f9] to-[#fff1eb] dark:from-[#121215] dark:to-[#09090b] transition-colors duration-200"
      >

        <div className="mx-auto max-w-3xl">
          <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-1.28px] text-[#171717] dark:text-white">
            Research Beyond the First Answer.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#4d4d4d] dark:text-zinc-300">
            Veriq doesn't just generate responses—it investigates them. Experience transparent, evidence-backed research powered by autonomous AI agents.
          </p>
          <div className="mt-8">
            <Link
              href={user ? "/workspace" : "/signup"}
              className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#171717] dark:bg-white px-8 text-[15px] font-medium text-white dark:text-[#171717] transition-all hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 hover:scale-[1.02] shadow-[0px_2px_4px_rgba(0,0,0,0.06)]"
            >
              Launch Veriq
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-[#ebebeb] dark:border-zinc-800 bg-[#fafafa] dark:bg-[#09090b] py-16 px-6 transition-colors duration-200">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold tracking-[-0.6px] text-[#171717] dark:text-white">Veriq</span>
            </div>
            <p className="text-[13px] text-[#8f8f8f] dark:text-zinc-400 leading-5">
              Autonomous Multi-Agent Research Platform.<br />
              <strong className="text-[#171717] dark:text-white">Research. Verify. Challenge. Trust.</strong>
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400 mb-4">Product</h4>
            <ul className="space-y-2 text-[13px] text-[#4d4d4d] dark:text-zinc-300">
              <li><a href="#features" className="hover:text-[#171717] dark:hover:text-white transition-colors">Features</a></li>
              <li><a href="#architecture" className="hover:text-[#171717] dark:hover:text-white transition-colors">Architecture</a></li>
              <li><a href="#" className="hover:text-[#171717] dark:hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#171717] dark:hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400 mb-4">Resources</h4>
            <ul className="space-y-2 text-[13px] text-[#4d4d4d] dark:text-zinc-300">
              <li><a href="#" className="hover:text-[#171717] dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#171717] dark:hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#171717] dark:hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-6xl border-t border-[#ebebeb] dark:border-zinc-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-[12px] text-[#8f8f8f] dark:text-zinc-400 gap-4">
          <div>&copy; 2026 Veriq AI. All rights reserved.</div>
        </div>
      </footer>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
    </div>
  );
}

