# Hytale Modding MCP Server

An MCP (Model Context Protocol) server that provides AI tools with access to the [Hytale modding documentation](https://hytalemodding.dev/en/docs). Run it locally and connect it to Claude Desktop, Cursor, Windsurf, or any MCP-compatible client.

## Tools

### `search_docs`

Search the documentation index. Returns matching pages and sections grouped by page with URLs and breadcrumb paths.

| Parameter | Type   | Required | Default | Description                         |
|-----------|--------|----------|---------|-------------------------------------|
| `query`   | string | yes      |         | Search query text                   |
| `locale`  | string | no       | `"en"`  | Locale code                         |
| `limit`   | number | no       | `10`    | Limits the number of pages returned |

### `get_doc`

Fetch the full content of a documentation page, converted from HTML to readable text.

| Parameter | Type   | Required | Description                                                          |
|-----------|--------|----------|----------------------------------------------------------------------|
| `path`    | string | yes      | Page path, e.g. `/en/docs/official-documentation/custom-ui/markup`   |

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npm run build
```

## Running the server

The MCP-server communicates over stdio (stdin/stdout) using JSON-RPC, which is how MCP clients launch and talk to it, so there's
no need to have an ever-running server. AI clients will trigger the requests directly against the `dist/index.js` file (refer
to the testing manually section).

## Client configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
a
```

### Cursor

Go to **Cursor Settings > Tools & Integrations > MCP Tools** and add:

```json
{
  "mcpServers": {
    "hytalemodding-docs": {
      "command": "node",
      "args": ["/absolute/path/to/hytalemodding-mcp-server/dist/index.js"]
    }
  }
}
```

### Windsurf

Open **Command Palette > Windsurf MCP Configuration Panel** and add the same JSON block as above.

### Claude Code

Run this from any directory:

```bash
claude mcp add hytalemodding-docs node /absolute/path/to/hytalemodding-mcp-server/dist/index.js
```

## Development

Watch mode recompiles on file changes:

```bash
npm run dev
```

## Testing manually

You can pipe JSON-RPC messages to the server over stdio to test:

```bash
# Initialize and list tools
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' | node dist/index.js 2>/dev/null

# Search for documentation
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_docs","arguments":{"query":"NPC template"}}}\n' | node dist/index.js 2>/dev/null

# Fetch a specific doc page
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_doc","arguments":{"path":"/en/docs/quick-start"}}}\n' | node dist/index.js 2>/dev/null
```

