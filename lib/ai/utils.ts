import { Source, Claim, Contradiction } from "./types";

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
  // Let's assume this means we have exactly 1 source total or 1 verified source
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
    // Remove markdown code fences if present
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
