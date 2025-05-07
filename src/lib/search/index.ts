import { SearchEngine } from "./engine";

// To add a new search provider
// 1. Create a new class that extends BaseSearchProvider inside the providers folder
// 2. Add the type in the SearchProviderType enum
// 3. Implement the handleSearch method to return an array of SearchResult objects
// 4. Register the provider in the SearchEngine constructor

// DO NOT CREATE PROVIDER FOR TYPE GLOBAL AS IT IS USED FOR GLOBAL SEARCH AND HANDLED BY THE SEARCH ENGINE
// SEARCH PROVIDERS SHOULD BE REGISTERED IN THE SEARCH ENGINE CONSTRUCTOR

export const searchEngine = new SearchEngine();
