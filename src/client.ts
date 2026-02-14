import axios from "axios";
import type { SearchResult } from "./types.js";

const BASE_URL = process.env.HYTALEMODDOC_URL || "https://hytalemodding.dev";

export class HytaleDocsClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async search(query: string, locale: string = "en"): Promise<SearchResult[]> {
    const response = await axios.get<SearchResult[]>(`${this.baseUrl}/api/search`, {
      params: { query, locale },
    });

    return response.data;
  }

  async fetchPage(path: string): Promise<string> {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${this.baseUrl}${normalizedPath}`;

    const response = await axios.get<string>(url, {
      headers: {
        Accept: "text/html",
      },
      responseType: "text",
    });

    return response.data;
  }

  getFullUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
