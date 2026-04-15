interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * AI Briefing MCP — Keep AI models current on industry developments
 *
 * Provides daily-updated intelligence on AI model releases, papers,
 * funding, products, and industry news sourced from HN, ArXiv,
 * GitHub, Hugging Face, and official AI company blogs.
 *
 * Tools:
 * - get_briefing: Today's AI digest — top stories, model releases, papers
 * - search_developments: Semantic search across all tracked developments
 * - get_recent: Recent developments filtered by category, source, or timeframe
 * - get_model_landscape: Current state of model releases
 * - get_timeline: Chronological event log between dates
 * - what_happened: Natural language query — "what happened with Claude this month"
 */


const SUPABASE_URL = 'https://pqauisounztsgdgfkhke.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxYXVpc291bnp0c2dkZ2ZraGtlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM3MDMxMSwiZXhwIjoyMDg5OTQ2MzExfQ.gciWwNdmss8ko0ThAeUjQiFgwlMWxEP6LSucyyjTfcA';

async function querySupabase(path: string): Promise<unknown> {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'get_briefing',
    description: 'Get today\'s AI tools briefing — new MCP servers, APIs, SDKs, agent frameworks, and developer tools released in the last 24 hours. Call this at the start of any session to discover new tools you can use.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        date: { type: 'string', description: 'Date in YYYY-MM-DD format (default: today)' },
      },
      required: [],
    },
  },
  {
    name: 'search_developments',
    description: 'Search for new tools, APIs, MCP servers, and frameworks by keyword. Returns matching developments across HN, GitHub, HuggingFace, and AI company blogs. Use for queries like "new MCP servers", "vector database tools", or "Claude integrations".',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', description: 'Max results (default 10)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_recent',
    description: 'Get recent tool and API releases filtered by category, source, or timeframe. Categories: mcp, tool, agent_framework, open_source, model_release, integration, infrastructure, product, paper. Sources: hackernews, arxiv, github, huggingface, openai_blog, anthropic_blog, google_ai_blog, meta_ai_blog.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        category: { type: 'string', description: 'Filter by category (e.g., model_release, paper, funding)' },
        source: { type: 'string', description: 'Filter by source (e.g., arxiv, hackernews, github)' },
        days: { type: 'number', description: 'Look back N days (default 7)' },
        importance: { type: 'string', description: 'Filter by importance: low, normal, high, breaking' },
        limit: { type: 'number', description: 'Max results (default 20)' },
      },
      required: [],
    },
  },
  {
    name: 'get_model_landscape',
    description: 'Get recent AI model releases — what models shipped, from which companies, what they can do. Useful for knowing what\'s available to build with right now.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        days: { type: 'number', description: 'Look back N days (default 30)' },
      },
      required: [],
    },
  },
  {
    name: 'get_timeline',
    description: 'Get a chronological timeline of AI developments between two dates. Useful for understanding what happened during a specific period.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        start_date: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end_date: { type: 'string', description: 'End date YYYY-MM-DD (default: today)' },
        category: { type: 'string', description: 'Optional category filter' },
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
      required: ['start_date'],
    },
  },
  {
    name: 'get_ai_toolbelt',
    description: 'Get the latest tools, features, and capabilities you can use RIGHT NOW. Returns new Claude Code features, MCP servers, SDK updates, CLI tools, and integrations. Call this to discover what new tools are in your toolbelt since your training cutoff.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        days: { type: 'number', description: 'Look back N days (default 7)' },
        limit: { type: 'number', description: 'Max results (default 15)' },
      },
      required: [],
    },
  },
  {
    name: 'get_ai_news',
    description: 'Get AI industry news — model releases, funding rounds, acquisitions, policy changes, benchmark results. Separate from toolbelt; this is about what happened in the AI industry, not tools you can use.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        days: { type: 'number', description: 'Look back N days (default 7)' },
        limit: { type: 'number', description: 'Max results (default 15)' },
      },
      required: [],
    },
  },
  {
    name: 'what_happened',
    description: 'Natural language query about recent tools and developments. Ask "any new MCP servers this week", "latest Claude tools", "new open source frameworks", "what APIs launched recently". Returns the most relevant tool-related developments.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        question: { type: 'string', description: 'Your question about recent AI developments' },
        days: { type: 'number', description: 'Look back N days (default 30)' },
      },
      required: ['question'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_briefing':
      return getBriefing(args.date as string | undefined);
    case 'search_developments':
      return searchDevelopments(args.query as string, (args.limit as number) ?? 10);
    case 'get_recent':
      return getRecent(args);
    case 'get_model_landscape':
      return getModelLandscape((args.days as number) ?? 30);
    case 'get_timeline':
      return getTimeline(args);
    case 'get_ai_toolbelt':
      return getToolbelt((args.days as number) ?? 7, (args.limit as number) ?? 15);
    case 'get_ai_news':
      return getAiNews((args.days as number) ?? 7, (args.limit as number) ?? 15);
    case 'what_happened':
      return whatHappened(args.question as string, (args.days as number) ?? 30);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getBriefing(date?: string): Promise<unknown> {
  const targetDate = date ?? new Date().toISOString().slice(0, 10);

  // Try digest first
  const digests = await querySupabase(
    `ai_digests?date=eq.${targetDate}&limit=1`
  ) as Array<Record<string, unknown>>;

  if (digests.length > 0) {
    const d = digests[0];
    return {
      date: d.date,
      summary: d.summary,
      top_stories: typeof d.top_stories === 'string' ? JSON.parse(d.top_stories as string) : d.top_stories,
      model_updates: typeof d.model_updates === 'string' ? JSON.parse(d.model_updates as string) : d.model_updates,
      paper_highlights: typeof d.paper_highlights === 'string' ? JSON.parse(d.paper_highlights as string) : d.paper_highlights,
    };
  }

  // No digest yet — build one from raw developments
  const since = new Date(new Date(targetDate).getTime() - 24 * 60 * 60 * 1000).toISOString();
  const devs = await querySupabase(
    `ai_developments?published_at=gte.${since}&order=published_at.desc&limit=30`
  ) as Array<Record<string, unknown>>;

  return {
    date: targetDate,
    note: 'Live query (no cached digest available)',
    total_developments: devs.length,
    developments: devs.map((d) => ({
      title: d.title,
      summary: d.summary,
      url: d.url,
      source: d.source,
      category: d.category,
      importance: d.importance,
      published_at: d.published_at,
    })),
  };
}

async function searchDevelopments(query: string, limit: number): Promise<unknown> {
  const encoded = encodeURIComponent(query);
  const devs = await querySupabase(
    `ai_developments?or=(title.ilike.*${encoded}*,summary.ilike.*${encoded}*,tags.cs.{${encoded.toLowerCase()}})&order=published_at.desc&limit=${limit}`
  ) as Array<Record<string, unknown>>;

  return {
    query,
    total: devs.length,
    results: devs.map((d) => ({
      title: d.title,
      summary: d.summary,
      url: d.url,
      source: d.source,
      category: d.category,
      importance: d.importance,
      published_at: d.published_at,
    })),
  };
}

async function getRecent(args: Record<string, unknown>): Promise<unknown> {
  const days = (args.days as number) ?? 7;
  const limit = (args.limit as number) ?? 20;
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const filters = [`published_at=gte.${since}`];
  if (args.category) filters.push(`category=eq.${args.category}`);
  if (args.source) filters.push(`source=eq.${args.source}`);
  if (args.importance) filters.push(`importance=eq.${args.importance}`);

  const devs = await querySupabase(
    `ai_developments?${filters.join('&')}&order=published_at.desc&limit=${limit}`
  ) as Array<Record<string, unknown>>;

  return {
    period: `last ${days} days`,
    total: devs.length,
    developments: devs.map((d) => ({
      title: d.title,
      summary: d.summary,
      url: d.url,
      source: d.source,
      category: d.category,
      importance: d.importance,
      published_at: d.published_at,
    })),
  };
}

async function getModelLandscape(days: number): Promise<unknown> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const devs = await querySupabase(
    `ai_developments?category=eq.model_release&published_at=gte.${since}&order=published_at.desc&limit=30`
  ) as Array<Record<string, unknown>>;

  return {
    period: `last ${days} days`,
    model_releases: devs.length,
    models: devs.map((d) => ({
      title: d.title,
      summary: d.summary,
      url: d.url,
      source: d.source,
      importance: d.importance,
      published_at: d.published_at,
      tags: d.tags,
    })),
  };
}

