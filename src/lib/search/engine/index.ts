import {
  ChapterSearchProvider,
  CourseSearchProvider,
} from "../providers/chapter";
import type { GroupedSearchResult, SearchProvider } from "../types";

interface SearchOptions {
  query: string;
  raw: string;
}

export class SearchEngine {
  private providers: Map<string, SearchProvider> = new Map<
    string,
    SearchProvider
  >();

  register(provider: SearchProvider): void {
    if (this.providers.has(provider.type)) {
      throw new Error(
        `Provider for type "${provider.type}" is already registered.`,
      );
    }
    this.providers.set(provider.type, provider);
  }

  constructor() {
    this.register(new ChapterSearchProvider());
    this.register(new CourseSearchProvider());
  }

  /**
   * Optional: supports short aliases in the future.
   */
  parseQuery(raw: string) {
    const regex = /^:([a-z]+)\s+(.+)/i;
    const match = regex.exec(raw);
    console.log(match);
    if (match?.[1]) {
      return {
        type: match[1]?.toLowerCase(),
        query: this.sanitizeQuery(match[1].toLowerCase()),
      };
    }
    return { type: "global", query: this.sanitizeQuery(raw) };
  }

  private sanitizeQuery(q: string): string {
    return q.trim().replace(/\s{2,}/g, " ");
  }

  async search(raw: string): Promise<GroupedSearchResult[]> {
    const { type, query } = this.parseQuery(raw);

    if (!query) return [];

    const options: SearchOptions = { query, raw };

    if (type === "global") {
      const allResults = await Promise.allSettled(
        Array.from(this.providers.values())
          .filter((p) => p.includeInGlobalSearch)
          .map(async (provider) => {
            try {
              const results = await provider.search(query);
              return {
                type: provider.type,
                label: provider.label,
                results: results || [],
              };
            } catch (error) {
              console.error(
                `[Search] Provider "${provider.type}" failed:`,
                error,
              );
              throw error;
            }
          }),
      );

      return allResults
        .filter(
          (r): r is PromiseFulfilledResult<GroupedSearchResult> =>
            r.status === "fulfilled" && r.value.results.length > 0,
        )
        .map((r) => r.value);
    }

    const provider = this.providers.get(type);
    if (!provider) throw new Error(`Unknown search type "${type}"`);

    const results = await provider.search(options.query);
    return [
      {
        type: provider.type,
        label: provider.label,
        results: results || [],
      },
    ];
  }
}
