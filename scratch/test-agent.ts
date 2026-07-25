import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { runResearchGraph } from "../lib/ai/graph";

async function test() {
  const question =
    process.argv[2] ||
    "Does intermittent fasting improve insulin sensitivity?";

  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║           Veriq AI — Agent Test Runner           ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log(`\nQuestion: "${question}"\n`);

  const startTime = Date.now();

  try {
    const result = await runResearchGraph("test-session-123", question);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log("\n══════════════════════════════════════════════════");
    console.log(" RESULTS");
    console.log("══════════════════════════════════════════════════");

    // ── Research Strategy ──────────────────────────────────────
    console.log("\n📋 Research Objectives:");
    result.researchObjectives.forEach((obj, i) => {
      console.log(`  ${i + 1}. ${obj}`);
    });

    // ── Sources ────────────────────────────────────────────────
    console.log(`\n🔍 Sources Found: ${result.sources.length}`);
    result.sources.forEach((s, i) => {
      const tag = s.isGovAcad ? " [GOV/ACAD]" : "";
      console.log(
        `  ${i + 1}. [${s.reliabilityScore}/100]${tag} ${s.title}`
      );
      console.log(`     ${s.url}`);
    });

    // ── Research Notes ─────────────────────────────────────────
    console.log(`\n📝 Research Notes (${result.researchNotes.length} chars):`);
    console.log(
      result.researchNotes.length > 500
        ? result.researchNotes.slice(0, 500) + "\n  ... (truncated)"
        : result.researchNotes
    );

    // ── Claims ─────────────────────────────────────────────────
    console.log(`\n✅ Claims: ${result.claims.length}`);
    result.claims.forEach((c) => {
      const icon =
        c.status === "verified"
          ? "✅"
          : c.status === "mixed"
            ? "⚠️"
            : c.status === "unsupported"
              ? "❌"
              : "❓";
      console.log(`  ${icon} [${c.id}] ${c.claimText}`);
      if (c.status) {
        console.log(`     Status: ${c.status}`);
      }
      if (c.explanation) {
        console.log(`     Reason: ${c.explanation}`);
      }
    });

    // ── Contradictions ─────────────────────────────────────────
    console.log(`\n⚔️  Contradictions: ${result.contradictions.length}`);
    if (result.contradictions.length > 0) {
      result.contradictions.forEach((ct, i) => {
        console.log(`  ${i + 1}. Claim: ${ct.claimId}`);
        console.log(`     Contradiction: ${ct.contradictionText}`);
        console.log(`     Source: ${ct.sourceId}`);
        console.log(`     Explanation: ${ct.explanation}`);
      });
    } else {
      console.log("  (none found)");
    }

    // ── Summary ────────────────────────────────────────────────
    console.log("\n══════════════════════════════════════════════════");
    console.log(` Status: ${result.status}`);
    console.log(` Retry Count: ${result.retryCount}`);
    console.log(` Elapsed: ${elapsed}s`);
    console.log("══════════════════════════════════════════════════");
  } catch (error) {
    console.error("\n❌ Test failed with error:", error);
    process.exit(1);
  }
}

test();