async function getTimeline(args: Record<string, unknown>): Promise<unknown> {
  const startDate = args.start_date as string;
  const endDate = (args.end_date as string) ?? new Date().toISOString().slice(0, 10);
  const limit = (args.limit as number) ?? 50;

  const filters = [`published_at=gte.${startDate}T00:00:00Z`, `published_at=lte.${endDate}T23:59:59Z`];
  if (args.category) filters.push(`category=eq.${args.category}`);

  const devs = await querySupabase(
    `ai_developments?${filters.join('&')}&order=published_at.asc&limit=${limit}`
  ) as Array<Record<string, unknown>>;

  return {
    start_date: startDate,
    end_date: endDate,
    total: devs.length,
    timeline: devs.map((d) => ({
      date: (d.published_at as string)?.slice(0, 10),
      title: d.title,
      summary: d.summary,
      url: d.url,
      source: d.source,
      category: d.category,
      importance: d.importance,
    })),
  };
}

async function getToolbelt(days: number, limit: number): Promise<unknown> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const toolCategories = ['mcp', 'tool', 'toolbelt', 'agent_framework', 'integration', 'infrastructure', 'open_source'];
  const catFilter = toolCategories.map((c) => `category.eq.${c}`).join(',');

  const devs = await querySupabase(
    `ai_developments?or=(${catFilter})&published_at=gte.${since}&order=published_at.desc&limit=${limit}`
  ) as Array<Record<string, unknown>>;

  return {
    feed: 'toolbelt',
    period: `last ${days} days`,
    description: 'Tools, features, and capabilities you can use right now',
    total: devs.length,
    items: devs.map((d) => ({
      title: d.title,
      summary: d.summary,
      url: d.url,
      source: d.source,
      category: d.category,
      importance: d.importance,
      published_at: d.published_at,
    })),
  };
}

