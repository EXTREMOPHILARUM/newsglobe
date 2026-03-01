import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import { NewsArticle, Category } from "@/lib/types";
import { COUNTRY_BY_CODE } from "@/lib/countryFeeds";

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
  // North America
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
  // --- batch 1 boundary (first 20 = priority regions) ---
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
  { gl: "AT", ceid: "AT:de", hl: "de", lat: 47.5, lng: 14.6, name: "Austria" },
  { gl: "CH", ceid: "CH:de", hl: "de", lat: 46.8, lng: 8.2, name: "Switzerland" },
  { gl: "BE", ceid: "BE:fr", hl: "fr", lat: 50.9, lng: 4.4, name: "Belgium" },
  { gl: "NL", ceid: "NL:nl", hl: "nl", lat: 52.1, lng: 5.3, name: "Netherlands" },
  { gl: "IE", ceid: "IE:en", hl: "en", lat: 53.1, lng: -7.7, name: "Ireland" },
  { gl: "PT", ceid: "PT:pt-150", hl: "pt-PT", lat: 39.4, lng: -8.2, name: "Portugal" },
  { gl: "SE", ceid: "SE:sv", hl: "sv", lat: 60.1, lng: 18.6, name: "Sweden" },
  { gl: "NO", ceid: "NO:no", hl: "no", lat: 60.5, lng: 8.5, name: "Norway" },
  { gl: "CZ", ceid: "CZ:cs", hl: "cs", lat: 49.8, lng: 15.5, name: "Czechia" },
  { gl: "SK", ceid: "SK:sk", hl: "sk", lat: 48.7, lng: 19.7, name: "Slovakia" },
  // --- batch 2 boundary ---
  { gl: "HU", ceid: "HU:hu", hl: "hu", lat: 47.2, lng: 19.5, name: "Hungary" },
  { gl: "RO", ceid: "RO:ro", hl: "ro", lat: 45.9, lng: 24.9, name: "Romania" },
  { gl: "BG", ceid: "BG:bg", hl: "bg", lat: 42.7, lng: 25.5, name: "Bulgaria" },
  { gl: "RS", ceid: "RS:sr", hl: "sr", lat: 44.0, lng: 21.0, name: "Serbia" },
  { gl: "SI", ceid: "SI:sl", hl: "sl", lat: 46.2, lng: 15.0, name: "Slovenia" },
  { gl: "LV", ceid: "LV:lv", hl: "lv", lat: 56.9, lng: 24.6, name: "Latvia" },
  { gl: "LT", ceid: "LT:lt", hl: "lt", lat: 55.2, lng: 23.9, name: "Lithuania" },
  { gl: "GR", ceid: "GR:el", hl: "el", lat: 39.1, lng: 21.8, name: "Greece" },
  { gl: "LB", ceid: "LB:ar", hl: "ar", lat: 33.9, lng: 35.9, name: "Lebanon" },
  { gl: "MA", ceid: "MA:fr", hl: "fr", lat: 31.8, lng: -7.1, name: "Morocco" },
  { gl: "TR", ceid: "TR:tr", hl: "tr", lat: 39.0, lng: 35.2, name: "Turkey" },
  { gl: "GH", ceid: "GH:en", hl: "en", lat: 7.9, lng: -1.0, name: "Ghana" },
  { gl: "ET", ceid: "ET:en", hl: "en", lat: 9.1, lng: 40.5, name: "Ethiopia" },
  { gl: "TZ", ceid: "TZ:en", hl: "en", lat: -6.4, lng: 34.9, name: "Tanzania" },
  { gl: "UG", ceid: "UG:en", hl: "en", lat: 1.4, lng: 32.3, name: "Uganda" },
  { gl: "ZW", ceid: "ZW:en", hl: "en", lat: -19.0, lng: 29.2, name: "Zimbabwe" },
  { gl: "BW", ceid: "BW:en", hl: "en", lat: -22.3, lng: 24.7, name: "Botswana" },
  { gl: "NA", ceid: "NA:en", hl: "en", lat: -23.0, lng: 18.5, name: "Namibia" },
  { gl: "SN", ceid: "SN:fr", hl: "fr", lat: 14.5, lng: -14.5, name: "Senegal" },
  { gl: "PK", ceid: "PK:en", hl: "en", lat: 30.4, lng: 69.3, name: "Pakistan" },
  // --- batch 3 boundary ---
  { gl: "BD", ceid: "BD:bn", hl: "bn", lat: 23.7, lng: 90.4, name: "Bangladesh" },
  { gl: "MY", ceid: "MY:en", hl: "en", lat: 4.2, lng: 101.9, name: "Malaysia" },
  { gl: "VN", ceid: "VN:vi", hl: "vi", lat: 14.1, lng: 108.3, name: "Vietnam" },
  { gl: "HK", ceid: "HK:zh-Hant", hl: "zh-HK", lat: 22.3, lng: 114.2, name: "Hong Kong" },
  { gl: "NZ", ceid: "NZ:en", hl: "en", lat: -40.9, lng: 174.9, name: "New Zealand" },
  { gl: "CL", ceid: "CL:es-419", hl: "es-419", lat: -35.7, lng: -71.5, name: "Chile" },
  { gl: "PE", ceid: "PE:es-419", hl: "es-419", lat: -9.2, lng: -75.0, name: "Peru" },
  { gl: "VE", ceid: "VE:es-419", hl: "es-419", lat: 6.4, lng: -66.6, name: "Venezuela" },
  { gl: "CU", ceid: "CU:es-419", hl: "es-419", lat: 21.5, lng: -77.8, name: "Cuba" },
];

