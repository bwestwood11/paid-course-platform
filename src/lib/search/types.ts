export type SearchResult = {
  id: string;
  title: string;
  description?: string;
  url?: string;
};

export type SearchProvider = {
  type: SearchProviderType;
  label: string;
  includeInGlobalSearch?: boolean;
  search(query: string): Promise<SearchResult[]>;
};

export enum SearchProviderType {
  GLOBAL = "global",
  CHAPTER = "chapter",
  COURSE = "course",
}

export type GroupedSearchResult = {
  type: SearchProviderType;
  label: string;
  results: SearchResult[];
};
