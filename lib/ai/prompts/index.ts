/**
 * Central prompt registry.
 *
 * Each agent's system prompt lives in its own file for modularity.
 * This barrel re-exports them all.
 */

export { RESEARCH_STRATEGIST_PROMPT } from "./strategist";
export { RESEARCH_ANALYST_PROMPT } from "./analyst";
export { EVIDENCE_ANALYST_PROMPT } from "./evidence";
export { VERIFICATION_SPECIALIST_PROMPT } from "./verification";
export { CONTRADICTION_DETECTOR_PROMPT } from "./contradiction";
export { CONFIDENCE_SCORER_PROMPT } from "./scorer";
export { REPORT_WRITER_PROMPT } from "./writer";
