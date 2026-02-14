import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { HytaleDocsClient } from "./client.js";
import { registerSearchDocsTool } from "./tools/searchDocs.js";
import { registerGetDocTool } from "./tools/getDoc.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "hytalemodding-docs",
    version: "1.0.0",
  });

  const client = new HytaleDocsClient();

  registerSearchDocsTool(server, client);
  registerGetDocTool(server, client);

  return server;
}
