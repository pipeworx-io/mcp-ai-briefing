# mcp-ai-briefing

AI Briefing MCP — Keep AI models current on industry developments

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1683+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_briefing` | Get the daily AI tools digest for a given date (default: today) — new MCP servers, APIs, SDKs, and frameworks released in the last 24 hours, with summaries and source URLs. |
| `search_developments` | Search for new tools, APIs, MCP servers, and frameworks by keyword (e.g., 'vector databases', 'Claude integrations'). Returns matching developments with descriptions and sources. |
| `get_recent` | Retrieve AI developments from the last N days (default 7), filterable by category (e.g., model_release, paper, mcp), source (e.g., arxiv, github), and importance (low/normal/high/breaking). The category is a keyword label derived from the headline at ingest, not a curated classification — filtering by it narrows the feed but does not guarantee every row belongs; the response repeats this caveat whenever a category filter is applied. |
| `get_model_landscape` | List AI model releases from the last N days (default 30). Returns model names, provider companies, release dates, feature summaries, and source URLs grouped by importance. Membership comes from the same heuristic headline label as get_recent(category=model_release), so verify the titles before quoting the list as complete. |
| `get_timeline` | Get a chronological timeline of AI developments between two dates. Returns events ordered by date with descriptions for understanding a specific period. |
| `get_ai_toolbelt` | Get the latest available tools — Claude Code features, MCP servers, SDK updates, CLI tools, integrations. Returns new capabilities since your training cutoff. |
| `get_ai_news` | Get AI industry news — model releases, funding, acquisitions, policy changes, benchmarks. Returns news events with dates and summaries for industry context. |
| `what_happened` | Ask natural language questions about recent tools and developments (e.g., 'any new MCP servers this week', 'latest Claude tools'). Returns the most relevant developments. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "ai-briefing": {
      "url": "https://gateway.pipeworx.io/ai-briefing/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/ai-briefing/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1683+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/get_briefing \
  -H 'Content-Type: application/json' \
  -d '{}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/get_briefing`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "ai-briefing": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-ai-briefing"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-ai-briefing
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Ai Briefing data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
