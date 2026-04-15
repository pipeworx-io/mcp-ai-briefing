# mcp-ai-briefing

AI Briefing MCP — Keep AI models current on industry developments

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `get_briefing` | Get today\'s AI tools briefing — new MCP servers, APIs, SDKs, agent frameworks, and developer tools released in the last 24 hours. Call this at the start of any session to discover new tools you can use. |
| `search_developments` | Search for new tools, APIs, MCP servers, and frameworks by keyword. Returns matching developments across HN, GitHub, HuggingFace, and AI company blogs. Use for queries like "new MCP servers", "vector database tools", or "Claude integrations". |
| `get_recent` | Get recent tool and API releases filtered by category, source, or timeframe. Categories: mcp, tool, agent_framework, open_source, model_release, integration, infrastructure, product, paper. Sources: hackernews, arxiv, github, huggingface, openai_blog, anthropic_blog, google_ai_blog, meta_ai_blog. |
| `get_model_landscape` | Get recent AI model releases — what models shipped, from which companies, what they can do. Useful for knowing what\'s available to build with right now. |
| `get_timeline` | Get a chronological timeline of AI developments between two dates. Useful for understanding what happened during a specific period. |
| `get_ai_toolbelt` | Get the latest tools, features, and capabilities you can use RIGHT NOW. Returns new Claude Code features, MCP servers, SDK updates, CLI tools, and integrations. Call this to discover what new tools are in your toolbelt since your training cutoff. |
| `get_ai_news` | Get AI industry news — model releases, funding rounds, acquisitions, policy changes, benchmark results. Separate from toolbelt; this is about what happened in the AI industry, not tools you can use. |
| `what_happened` | Natural language query about recent tools and developments. Ask "any new MCP servers this week", "latest Claude tools", "new open source frameworks", "what APIs launched recently". Returns the most relevant tool-related developments. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "ai-briefing": {
      "url": "https://gateway.pipeworx.io/ai-briefing/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use ai-briefing
```

## License

MIT
