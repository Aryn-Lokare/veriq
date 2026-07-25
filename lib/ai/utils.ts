import { RunnableConfig } from "@langchain/core/runnables";
import { Source, Claim, Contradiction, AgentEvent, AgentEventCallback } from "./types";

/**
 * Calculates a confidence score based on the algorithm specified in the PRD.
 * - Base Score = 50
 * - +10 for each trusted source (max +30)
 * - +20 if at least one source is government or academic
 * - -15 if contradictions exist
 * - -10 if only one source confirms overall
 * - Clamp between 0 and 100
 */
export function calculateConfidence(
  sources: Source[],
  claims: Claim[],
  contradictions: Contradiction[]
): number {
  let score = 50;

  // 1. +10 for each trusted source (max +30)
  // Let's count sources with reliabilityScore >= 70 as trusted
  const trustedSourcesCount = sources.filter(s => (s.reliabilityScore ?? 50) >= 70).length;
  score += Math.min(trustedSourcesCount * 10, 30);

  // 2. +20 if at least one source is government or academic
  const hasGovAcad = sources.some(s => s.isGovAcad === true);
  if (hasGovAcad) {
    score += 20;
  }

  // 3. -15 if contradictions exist
  if (contradictions.length > 0) {
    score -= 15;
  }

  // 4. -10 if only one source confirms overall
  if (sources.length === 1) {
    score -= 10;
  }

  // Clamp the score between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Cleans markdown code block wraps and parses JSON from text safely.
 */
export function parseSafeJson<T>(text: string, fallback: T): T {
  try {
    let cleanText = text.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
    }
    return JSON.parse(cleanText.trim()) as T;
  } catch (error) {
    console.error("JSON parsing failed for text:", text, error);
    return fallback;
  }
}

/**
 * Truncates text with trailing ellipsis if it exceeds maxLength.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

/**
 * Evaluates a URL to determine if it is a government/academic host
 * and calculates a baseline reliability score.
 */
export interface NormalizedSourceInfo {
  isGovAcad: boolean;
  reliabilityScore: number;
}

export function evaluateSourceUrl(url: string): NormalizedSourceInfo {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const isGovAcad =
      hostname.endsWith(".gov") ||
      hostname.endsWith(".edu") ||
      hostname.endsWith(".gov.in") ||
      hostname.endsWith(".ac.uk") ||
      hostname.endsWith(".gov.uk") ||
      hostname.endsWith(".edu.au");
    const reliabilityScore = isGovAcad ? 90 : 70;
    return { isGovAcad, reliabilityScore };
  } catch {
    return { isGovAcad: false, reliabilityScore: 70 };
  }
}

/**
 * Executes a graph node step with unified logging, metrics,
 * callback events, and global error safety fallback.
 */
export async function executeNodeStep<T>(
  agentName: string,
  statusMessage: string,
  state: { sessionId: string },
  config: RunnableConfig | undefined,
  action: () => Promise<T>
): Promise<T> {
  const onAgentEvent = config?.configurable?.onAgentEvent as AgentEventCallback | undefined;
  const sessionId = state.sessionId || "unknown-session";
  const startTime = Date.now();

  console.log(`[${agentName}] Starting: ${statusMessage}`);

  if (onAgentEvent) {
    try {
      await onAgentEvent({
        sessionId,
        agentName,
        status: "running",
        message: statusMessage,
      });
    } catch (e) {
      console.error(`[${agentName}] Logger callback failed:`, e);
    }
  }

  try {
    const result = await action();
    const durationMs = Date.now() - startTime;
    console.log(`[${agentName}] Completed in ${durationMs}ms`);

    if (onAgentEvent) {
      try {
        await onAgentEvent({
          sessionId,
          agentName,
          status: "completed",
          message: `Finished: ${statusMessage}`,
          outputData: typeof result === "object" ? (result as Record<string, any>) : { result },
          durationMs,
        });
      } catch (e) {
        console.error(`[${agentName}] Logger callback failed:`, e);
      }
    }

    return result;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${agentName}] Failed after ${durationMs}ms with error:`, error);

    if (onAgentEvent) {
      try {
        await onAgentEvent({
          sessionId,
          agentName,
          status: "failed",
          message: `Error: ${errorMessage}`,
          outputData: { error: errorMessage },
          durationMs,
        });
      } catch (e) {
        console.error(`[${agentName}] Logger callback failed:`, e);
      }
    }

    throw error;
  }
}
