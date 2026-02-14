import {z} from "zod";
import axios from "axios";
import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import type {HytaleDocsClient} from "../client.js";
import {extractTextFromHtml} from "../utils/extractHtml.js";

export function registerGetDocTool(server: McpServer, client: HytaleDocsClient): void {
    server.registerTool(
        "get_doc",
        {
            description: "Fetch the full content of a Hytale modding documentation page. You MUST use the search_docs tool first to get a list of URLs that are compatible with this tool.",
            inputSchema: {
                url: z.string().describe("Documentation page url (e.g. '/en/docs/official-documentation')"),
            },
        },
        async ({url}) => {
            try {
                const html = await client.fetchPage(url);
                const text = extractTextFromHtml(html);

                return {
                    content: [
                        {
                            type: "text" as const,
                            text: text,
                        },
                    ],
                };
            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? `${error.response?.status ?? "unknown"}: ${error.message}`
                    : error instanceof Error ? error.message : String(error);
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: `Error fetching doc page: ${message}`,
                        },
                    ],
                    isError: true,
                };
            }
        },
    );
}
