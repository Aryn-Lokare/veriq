import { ResearchState } from "../state";
import { Source } from "../types";
import { TavilyService } from "../services/tavily";
import { FirecrawlService } from "../services/firecrawl";
import { truncateText } from "../utils";

/** Maximum number of sources to scrape with Firecrawl per run. */
const MAX_FIRECRAWL_SOURCES = 3;

/** Maximum snippet length after enrichment (chars). */
const MAX_SNIPPET_LENGTH = 2000;

/**
 * Search Specialist Node
 *
 * No LLM usage. Pure data fetching and normalization.
 *
 * 1. Takes the research objectives from state.
 * 2. Runs parallel Tavily searches for each objective.
 * 3. Deduplicates results by URL.
 * 4. Optionally enriches the top sources with Firecrawl markdown.
 * 5. Normalizes all sources into the Source interface.
 */
export async function searchSpecialistNode(
  state: ResearchState
): Promise<Partial<ResearchState>> {
  console.log("[Node] searchSpecialist — Starting");
  console.log(
    `[Node] searchSpecialist — Objectives: ${state.researchObjectives.length}`
  );

  // ── 1. Run parallel Tavily searches ──────────────────────────────
  const searchPromises = state.researchObjectives.map((objective) =>
    TavilyService.search(objective, {
      searchDepth: "advanced",
      maxResults: 5,
    })
  );

  const searchResults = await Promise.allSettled(searchPromises);

  const rawSources: Source[] = [];
  for (const result of searchResults) {
    if (result.status === "fulfilled") {
      rawSources.push(...result.value);
    } else {
      console.warn(
        "[Node] searchSpecialist — A search query failed:",
        result.reason
      );
    }
  }

  console.log(
    `[Node] searchSpecialist — Raw sources collected: ${rawSources.length}`
  );

  // ── 2. Deduplicate by URL ────────────────────────────────────────
  const seenUrls = new Set<string>();
  const uniqueSources: Source[] = [];

  for (const source of rawSources) {
    const normalizedUrl = source.url.toLowerCase().replace(/\/+$/, "");
    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);
      uniqueSources.push(source);
    }
  }

  console.log(
    `[Node] searchSpecialist — Unique sources after dedup: ${uniqueSources.length}`
  );

  // ── 3. Enrich top sources with Firecrawl ─────────────────────────
  const hasFirecrawlKey = !!process.env.FIRECRAWL_API_KEY;

  if (hasFirecrawlKey) {
    const sourcesToEnrich = uniqueSources.slice(0, MAX_FIRECRAWL_SOURCES);

    const enrichPromises = sourcesToEnrich.map(async (source) => {
      try {
        const scrapeResult = await FirecrawlService.scrape(source.url);
        if (scrapeResult?.markdown) {
          source.snippet = truncateText(scrapeResult.markdown, MAX_SNIPPET_LENGTH);
          if (scrapeResult.title) {
            source.title = scrapeResult.title;
          }
        }
      } catch (error) {
        console.warn(
          `[Node] searchSpecialist — Firecrawl enrichment failed for ${source.url}:`,
          error
        );
      }
    });

    await Promise.allSettled(enrichPromises);
    console.log(
      `[Node] searchSpecialist — Enriched ${sourcesToEnrich.length} sources via Firecrawl`
    );
  } else {
    console.log(
      "[Node] searchSpecialist — Skipping Firecrawl enrichment (no API key)"
    );
  }

  // ── 4. Normalize and assign stable IDs ───────────────────────────
  const normalizedSources: Source[] = uniqueSources.map(
    (source, index): Source => ({
      id: `src-${Date.now()}-${index}`,
      title: source.title || "Untitled Source",
      url: source.url,
      snippet: source.snippet || "",
      reliabilityScore: source.reliabilityScore ?? 70,
      isGovAcad: source.isGovAcad ?? false,
    })
  );

  console.log(
    `[Node] searchSpecialist — Returning ${normalizedSources.length} normalized sources`
  );

  return {
    sources: normalizedSources,
    status: "search_completed",
  };
}
