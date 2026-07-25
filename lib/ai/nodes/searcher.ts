import { ResearchState } from "../state";
import { Source } from "../types";
import { TavilyService } from "../services/tavily";
import { FirecrawlService } from "../services/firecrawl";
import { truncateText, executeNodeStep, evaluateSourceUrl } from "../utils";
import { RunnableConfig } from "@langchain/core/runnables";

/** Maximum number of sources to scrape with Firecrawl per run. */
const MAX_FIRECRAWL_SOURCES = 3;

/** Maximum snippet length after enrichment (chars). */
const MAX_SNIPPET_LENGTH = 2000;

/**
 * Search Specialist Node
 *
 * No LLM usage. Pure data fetching and normalization.
 */
export async function searchSpecialistNode(
  state: ResearchState,
  config?: RunnableConfig
): Promise<Partial<ResearchState>> {
  return executeNodeStep(
    "Search Specialist",
    "Running web searches and crawling top sources",
    state,
    config,
    async () => {
      if (state.researchObjectives.length === 0) {
        return {
          sources: [],
          status: "search_completed",
        };
      }

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
      }

      // ── 4. Normalize and assign stable IDs ───────────────────────────
      const normalizedSources: Source[] = uniqueSources.map(
        (source, index): Source => {
          const { isGovAcad, reliabilityScore } = evaluateSourceUrl(source.url);
          return {
            id: `src-${Date.now()}-${index}`,
            title: source.title || "Untitled Source",
            url: source.url,
            snippet: source.snippet || "",
            reliabilityScore: source.reliabilityScore ?? reliabilityScore,
            isGovAcad: source.isGovAcad ?? isGovAcad,
          };
        }
      );

      return {
        sources: normalizedSources,
        status: "search_completed",
      };
    }
  );
}
