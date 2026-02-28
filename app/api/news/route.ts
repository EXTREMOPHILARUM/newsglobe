import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import { geocode } from "@/lib/geocode";
import { NewsArticle, Category } from "@/lib/types";

const parser = new Parser();

const TOPIC_FEEDS: Record<string, string> = {
  general: "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
  world: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
  business: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
  technology: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
  science: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
  sports: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
  entertainment: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
  health: "https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US:en",
};

interface CacheEntry {
  data: NewsArticle[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = (searchParams.get("topic") || "general") as Category;
  const query = searchParams.get("q") || "";

  const cacheKey = `${topic}:${query}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const feedUrl = query
      ? `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`
      : TOPIC_FEEDS[topic] || TOPIC_FEEDS.general;

    const feed = await parser.parseURL(feedUrl);

    const articles: NewsArticle[] = [];
    for (const item of feed.items.slice(0, 50)) {
      const title = item.title || "";
      const snippet = item.contentSnippet || item.content || "";
      const source = extractSource(title);
      const coords = geocode(`${title} ${snippet}`);
      if (!coords) continue;

      articles.push({
        id: item.guid || item.link || Math.random().toString(36),
        title: cleanTitle(title),
        snippet: snippet.slice(0, 200),
        url: item.link || "",
        source,
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        category: topic,
        lat: coords.lat,
        lng: coords.lng,
      });
    }

    cache.set(cacheKey, { data: articles, timestamp: Date.now() });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

function extractSource(title: string): string {
  const match = title.match(/ - ([^-]+)$/);
  return match ? match[1].trim() : "Unknown";
}

function cleanTitle(title: string): string {
  return title.replace(/ - [^-]+$/, "").trim();
}
