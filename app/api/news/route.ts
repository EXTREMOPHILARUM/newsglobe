import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import { geocode } from "@/lib/geocode";
import { NewsArticle, Category } from "@/lib/types";

const parser = new Parser();

// --- Topic feeds (US-centric, used when a specific category is selected) ---

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

// --- Country/region feeds for global coverage ---
// Each entry: { gl, ceid, hl, lat, lng } — lat/lng is the country centroid fallback

interface RegionFeed {
  gl: string;
  ceid: string;
  hl: string;
  lat: number;
  lng: number;
  name: string;
}

const REGION_FEEDS: RegionFeed[] = [
  { gl: "US", ceid: "US:en", hl: "en-US", lat: 39.8, lng: -98.5, name: "United States" },
  { gl: "GB", ceid: "GB:en", hl: "en-GB", lat: 54.0, lng: -2.0, name: "United Kingdom" },
  { gl: "IN", ceid: "IN:en", hl: "en-IN", lat: 20.6, lng: 78.9, name: "India" },
  { gl: "AU", ceid: "AU:en", hl: "en-AU", lat: -25.3, lng: 133.8, name: "Australia" },
  { gl: "CA", ceid: "CA:en", hl: "en-CA", lat: 56.1, lng: -106.3, name: "Canada" },
  { gl: "DE", ceid: "DE:en", hl: "en", lat: 51.2, lng: 10.4, name: "Germany" },
  { gl: "FR", ceid: "FR:en", hl: "en", lat: 46.2, lng: 2.2, name: "France" },
  { gl: "JP", ceid: "JP:en", hl: "en", lat: 36.2, lng: 138.3, name: "Japan" },
  { gl: "BR", ceid: "BR:pt-419", hl: "pt-BR", lat: -14.2, lng: -51.9, name: "Brazil" },
  { gl: "MX", ceid: "MX:es-419", hl: "es-MX", lat: 23.6, lng: -102.6, name: "Mexico" },
  { gl: "ZA", ceid: "ZA:en", hl: "en-ZA", lat: -30.6, lng: 22.9, name: "South Africa" },
  { gl: "NG", ceid: "NG:en", hl: "en-NG", lat: 9.1, lng: 8.7, name: "Nigeria" },
  { gl: "KE", ceid: "KE:en", hl: "en-KE", lat: -0.02, lng: 37.9, name: "Kenya" },
  { gl: "EG", ceid: "EG:en", hl: "en", lat: 26.8, lng: 30.8, name: "Egypt" },
  { gl: "IL", ceid: "IL:en", hl: "en-IL", lat: 31.0, lng: 34.9, name: "Israel" },
  { gl: "AE", ceid: "AE:en", hl: "en", lat: 23.4, lng: 53.8, name: "UAE" },
  { gl: "SA", ceid: "SA:en", hl: "en", lat: 23.9, lng: 45.1, name: "Saudi Arabia" },
  { gl: "KR", ceid: "KR:en", hl: "en", lat: 35.9, lng: 127.8, name: "South Korea" },
  { gl: "SG", ceid: "SG:en", hl: "en-SG", lat: 1.35, lng: 103.8, name: "Singapore" },
  { gl: "ID", ceid: "ID:en", hl: "en-ID", lat: -0.8, lng: 113.9, name: "Indonesia" },
  { gl: "RU", ceid: "RU:en", hl: "en", lat: 61.5, lng: 105.3, name: "Russia" },
  { gl: "IT", ceid: "IT:en", hl: "en", lat: 41.9, lng: 12.6, name: "Italy" },
  { gl: "ES", ceid: "ES:en", hl: "en", lat: 40.5, lng: -3.7, name: "Spain" },
  { gl: "PL", ceid: "PL:en", hl: "en", lat: 51.9, lng: 19.1, name: "Poland" },
  { gl: "UA", ceid: "UA:en", hl: "en", lat: 48.4, lng: 31.2, name: "Ukraine" },
  { gl: "AR", ceid: "AR:es-419", hl: "es-AR", lat: -38.4, lng: -63.6, name: "Argentina" },
  { gl: "CO", ceid: "CO:es-419", hl: "es-CO", lat: 4.6, lng: -74.3, name: "Colombia" },
  { gl: "PH", ceid: "PH:en", hl: "en-PH", lat: 12.9, lng: 121.8, name: "Philippines" },
  { gl: "TW", ceid: "TW:en", hl: "en-TW", lat: 23.7, lng: 121.0, name: "Taiwan" },
  { gl: "TH", ceid: "TH:en", hl: "en", lat: 15.9, lng: 100.5, name: "Thailand" },
];

