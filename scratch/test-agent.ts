import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { runResearchGraph } from '../lib/ai/graph';

async function test() {
  const question = process.argv[2] || "Does intermittent fasting improve insulin sensitivity?";
  console.log(`Starting test with question: "${question}"`);
  
  try {
    const result = await runResearchGraph("test-session-123", question);
    console.log("\n=================================");
    console.log("Research State Output:");
    console.log("=================================");
    console.log("Status:", result.status);
    console.log("Retry Count:", result.retryCount);
    console.log("Research Objectives:", result.researchObjectives);
    console.log("Sources Found:", result.sources.length);
    console.log("\nSources List:");
    result.sources.forEach((s, i) => {
      console.log(`  ${i + 1}. [${s.reliabilityScore}/100] ${s.title} (${s.url})`);
    });
    console.log("\nResearch Notes:\n", result.researchNotes);
    console.log("\nFinal Report Stub:\n", result.finalReport);
    console.log("=================================");
  } catch (error) {
    console.error("Test failed with error:", error);
  }
}

test();
