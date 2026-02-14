export interface SearchResultHighlight {
  type: "text";
  content: string;
  styles?: { highlight: boolean };
}

export interface SearchResult {
  id: string;
  type: string;
  url: string;
  content: string;
  breadcrumbs?: string[];
  contentWithHighlights?: SearchResultHighlight[];
}
