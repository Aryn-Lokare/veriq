export interface FirecrawlScrapeResult {
  markdown: string;
  title?: string;
  metadata?: Record<string, any>;
}

export class FirecrawlService {
  private static getApiKey(): string {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: FIRECRAWL_API_KEY is not configured in the environment.");
    }
    return apiKey || "";
  }

  /**
   * Scrapes page content using the Firecrawl API.
   * Returns markdown content and page metadata.
   */
  public static async scrape(url: string): Promise<FirecrawlScrapeResult | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return null;
    }

    try {
      const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          formats: ["markdown"],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Firecrawl API responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.error || "Scraping failed with no data returned.");
      }

      const scrapeData = data.data;

      return {
        markdown: scrapeData.markdown || "",
        title: scrapeData.metadata?.title || "",
        metadata: scrapeData.metadata,
      };
    } catch (error) {
      console.error(`Firecrawl scraping failed for URL: ${url}`, error);
      return null;
    }
  }
}
