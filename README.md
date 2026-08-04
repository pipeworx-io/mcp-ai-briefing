# mcp-ai-briefing

AI Briefing MCP — Keep AI models current on industry developments

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_briefing` | Get the daily AI tools digest for a given date (default: today) — new MCP servers, APIs, SDKs, and frameworks released in the last 24 hours, with summaries and source URLs. |
| `search_developments` | Search for new tools, APIs, MCP servers, and frameworks by keyword (e.g., 'vector databases', 'Claude integrations'). Returns matching developments with descriptions and sources. |
| `get_recent` | Retrieve AI developments from the last N days (default 7), filterable by category (e.g., model_release, paper, mcp), source (e.g., arxiv, github), and importance (low/normal/high/breaking). |
| `get_model_landscape` | List AI model releases from the last N days (default 30). Returns model names, provider companies, release dates, feature summaries, and source URLs grouped by importance. |
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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Ai Briefing data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