interface CacheEntry {
  data: NewsArticle[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

// Fetch a single region feed, return articles with region fallback coords
async function fetchRegionFeed(
  region: RegionFeed,
  category: Category,
  maxItems: number
): Promise<NewsArticle[]> {
  const feedUrl = `https://news.google.com/rss?hl=${region.hl}&gl=${region.gl}&ceid=${region.ceid}`;
  try {
    const feed = await parser.parseURL(feedUrl);
    const items = feed.items.slice(0, maxItems);
    const articles: NewsArticle[] = [];

    for (const item of items) {
      const title = item.title || "";
      const snippet = item.contentSnippet || item.content || "";

      // Try text-based geocoding first for city-level precision
      const textCoords = await geocode(`${title} ${snippet}`);
      const coords = textCoords || { lat: region.lat, lng: region.lng };

      articles.push({
        id: item.guid || item.link || Math.random().toString(36),
        title: cleanTitle(title),
        snippet: snippet.slice(0, 200),
        url: item.link || "",
        source: extractSource(title),
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        category,
        lat: coords.lat,
        lng: coords.lng,
      });
    }
    return articles;
  } catch {
    return [];
  }
}

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
    let articles: NewsArticle[];

    if (query) {
      // Search mode: search across a few major regions in parallel
      const searchRegions = REGION_FEEDS.slice(0, 8);
      const results = await Promise.all(
        searchRegions.map(async (region) => {
          const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${region.hl}&gl=${region.gl}&ceid=${region.ceid}`;
          try {
            const feed = await parser.parseURL(feedUrl);
            return feed.items.slice(0, 5).map((item) => ({
              item,
              region,
            }));
          } catch {
            return [];
          }
        })
      );

      const allItems = results.flat();
      articles = [];
      const seenUrls = new Set<string>();

      for (const { item, region } of allItems) {
        const url = item.link || "";
        if (seenUrls.has(url)) continue;
        seenUrls.add(url);

        const title = item.title || "";
        const snippet = item.contentSnippet || item.content || "";
        const textCoords = await geocode(`${title} ${snippet}`);
        const coords = textCoords || { lat: region.lat, lng: region.lng };

        articles.push({
          id: item.guid || url || Math.random().toString(36),
          title: cleanTitle(title),
          snippet: snippet.slice(0, 200),
          url,
          source: extractSource(title),
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          category: topic,
          lat: coords.lat,
          lng: coords.lng,
        });
      }
    } else if (topic !== "general" && topic !== "world") {
      // Specific topic: use topic feed (US-centric)
      const feedUrl = TOPIC_FEEDS[topic] || TOPIC_FEEDS.general;
      const feed = await parser.parseURL(feedUrl);
      const items = feed.items.slice(0, 50);
      articles = [];

      for (const item of items) {
        const title = item.title || "";
        const snippet = item.contentSnippet || item.content || "";
        const coords = await geocode(`${title} ${snippet}`);
        if (!coords) continue;

        articles.push({
          id: item.guid || item.link || Math.random().toString(36),
          title: cleanTitle(title),
          snippet: snippet.slice(0, 200),
          url: item.link || "",
          source: extractSource(title),
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          category: topic,
          lat: coords.lat,
          lng: coords.lng,
        });
      }
    } else {
      // Global view: fetch from all region feeds in parallel
      // Take 3-5 articles per region to get ~100 total spread across the globe
      const perRegion = Math.ceil(100 / REGION_FEEDS.length);
      const regionResults = await Promise.all(
        REGION_FEEDS.map((region) => fetchRegionFeed(region, topic, perRegion))
      );
      articles = regionResults.flat();

      // Deduplicate by URL
      const seen = new Set<string>();
      articles = articles.filter((a) => {
        if (seen.has(a.url)) return false;
        seen.add(a.url);
        return true;
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