// Batch size for server-side fetching within a single API call
const BATCH_SIZE = 10;
// Number of regions per client-side batch request
const REGIONS_PER_BATCH = 20;

export function getTotalBatches(): number {
  return Math.ceil(REGION_FEEDS.length / REGIONS_PER_BATCH);
}

const CACHE_TTL_SECONDS = 300; // 5 minutes

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

      articles.push({
        id: item.guid || item.link || Math.random().toString(36),
        title: cleanTitle(title),
        snippet: snippet.slice(0, 200),
        url: item.link || "",
        source: extractSource(title),
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        category,
        lat: region.lat,
        lng: region.lng,
        regionLat: region.lat,
        regionLng: region.lng,
      });
    }
    return articles;
  } catch {
    return [];
  }
}

// Fetch from direct RSS feeds (fallback for countries without Google News)
async function fetchFallbackFeeds(
  feedUrls: string[],
  country: { lat: number; lng: number; name: string },
  maxItems: number
): Promise<NewsArticle[]> {
  const perFeed = Math.ceil(maxItems / feedUrls.length);
  const results = await Promise.all(
    feedUrls.map(async (url) => {
      try {
        const feed = await parser.parseURL(url);
        return feed.items.slice(0, perFeed).map((item) => {
          const title = item.title || "";
          const snippet = item.contentSnippet || item.content || "";
          return {
            id: item.guid || item.link || Math.random().toString(36),
            title: cleanTitle(title),
            snippet: snippet.slice(0, 200),
            url: item.link || "",
            source: extractSource(title) !== "Unknown" ? extractSource(title) : (feed.title || "Unknown"),
            publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
            category: "general" as Category,
            lat: country.lat,
            lng: country.lng,
            regionLat: country.lat,
            regionLng: country.lng,
          };
        });
      } catch {
        return [];
      }
    })
  );
  return results.flat().slice(0, maxItems);
}

