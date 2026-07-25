"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  Layers,
  HelpCircle,
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

interface LandingPageProps {
  user: any;
}

interface AgentStep {
  name: string;
  icon: React.ReactNode;
  message: string;
  duration: number;
}

export default function LandingPage({ user }: LandingPageProps) {
  // --- Simulation State ---
  const [query, setQuery] = useState("Will AI replace software engineers?");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(-1);
  const [typingIndex, setTypingIndex] = useState(-1);
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
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
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
    <div className="flex min-h-screen flex-col bg-[#fafafa] font-sans text-[#171717] selection:bg-[#d3e5ff] antialiased">
      {/* ── Nav Bar ───────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-[#ebebeb] bg-[#fafafa]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-[64px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 flex items-center justify-center rounded-[4px] bg-[#171717] text-white font-mono font-bold text-xs">
              V
            </div>
            <span className="text-[18px] font-semibold tracking-[-0.4px]">
              Veriq
            </span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#problem" className="text-[14px] text-[#4d4d4d] hover:text-[#171717] transition-colors">
              The Problem
            </a>
            <a href="#how-it-works" className="text-[14px] text-[#4d4d4d] hover:text-[#171717] transition-colors">
              How It Works
            </a>
            <a href="#architecture" className="text-[14px] text-[#4d4d4d] hover:text-[#171717] transition-colors">
              Architecture
            </a>
            <a href="#why-veriq" className="text-[14px] text-[#4d4d4d] hover:text-[#171717] transition-colors">
              Compare
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/workspace"
                className="flex h-[32px] items-center justify-center rounded-[6px] bg-[#171717] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#2c2c2c]"
              >
                Go to Workspace
              </Link>
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

      {/* ── Hero Section ──────────────────────────────────── */}
      <header className="relative px-6 pt-24 pb-16 text-center border-b border-[#ebebeb]">
        {/* Geist system Mesh Gradient */}
        <div className="absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden pointer-events-none">
          <div className="h-[600px] w-[1200px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-200/40 via-violet-200/30 to-amber-100/20 blur-[100px] opacity-70" />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ebebeb] bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#7928ca] mb-6 shadow-[0px_1px_2px_rgba(0,0,0,0.02)]">
            <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
            Built for Trustworthy AI Research
          </div>

          <h1 className="text-[44px] md:text-[68px] font-bold tracking-[-2.4px] leading-[1.05] text-[#171717]">
            Don't Trust One AI.<br />
            Trust a Team of AI Researchers.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[16px] md:text-[18px] leading-7 text-[#4d4d4d]">
            Veriq is an autonomous multi-agent research platform that plans, researches, verifies, challenges, and scores information before generating a transparent, evidence-backed report.
            <span className="block mt-2 font-medium text-[#171717]">Unlike traditional AI assistants, Veriq doesn't stop at generating answers—it validates them.</span>
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link
                href="/workspace"
                className="flex h-[48px] items-center justify-center rounded-full bg-[#171717] px-8 text-[15px] font-medium text-white transition-all hover:bg-[#2c2c2c] hover:scale-[1.02]"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="flex h-[48px] items-center justify-center rounded-full bg-[#171717] px-8 text-[15px] font-medium text-white transition-all hover:bg-[#2c2c2c] hover:scale-[1.02]"
                >
                  Start Researching
                </Link>
                <a
                  href="#how-it-works"
                  className="flex h-[48px] items-center justify-center rounded-full border border-[#ebebeb] bg-white px-8 text-[15px] font-medium text-[#171717] transition-colors hover:bg-[#fafafa]"
                >
                  Explore the Architecture
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Product Preview Simulator ────────────────────── */}
      <section className="border-b border-[#ebebeb] bg-white py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">Interactive Simulator</span>
            <h3 className="text-[20px] font-semibold tracking-[-0.4px] text-[#171717]">See Veriq Agents Collaborate in Real-Time</h3>
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

          <div className="grid gap-6 lg:grid-cols-12 rounded-[16px] border border-[#ebebeb] overflow-hidden bg-[#fafafa] shadow-[0px_8px_30px_rgb(0,0,0,0.02)]">
            
            {/* Left Column: Input + Report Display */}
            <div className="lg:col-span-7 p-6 border-r border-[#ebebeb] bg-white flex flex-col justify-between min-h-[460px]">
              
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
                        className="w-full h-[48px] pl-10 pr-4 rounded-[6px] border border-[#ebebeb] bg-[#fafafa] text-[14px] focus:outline-none"
                      />
                      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#8f8f8f]" />
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
                    <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3 mb-4">
                      <div>
                        <span className="text-[11px] font-mono uppercase text-[#8f8f8f]">Final Report Generated</span>
                        <h4 className="text-[16px] font-semibold tracking-[-0.4px] mt-0.5">{query}</h4>
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
                        <span className="text-[11px] font-mono uppercase text-red-600 block">3. Detected Contradictions</span>
                        <p className="text-[13px] text-[#4d4d4d] leading-5 bg-red-50/50 p-2.5 rounded border border-red-100 flex items-start gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
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
                    className="w-full h-[40px] rounded-full border border-[#ebebeb] bg-white text-[#171717] text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#fafafa] transition-colors mt-4"
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

      {/* ── Problem Section ───────────────────────────────── */}
      <section id="problem" className="mx-auto max-w-5xl px-6 py-24 text-center border-b border-[#ebebeb]">
        <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">The Problem</span>
        <h2 className="mt-2 text-[32px] md:text-[44px] font-bold tracking-[-1.28px] leading-[1.1] text-[#171717]">
          AI Can Answer Anything.<br className="hidden md:inline" /> But Can You Trust It?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[15px] md:text-[16px] leading-7 text-[#4d4d4d]">
          Most AI assistants generate a single response without showing how conclusions were reached or whether conflicting evidence exists.
        </p>
        <div className="mt-6 font-medium text-[16px] text-[#171717]">
          When accuracy matters, users deserve more than confident-sounding answers.
        </div>
      </section>

      {/* ── Solution Section ──────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center border-b border-[#ebebeb]">
        <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">The Solution</span>
        <h2 className="mt-2 text-[32px] md:text-[44px] font-bold tracking-[-1.28px] text-[#171717]">
          Meet Veriq
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[15px] md:text-[16px] leading-7 text-[#4d4d4d]">
          Instead of relying on one AI model, Veriq coordinates multiple specialized AI agents that independently investigate a question before producing a final report.
        </p>
        <p className="mx-auto mt-2 max-w-xl text-[15px] md:text-[16px] font-medium text-[#171717]">
          Every conclusion is supported by research, verification, and transparent confidence scoring.
        </p>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-[#ebebeb] bg-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">Process Workflow</span>
            <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717]">
              From Question to Verified Report
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {/* Step 1 */}
            <div
              onClick={() => setActiveWorksStep(0)}
              className={`rounded-[12px] border p-6 transition-all cursor-pointer ${
                activeWorksStep === 0
                  ? "border-[#171717] bg-[#fafafa] shadow-[0px_2px_4px_rgba(0,0,0,0.02)]"
                  : "border-[#ebebeb] bg-white hover:border-[#a1a1a1]"
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-xs font-bold mb-4">
                1
              </div>
              <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">Ask</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#4d4d4d]">
                Enter any research question. Veriq creates a research strategy and identifies what needs to be investigated.
              </p>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveWorksStep(1)}
              className={`rounded-[12px] border p-6 transition-all cursor-pointer ${
                activeWorksStep === 1
                  ? "border-[#171717] bg-[#fafafa] shadow-[0px_2px_4px_rgba(0,0,0,0.02)]"
                  : "border-[#ebebeb] bg-white hover:border-[#a1a1a1]"
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-xs font-bold mb-4">
                2
              </div>
              <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">Investigate</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#4d4d4d]">
                Specialized AI agents search trusted sources, analyze evidence, verify claims, and identify contradictions. Each focuses on one task.
              </p>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveWorksStep(2)}
              className={`rounded-[12px] border p-6 transition-all cursor-pointer ${
                activeWorksStep === 2
                  ? "border-[#171717] bg-[#fafafa] shadow-[0px_2px_4px_rgba(0,0,0,0.02)]"
                  : "border-[#ebebeb] bg-white hover:border-[#a1a1a1]"
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-xs font-bold mb-4">
                3
              </div>
              <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">Verify</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#4d4d4d]">
                Claims are independently validated and assigned confidence scores based on supporting evidence.
              </p>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => setActiveWorksStep(3)}
              className={`rounded-[12px] border p-6 transition-all cursor-pointer ${
                activeWorksStep === 3
                  ? "border-[#171717] bg-[#fafafa] shadow-[0px_2px_4px_rgba(0,0,0,0.02)]"
                  : "border-[#ebebeb] bg-white hover:border-[#a1a1a1]"
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#171717] text-white font-mono text-xs font-bold mb-4">
                4
              </div>
              <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">Report</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#4d4d4d]">
                Receive a structured report containing executive summaries, verified claims, contradictions, and actionable citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Multi-Agent Architecture Section ───────────────── */}
      <section id="architecture" className="mx-auto max-w-6xl px-6 py-24 border-b border-[#ebebeb]">
        <div className="text-center mb-16">
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">Multi-Agent Architecture</span>
          <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717]">
            A Team of AI Specialists, Coordinated by One Orchestrator
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[14px] text-[#4d4d4d]">
            Veriq breaks complex research into specialized tasks handled by independent AI agents. Instead of one model trying to do everything, each agent contributes expertise.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Agent selection links */}
          <div className="lg:col-span-4 space-y-1">
            {Object.keys(architectureAgents).map((key) => {
              const active = activeArchitectureAgent === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveArchitectureAgent(key)}
                  className={`w-full text-left h-[44px] px-4 rounded-[6px] text-[13px] font-medium flex items-center justify-between transition-colors ${
                    active
                      ? "bg-white border border-[#ebebeb] text-[#171717] shadow-[0px_1px_1px_rgba(0,0,0,0.02)]"
                      : "text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717]"
                  }`}
                >
                  <span>{architectureAgents[key].title}</span>
                  <ChevronRight className={`h-4 w-4 text-[#8f8f8f] transition-transform ${active ? "translate-x-0.5" : ""}`} />
                </button>
              );
            })}
          </div>

          {/* Active agent detail display */}
          <div className="lg:col-span-8 rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)] min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#8f8f8f] uppercase tracking-wider mb-2">
                Active Architecture Node
              </div>
              <h3 className="text-[20px] font-semibold tracking-[-0.4px] text-[#171717]">
                {architectureAgents[activeArchitectureAgent].title}
              </h3>
              
              <div className="mt-4 space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#8f8f8f] block">Target Registry Model</span>
                  <span className="text-[13px] font-medium text-[#171717] font-mono">
                    {architectureAgents[activeArchitectureAgent].model}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-[#8f8f8f] block">Primary Responsibility</span>
                  <p className="text-[14px] text-[#4d4d4d] leading-6 mt-0.5">
                    {architectureAgents[activeArchitectureAgent].responsibility}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-[#8f8f8f] block">Core Details</span>
                  <p className="text-[13px] text-[#8f8f8f] leading-5 mt-0.5">
                    {architectureAgents[activeArchitectureAgent].details}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#ebebeb] pt-4 mt-6 flex justify-between items-center text-[12px] font-mono text-[#8f8f8f]">
              <span>{architectureAgents[activeArchitectureAgent].metric}</span>
              <span className="text-green-600 flex items-center gap-1 font-semibold">
                <Check className="h-3 w-3" /> Enabled
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Features List ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 border-b border-[#ebebeb]">
        <div className="text-center mb-16">
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">Features</span>
          <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717]">
            Designed for Absolute Integrity
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* F 1 */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">
              Multi-Agent Intelligence
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d]">
              Multiple specialized AI agents collaborate to solve one research problem, avoiding single-point model bias.
            </p>
          </div>

          {/* F 2 */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">
              Evidence-Backed Research
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d]">
              Every single claim is supported by direct URL citations and verified context, matching academic review patterns.
            </p>
          </div>

          {/* F 3 */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">
              Contradiction Detection
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d]">
              Veriq deploys a dedicated agent to actively challenge and attempt to disprove assertions.
            </p>
          </div>

          {/* F 4 */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">
              Explainable Confidence
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d]">
              We don't just output numbers. Every score outlines the exact positive and negative factors behind it.
            </p>
          </div>

          {/* F 5 */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">
              Transparent Citations
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d]">
              Direct links to raw papers, government releases, and academic journals that formed the research.
            </p>
          </div>

          {/* F 6 */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#171717]">
              Structured Research Reports
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#4d4d4d]">
              Receive beautifully organized reports that are easy to verify, download, and share.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Veriq Table (Comparison) ─────────────────── */}
      <section id="why-veriq" className="mx-auto max-w-5xl px-6 py-24 border-b border-[#ebebeb]">
        <div className="text-center mb-16">
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">Comparative Analysis</span>
          <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717]">
            Traditional AI vs. Veriq
          </h2>
        </div>

        <div className="border border-[#ebebeb] rounded-[12px] overflow-hidden bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#ebebeb]">
                <th className="p-4 text-[13px] font-semibold uppercase tracking-wider text-[#8f8f8f] font-mono w-1/3">Feature</th>
                <th className="p-4 text-[13px] font-semibold uppercase tracking-wider text-[#8f8f8f] font-mono w-1/3">Traditional AI</th>
                <th className="p-4 text-[13px] font-semibold uppercase tracking-wider text-[#171717] font-mono w-1/3">Veriq</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              <tr className="border-b border-[#ebebeb]">
                <td className="p-4 font-semibold text-[#171717]">Execution Framework</td>
                <td className="p-4 text-[#4d4d4d]">Single AI model generation</td>
                <td className="p-4 text-[#0070f3] font-semibold">Multiple specialized AI agents</td>
              </tr>
              <tr className="border-b border-[#ebebeb]">
                <td className="p-4 font-semibold text-[#171717]">Reasoning Process</td>
                <td className="p-4 text-[#4d4d4d]">Hidden, non-traceable</td>
                <td className="p-4 text-[#0070f3] font-semibold">Research-first workflow</td>
              </tr>
              <tr className="border-b border-[#ebebeb]">
                <td className="p-4 font-semibold text-[#171717]">Verification Layer</td>
                <td className="p-4 text-[#4d4d4d]">None, prone to hallucination</td>
                <td className="p-4 text-[#0070f3] font-semibold">Independent claim verification</td>
              </tr>
              <tr className="border-b border-[#ebebeb]">
                <td className="p-4 font-semibold text-[#171717]">Bias Reduction</td>
                <td className="p-4 text-[#4d4d4d]">Accepts statements at face value</td>
                <td className="p-4 text-[#0070f3] font-semibold">Contradiction analysis checks</td>
              </tr>
              <tr className="border-b border-[#ebebeb]">
                <td className="p-4 font-semibold text-[#171717]">Citations & Links</td>
                <td className="p-4 text-[#4d4d4d]">Often missing or broken URLs</td>
                <td className="p-4 text-[#0070f3] font-semibold">Transparent, verified references</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#171717]">Output Style</td>
                <td className="p-4 text-[#4d4d4d]">Standard conversational text block</td>
                <td className="p-4 text-[#0070f3] font-semibold">Structured fact-checked report</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Product Preview List ─────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center border-b border-[#ebebeb]">
        <span className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f]">Deliverables</span>
        <h2 className="mt-2 text-[32px] font-semibold tracking-[-1.28px] text-[#171717]">
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
            <div key={idx} className="flex items-center gap-2 border-b border-[#ebebeb] pb-2 text-[14px] text-[#4d4d4d]">
              <Check className="h-4 w-4 text-[#0070f3]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final Call To Action ──────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24 text-center border-b border-[#ebebeb] bg-white">
        <div className="absolute inset-0 -z-10 flex justify-center overflow-hidden pointer-events-none">
          <div className="h-[400px] w-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-100/40 via-cyan-100/30 to-white blur-[100px] opacity-60" />
        </div>

        <div className="mx-auto max-w-3xl">
          <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-1.28px] text-[#171717]">
            Research Beyond the First Answer.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#4d4d4d]">
            Veriq doesn't just generate responses—it investigates them. Experience transparent, evidence-backed research powered by autonomous AI agents.
          </p>
          <div className="mt-8">
            <Link
              href={user ? "/workspace" : "/signup"}
              className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#171717] px-8 text-[15px] font-medium text-white transition-all hover:bg-[#2c2c2c] hover:scale-[1.02] shadow-[0px_2px_4px_rgba(0,0,0,0.06)]"
            >
              Launch Veriq
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-[#ebebeb] bg-[#fafafa] py-16 px-6">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 flex items-center justify-center rounded-[4px] bg-[#171717] text-white font-mono font-bold text-xs">
                V
              </div>
              <span className="text-[16px] font-semibold text-[#171717]">Veriq</span>
            </div>
            <p className="text-[13px] text-[#8f8f8f] leading-5">
              Autonomous Multi-Agent Research Platform.<br />
              <strong>Research. Verify. Challenge. Trust.</strong>
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] mb-4">Product</h4>
            <ul className="space-y-2 text-[13px] text-[#4d4d4d]">
              <li><a href="#features" className="hover:text-[#171717] transition-colors">Features</a></li>
              <li><a href="#architecture" className="hover:text-[#171717] transition-colors">Architecture</a></li>
              <li><a href="#" className="hover:text-[#171717] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#171717] transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-mono uppercase tracking-wider text-[#8f8f8f] mb-4">Resources</h4>
            <ul className="space-y-2 text-[13px] text-[#4d4d4d]">
              <li><a href="#" className="hover:text-[#171717] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#171717] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#171717] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-6xl border-t border-[#ebebeb] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-[12px] text-[#8f8f8f] gap-4">
          <div>&copy; 2026 Veriq AI. All rights reserved.</div>
          <div className="flex gap-4">
            <span className="font-medium text-[#171717]">Geist Design Language v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
