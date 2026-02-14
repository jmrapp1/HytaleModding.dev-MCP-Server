import type { SearchResult } from "../types.js";

export function groupSearchResults(results: SearchResult[], baseUrl: string): { [key: string]: Omit<SearchResult, 'contentWithHighlights'>[] } {
  if (results.length === 0) {
    return {};
  }

  const grouped: { [key: string]: any } = {};

  // group pages by url
  for (const result of results) {
    const pageUrl = result.url.split("#")[0];
    if (!grouped[pageUrl]) {
      grouped[pageUrl] = [];
    }
    delete result.contentWithHighlights;

    grouped[pageUrl].push(result);
  }

  return grouped;
}
