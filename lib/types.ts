export type AgentId =
  | 'orchestrator'
  | 'strategist'
  | 'search'
  | 'analyst'
  | 'evidence'
  | 'verifier'
  | 'contradiction'
  | 'scorer'
  | 'writer';

export type AgentStatusState = 'idle' | 'running' | 'completed' | 'retrying' | 'error';

export interface AgentInfo {
  id: AgentId;
  name: string;
  role: string;
  icon: string; // Emoji or Lucide icon key
  description: string;
  status: AgentStatusState;
  currentTask: string;
  progress: number; // 0 to 100
  durationMs: number;
  outputSummary?: string;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  domain: string;
  authoritativeness: 'high' | 'medium' | 'low';
  type: 'peer-reviewed' | 'government' | 'academic' | 'news' | 'web';
  snippet: string;
  publishDate?: string;
  credibilityScore: number; // 0-100
}

export interface Claim {
  id: string;
  statement: string;
  status: 'verified' | 'mixed' | 'unsupported';
  confidenceScore: number;
  reasoning: string;
  supportingSourceIds: string[];
  conflictingSourceIds: string[];
  keyQuotes: string[];
  extractedByAgent: string;
}

export interface Contradiction {
  id: string;
  topic: string;
  claimA: string;
  sourceAId: string;
  claimB: string;
  sourceBId: string;
  explanation: string;
  impactOnConfidence: number; // Negative value
}

export interface ConfidenceBreakdown {
  baseScore: number; // 50
  trustedSourceBonus: number; // +10 per source (max +30)
  peerReviewedBonus: number; // +20 if gov or peer reviewed
  contradictionPenalty: number; // -15 if contradictions
  singleSourcePenalty: number; // -10 if single source
  finalScore: number; // 0 - 100
  explanation: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  agentId: AgentId;
  agentName: string;
  agentIcon: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'milestone';
<<<<<<< HEAD
  data?: any;
=======
  data?: Record<string, unknown>;
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'system';
  agentId: AgentId;
  message: string;
  details?: string;
}

export interface ResearchReport {
  id: string;
  query: string;
  timestamp: string;
  overallConfidence: ConfidenceBreakdown;
  executiveSummary: string;
  verifiedClaims: Claim[];
  contradictions: Contradiction[];
  sources: Source[];
  recommendations: string[];
  methodologyNotes: string;
}

export interface PresetQuery {
  id: string;
  title: string;
  question: string;
  category: string;
  report: ResearchReport;
}
