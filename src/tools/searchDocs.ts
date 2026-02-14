import {z} from "zod";
import axios from "axios";
import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import type {HytaleDocsClient} from "../client.js";
import {groupSearchResults} from "../utils/groupSearchResults.js";

export function registerSearchDocsTool(server: McpServer, client: HytaleDocsClient): void {
    server.registerTool(
        "search_docs",
        {
            description: "Fetch the full content of a Hytale modding documentation page. Provide a doc path (e.g. '/en/docs/official-documentation'). Use search_docs first to find the right page path.",
            inputSchema: {
                query: z.string().describe("Search query (e.g. 'custom UI', 'NPC template', 'world generation')"),
                locale: z.string().optional().default("en").describe("Locale code (default: 'en')"),
                limit: z.number().optional().default(10).describe("Maximum number of pages to return (default: 10)")
            },
            outputSchema: {
                results: z.array(z.object({
                    url: z.string(),
                    results: z.array(z.object({
                        id: z.string(),
                        type: z.string(),
                        url: z.string(),
                        content: z.string(),
                        breadcrumbs: z.array(z.string()).optional(),
                    }))
                })),
            }
        },
        async ({query, locale, limit}) => {
            try {
                const results = await client.search(query, locale);
                const searchResults = groupSearchResults(results, client.getFullUrl(""));
                const formattedResults = Object.keys(searchResults).map(url => ({
                    url,
                    results: searchResults[url],
                })).slice(0, limit);

                // Create a summary of the results
                const totalResults = formattedResults.reduce((sum, page) => sum + page.results.length, 0);
                const summary = `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} across ${formattedResults.length} page${formattedResults.length !== 1 ? 's' : ''} for query: "${query}"`;

                // return output
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: JSON.stringify(formattedResults),
                        },
                    ],
                    structuredContent: {
                        results: formattedResults,
                    },
                };
            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? `${error.response?.status ?? "unknown"}: ${error.message}`
                    : error instanceof Error ? error.message : String(error);
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: `Error searching docs: ${message}`,
                        },
                    ],
                    isError: true,
                };
            }
        },
    );
}