// Use Workers Cache API for edge caching (free, per-datacenter)
async function cachedResponse(cacheKey: string, fetchData: () => Promise<NewsArticle[]>): Promise<Response> {
  const cacheUrl = new URL(`https://newsglobe-cache.internal/${cacheKey}`);
  const cacheReq = new Request(cacheUrl.toString());

  // @ts-expect-error - caches.default is available in Workers runtime
  const cfCache = typeof caches !== "undefined" && caches.default;
  if (cfCache) {
    const cached = await cfCache.match(cacheReq);
    if (cached) return cached;
  }

  const articles = await fetchData();
  const response = NextResponse.json(articles);
  response.headers.set("Cache-Control", `s-maxage=${CACHE_TTL_SECONDS}`);

  if (cfCache) {
    // Store in edge cache (non-blocking)
    cfCache.put(cacheReq, response.clone());
  }
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = (searchParams.get("topic") || "general") as Category;
  const query = searchParams.get("q") || "";
  const country = searchParams.get("country") || "";
  const batch = searchParams.get("batch");  // 0-indexed batch number for incremental loading

  // Country-specific feed: return trending stories for that country
  if (country) {
    const countryData = COUNTRY_BY_CODE.get(country.toUpperCase());
    if (!countryData) {
      return NextResponse.json(
        { error: `Country "${country}" not supported` },
        { status: 400 }
      );
    }

    return cachedResponse(`country:${country.toUpperCase()}`, async () => {
      if (countryData.gl && countryData.ceid && countryData.hl) {
        const region: RegionFeed = {
          gl: countryData.gl, ceid: countryData.ceid, hl: countryData.hl,
          lat: countryData.lat, lng: countryData.lng, name: countryData.name,
        };
        return fetchRegionFeed(region, "general", 20);
      } else if (countryData.fallbackFeeds && countryData.fallbackFeeds.length > 0) {
        return fetchFallbackFeeds(countryData.fallbackFeeds, countryData, 20);
      }
      return [];
    });
  }

  const batchSuffix = batch !== null ? `:b${batch}` : "";
  return cachedResponse(`${topic}:${query}${batchSuffix}`, async () => {
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
      const articles: NewsArticle[] = [];
      const seenUrls = new Set<string>();

      for (const { item, region } of allItems) {
        const url = item.link || "";
        if (seenUrls.has(url)) continue;
        seenUrls.add(url);

        const title = item.title || "";
        const snippet = item.contentSnippet || item.content || "";

        articles.push({
          id: item.guid || url || Math.random().toString(36),
          title: cleanTitle(title),
          snippet: snippet.slice(0, 200),
          url,
          source: extractSource(title),
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          category: "general" as Category,
          lat: region.lat,
          lng: region.lng,
          regionLat: region.lat,
          regionLng: region.lng,
        });
      }
      return articles;
    } else if (topic !== "general" && topic !== "world") {
      // Specific topic: use topic feed (US-centric)
      const feedUrl = TOPIC_FEEDS[topic] || TOPIC_FEEDS.general;
      const feed = await parser.parseURL(feedUrl);
      const items = feed.items.slice(0, 50);
      const articles: NewsArticle[] = [];

      for (const item of items) {
        const title = item.title || "";
        const snippet = item.contentSnippet || item.content || "";

        // Topic feeds are US-centric, use US centroid as fallback
        articles.push({
          id: item.guid || item.link || Math.random().toString(36),
          title: cleanTitle(title),
          snippet: snippet.slice(0, 200),
          url: item.link || "",
          source: extractSource(title),
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          category: topic,
          lat: 39.8,
          lng: -98.5,
          regionLat: 39.8,
          regionLng: -98.5,
        });
      }
      return articles;
    } else {
      // Global view: support incremental batch loading
      const totalBatches = getTotalBatches();
      const batchIndex = batch !== null ? parseInt(batch, 10) : null;

      // Determine which regions to fetch
      let regions: RegionFeed[];
      if (batchIndex !== null && batchIndex >= 0 && batchIndex < totalBatches) {
        const start = batchIndex * REGIONS_PER_BATCH;
        regions = REGION_FEEDS.slice(start, start + REGIONS_PER_BATCH);
      } else {
        // No batch param: fetch all (backwards compatible, used by search/topic)
        regions = REGION_FEEDS;
      }

      const perRegion = Math.ceil(100 / REGION_FEEDS.length);
      const regionResults: NewsArticle[][] = [];
      for (let i = 0; i < regions.length; i += BATCH_SIZE) {
        const chunk = regions.slice(i, i + BATCH_SIZE);
        const chunkResults = await Promise.all(
          chunk.map((region) => fetchRegionFeed(region, topic, perRegion))
        );
        regionResults.push(...chunkResults);
      }
      const articles = regionResults.flat();

      // Deduplicate by URL
      const seen = new Set<string>();
      return articles.filter((a) => {
        if (seen.has(a.url)) return false;
        seen.add(a.url);
        return true;
      });
    }
  });
}

function extractSource(title: string): string {
  const match = title.match(/ - ([^-]+)$/);
  return match ? match[1].trim() : "Unknown";
}

function cleanTitle(title: string): string {
  return title.replace(/ - [^-]+$/, "").trim();
}
