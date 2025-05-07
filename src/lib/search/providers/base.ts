import type {
  SearchProvider,
  SearchProviderType,
  SearchResult,
} from "../types";

export abstract class BaseSearchProvider implements SearchProvider {
  abstract type: SearchProviderType;
  abstract label: string;
  abstract includeInGlobalSearch: boolean;

  async search(query: string): Promise<SearchResult[]> {
    try {
      const cleanedQuery = this.preprocess(query);
      return this.handleSearch(cleanedQuery);
    } catch (error) {
      console.error(`[Search] Provider "${this.type}" failed:`, error);
      return [];
    }
  }

  protected preprocess(query: string): string {
    return query.trim().toLowerCase();
  }

  protected abstract handleSearch(
    cleanedQuery: string,
  ): Promise<SearchResult[]>;
}