async function getAiNews(days: number, limit: number): Promise<unknown> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const newsCategories = ['model_release', 'claude_update', 'funding', 'acquisition', 'policy', 'benchmark', 'news', 'paper'];
  const catFilter = newsCategories.map((c) => `category.eq.${c}`).join(',');

  const devs = await querySupabase(
    `ai_developments?or=(${catFilter})&published_at=gte.${since}&order=published_at.desc&limit=${limit}`
  ) as Array<Record<string, unknown>>;

  return {
    feed: 'ai_news',
    period: `last ${days} days`,
    description: 'AI industry developments — models, funding, policy, research',
    total: devs.length,
    items: devs.map((d) => ({
      title: d.title,
      summary: d.summary,
      url: d.url,
      source: d.source,
      category: d.category,
      importance: d.importance,
      published_at: d.published_at,
    })),
  };
}

async function whatHappened(question: string, days: number): Promise<unknown> {
  // Extract keywords from the question for search
  const keywords = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['what', 'the', 'any', 'new', 'latest', 'recent', 'happened', 'with', 'about', 'has', 'have', 'been', 'there'].includes(w));

  const since = new Date(Date.now() - days * 86400000).toISOString();

  if (keywords.length === 0) {
    // No specific keywords — return top recent items
    return getRecent({ days, limit: 15, importance: 'high' });
  }

  // Search for each keyword and merge results
  const allDevs: Array<Record<string, unknown>> = [];
  const seen = new Set<string>();

  for (const kw of keywords.slice(0, 3)) {
    const devs = await querySupabase(
      `ai_developments?or=(title.ilike.*${encodeURIComponent(kw)}*,summary.ilike.*${encodeURIComponent(kw)}*)&published_at=gte.${since}&order=published_at.desc&limit=10`
    ) as Array<Record<string, unknown>>;

    for (const d of devs) {
      const id = d.id as string;
      if (!seen.has(id)) {
        seen.add(id);
        allDevs.push(d);
      }
    }
  }

  // Sort by importance then date
  allDevs.sort((a, b) => {
    const impOrder = { breaking: 0, high: 1, normal: 2, low: 3 };
    const ai = impOrder[(a.importance as string) as keyof typeof impOrder] ?? 2;
    const bi = impOrder[(b.importance as string) as keyof typeof impOrder] ?? 2;
    if (ai !== bi) return ai - bi;
    return new Date(b.published_at as string).getTime() - new Date(a.published_at as string).getTime();
  });

  return {
    question,
    keywords_used: keywords,
    period: `last ${days} days`,
    total: allDevs.length,
    developments: allDevs.slice(0, 15).map((d) => ({
      title: d.title,
      summary: d.summary,
      url: d.url,
      source: d.source,
      category: d.category,
      importance: d.importance,
      published_at: d.published_at,
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
