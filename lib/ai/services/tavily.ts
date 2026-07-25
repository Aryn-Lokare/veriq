import { Source } from "../types";
import { evaluateSourceUrl } from "../utils";

export interface TavilySearchOptions {
  searchDepth?: 'basic' | 'advanced';
  maxResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
}

export class TavilyService {
  private static getApiKey(): string {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: TAVILY_API_KEY is not configured in the environment.");
    }
    return apiKey || "";
  }

  /**
   * Run web search using Tavily API.
   * Returns a list of parsed Source items.
   */
  public static async search(query: string, options: TavilySearchOptions = {}): Promise<Source[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return [];
    }

    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: options.searchDepth || "basic",
          max_results: options.maxResults || 5,
          include_domains: options.includeDomains,
          exclude_domains: options.excludeDomains,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tavily API responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results.map((result: any, index: number): Source => {
        const url = result.url || "";
        const { isGovAcad, reliabilityScore } = evaluateSourceUrl(url);

        return {
          id: `tavily-${Date.now()}-${index}`,
          title: result.title || "Untitled Source",
          url,
          snippet: result.content || "",
          reliabilityScore,
          isGovAcad,
        };
      });
    } catch (error) {
      console.error("Tavily search failed:", error);
      return [];
    }
  }
}
 