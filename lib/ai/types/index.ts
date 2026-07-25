export interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  reliabilityScore?: number;
  isGovAcad?: boolean;
}

export interface Claim {
  id: string;
  claimText: string;
  status?: 'verified' | 'mixed' | 'unsupported';
  explanation?: string;
  confidenceScore?: number;
}

export interface Contradiction {
  claimId: string;
  contradictionText: string;
  sourceId: string;
  explanation: string;
}

export interface AgentLog {
  agentName: string;
  status: 'waiting' | 'running' | 'completed' | 'failed';
  message: string;
  outputData?: Record<string, any>;
  durationMs?: number;
}

export interface ConfidenceReasoning {
  score: number;
  reason: string;
  supportingFactors: string[];
  detractingFactors: string[];
}

export interface ResearchSession {
  sessionId: string;
  question: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  confidenceScore?: number;
  summary?: string;
  createdAt: string;
}
