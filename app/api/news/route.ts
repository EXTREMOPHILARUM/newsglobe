import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { COUNTRY_BY_CODE, COUNTRIES, CountryData, FeedEntry } from "@/lib/countryFeeds";
import { Category } from "@/lib/types";

// Google News RSS is deliberately not used: it throttles Cloudflare Workers egress
// (requests hang or 503), which left most of the globe empty. Everything here is
// direct publisher RSS, plus Bing News RSS for search.

// Workers Free allows 50 subrequests per invocation (redirects and Cache API calls
// included), so every request below stays well under that.
const FETCH_TIMEOUT_MS = 3000; // p90 feed latency from the edge is ~1.5s
const MAX_ITEMS_PER_FEED = 20;

// Global view: countries are split into batches the client fetches in parallel
const COUNTRIES_PER_BATCH = 12;
const FEEDS_PER_COUNTRY_GLOBAL = 1;
// Country view: sample of that country's feeds
const FEEDS_PER_COUNTRY_VIEW = 20;

// Stale-while-revalidate on the Workers Cache API
const CACHE_VERSION = "v2";
const FRESH_SECONDS = 600; // serve without refreshing
const STALE_SECONDS = 6 * 3600; // serve stale while refreshing in the background
const BROWSER_MAX_AGE_SECONDS = 120;

interface FeedMeta {
  lat: number;
  lng: number;
  name: string;
  feedName?: string; // For publisher feeds: publication name
  category?: string;
}

// --- Topic feeds (publisher RSS, used when a specific category is selected) ---
const LONDON = { lat: 51.5, lng: -0.13, name: "United Kingdom" };
const NEW_YORK = { lat: 40.7, lng: -74.0, name: "United States" };
const SAN_FRANCISCO = { lat: 37.77, lng: -122.42, name: "United States" };
const LOS_ANGELES = { lat: 34.05, lng: -118.24, name: "United States" };
const BOSTON = { lat: 42.36, lng: -71.06, name: "United States" };
const GENEVA = { lat: 46.2, lng: 6.14, name: "Switzerland" };

type TopicCategory = Exclude<Category, "general">;

const TOPIC_FEEDS: Record<TopicCategory, (FeedMeta & { url: string })[]> = {
  technology: [
    { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", feedName: "BBC News", ...LONDON },
    { url: "https://www.theverge.com/rss/index.xml", feedName: "The Verge", ...NEW_YORK },
    { url: "https://techcrunch.com/feed/", feedName: "TechCrunch", ...SAN_FRANCISCO },
    { url: "https://feeds.arstechnica.com/arstechnica/index", feedName: "Ars Technica", ...NEW_YORK },
  ],
  business: [
    { url: "https://feeds.bbci.co.uk/news/business/rss.xml", feedName: "BBC News", ...LONDON },
    { url: "https://www.cnbc.com/id/10001147/device/rss/rss.html", feedName: "CNBC", ...NEW_YORK },
    { url: "https://feeds.marketwatch.com/marketwatch/topstories/", feedName: "MarketWatch", ...NEW_YORK },
  ],
  science: [
    { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", feedName: "BBC News", ...LONDON },
    { url: "https://www.sciencedaily.com/rss/all.xml", feedName: "ScienceDaily", ...NEW_YORK },
    { url: "https://www.newscientist.com/feed/home/", feedName: "New Scientist", ...LONDON },
    { url: "https://phys.org/rss-feed/", feedName: "Phys.org", ...LONDON },
  ],
  sports: [
    { url: "https://feeds.bbci.co.uk/sport/rss.xml", feedName: "BBC Sport", ...LONDON },
    { url: "https://www.espn.com/espn/rss/news", feedName: "ESPN", ...NEW_YORK },
    { url: "https://www.skysports.com/rss/12040", feedName: "Sky Sports", ...LONDON },
  ],
  entertainment: [
    { url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", feedName: "BBC News", ...LONDON },
    { url: "https://variety.com/feed/", feedName: "Variety", ...LOS_ANGELES },
    { url: "https://www.hollywoodreporter.com/feed/", feedName: "The Hollywood Reporter", ...LOS_ANGELES },
  ],
  health: [
    { url: "https://feeds.bbci.co.uk/news/health/rss.xml", feedName: "BBC News", ...LONDON },
    { url: "https://www.statnews.com/feed/", feedName: "STAT", ...BOSTON },
    { url: "https://www.who.int/rss-feeds/news-english.xml", feedName: "WHO", ...GENEVA },
  ],
};

function isTopicCategory(topic: string): topic is TopicCategory {
  return Object.prototype.hasOwnProperty.call(TOPIC_FEEDS, topic);
}

// --- Search markets (Bing News RSS) ---
const SEARCH_MARKETS = [
  { mkt: "en-US", code: "US" },
  { mkt: "en-GB", code: "GB" },
  { mkt: "en-IN", code: "IN" },
  { mkt: "en-AU", code: "AU" },
  { mkt: "en-CA", code: "CA" },
  { mkt: "en-ZA", code: "ZA" },
];

// --- Global view ---
const GLOBAL_COUNTRIES = COUNTRIES.filter((c) => c.fallbackFeeds && c.fallbackFeeds.length > 0);
const TOTAL_BATCHES = Math.ceil(GLOBAL_COUNTRIES.length / COUNTRIES_PER_BATCH);

/**
 * Swap the user's country into slot 0 so batch 0 covers their region. Swapping (not
 * shifting) leaves every other batch identical to the default order, so those stay
 * shared in the cache across all users.
 */
function batchCountriesFor(loc: string, batchIndex: number): { countries: CountryData[]; orderKey: string } {
  const idx = GLOBAL_COUNTRIES.findIndex((c) => c.code === loc);
  const userBatch = Math.floor(idx / COUNTRIES_PER_BATCH);
  let order = GLOBAL_COUNTRIES;
  if (idx > 0) {
    order = [...GLOBAL_COUNTRIES];
    [order[0], order[idx]] = [order[idx], order[0]];
  }
  const start = batchIndex * COUNTRIES_PER_BATCH;
  const affected = idx > 0 && (batchIndex === 0 || batchIndex === userBatch);
  return {
    countries: order.slice(start, start + COUNTRIES_PER_BATCH),
    orderKey: affected ? loc : "default",
  };
}

function normalizeFeedEntries(feeds: (string | FeedEntry)[]): FeedEntry[] {
  return feeds.map((f) => (typeof f === "string" ? { url: f } : f));
}

/** Random sample of up to n entries (Fisher-Yates on a copy) */
function sample<T>(items: T[], n: number): T[] {
  if (items.length <= n) return items;
  const copy = [...items];
  for (let i = copy.length - 1; i > copy.length - 1 - n; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(copy.length - n);
}

// --- Raw feed response type ---
// The worker returns raw XML strings + metadata, frontend does all parsing
// (keeps worker CPU time low).
interface RawFeedResponse {
  xml: string;
  meta: FeedMeta;
}

const ROOT_CLOSERS: [RegExp, string, string][] = [
  [/<rss[\s>]/, "</item>", "</channel></rss>"],
  [/<feed[\s>]/, "</entry>", "</feed>"],
  [/<rdf:RDF[\s>]/, "</item>", "</rdf:RDF>"],
];

const CONTENT_ENCODED_RE = /<content:encoded>[\s\S]*?<\/content:encoded>/g;

/**
 * Shrink the payload: drop full-article HTML when the feed also has descriptions
 * (the client only reads content:encoded as a snippet fallback), then cut after N items.
 */
function slimFeedXml(xml: string, maxItems: number): string {
  const slim = xml.includes("<description") ? xml.replace(CONTENT_ENCODED_RE, "") : xml;
  return trimFeedXml(slim, maxItems);
}

/** Cut a feed after its Nth item; unknown formats pass through */
function trimFeedXml(xml: string, maxItems: number): string {
  for (const [rootRe, itemClose, rootClose] of ROOT_CLOSERS) {
    if (!rootRe.test(xml)) continue;
    let pos = 0;
    for (let n = 0; n < maxItems; n++) {
      const idx = xml.indexOf(itemClose, pos);
      if (idx === -1) return xml;
      pos = idx + itemClose.length;
    }
    return xml.indexOf(itemClose, pos) === -1 ? xml : xml.slice(0, pos) + rootClose;
  }
  return xml;
}

/** Fetch a single RSS URL, return raw XML + metadata */
async function fetchRawFeed(url: string, meta: FeedMeta): Promise<RawFeedResponse | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "user-agent": "Mozilla/5.0 (compatible; NewsGlobe/1.0; +https://newsglobe.saurabhn.com)" },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    return { xml: slimFeedXml(xml, MAX_ITEMS_PER_FEED), meta };
  } catch {
    // Timeouts and network errors: drop this feed, the rest of the batch still renders
    return null;
  }
}

// Workers queue fetches beyond 6 open connections per invocation. A queued fetch's
// timeout would already be running, so start each fetch only when a slot frees up.
const MAX_CONCURRENT_FETCHES = 6;

async function fetchAll(jobs: { url: string; meta: FeedMeta }[]): Promise<FetchResult> {
  const results: (RawFeedResponse | null)[] = new Array(jobs.length).fill(null);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(MAX_CONCURRENT_FETCHES, jobs.length) }, async () => {
      while (next < jobs.length) {
        const i = next++;
        results[i] = await fetchRawFeed(jobs[i].url, jobs[i].meta);
      }
    })
  );
  return {
    feeds: results.filter((r): r is RawFeedResponse => r !== null),
    attempted: jobs.length,
  };
}

// --- Cache (stale-while-revalidate on caches.default) ---
interface FetchResult {
  feeds: RawFeedResponse[];
  attempted: number;
}

function getEdgeCache(): Cache | null {
  if (typeof caches === "undefined") return null;
  return (caches as unknown as { default?: Cache }).default ?? null;
}

/** Keep background work alive after the response is sent (no-op outside Workers) */
function waitUntil(promise: Promise<unknown>): void {
  try {
    getCloudflareContext().ctx.waitUntil(promise);
  } catch {
    // `next dev` has no Cloudflare context; the promise still runs, just unguarded
  }
}

function clientResponse(body: BodyInit | null, extraHeaders: Record<string, string>): Response {
  return new Response(body, {
    headers: {
      "content-type": "application/json",
      "cache-control": `public, max-age=${BROWSER_MAX_AGE_SECONDS}`,
      ...extraHeaders,
    },
  });
}

async function storeInCache(cache: Cache, key: Request, body: string, result: FetchResult, extraHeaders: Record<string, string>) {
  // A mostly-failed fetch is stored as already stale so the next request retries it
  const healthy = result.feeds.length * 2 >= result.attempted;
  const fetchedAt = Date.now() - (healthy ? 0 : FRESH_SECONDS * 1000);
  await cache.put(
    key,
    new Response(body, {
      headers: {
        "content-type": "application/json",
        "cache-control": `public, max-age=${STALE_SECONDS}`,
        "x-fetched-at": String(fetchedAt),
        ...extraHeaders,
      },
    })
  );
}

/** Cache keys with a background refresh in flight in this isolate (avoids a refresh per request) */
const refreshing = new Set<string>();

async function cachedRawResponse(
  cacheKey: string,
  fetchData: () => Promise<FetchResult>,
  extraHeaders: Record<string, string> = {}
): Promise<Response> {
  const cache = getEdgeCache();
  const key = new Request(`https://newsglobe-cache.internal/${CACHE_VERSION}/${encodeURIComponent(cacheKey)}`);

  const refresh = async (): Promise<string> => {
    const result = await fetchData();
    const body = JSON.stringify(result.feeds);
    // Never cache an empty result: likely a transient upstream failure
    if (cache && result.feeds.length > 0) {
      waitUntil(storeInCache(cache, key, body, result, extraHeaders));
    }
    return body;
  };

  if (cache) {
    const hit = await cache.match(key);
    if (hit) {
      const ageMs = Date.now() - Number(hit.headers.get("x-fetched-at") || 0);
      if (ageMs > FRESH_SECONDS * 1000 && !refreshing.has(cacheKey)) {
        refreshing.add(cacheKey);
        waitUntil(refresh().finally(() => refreshing.delete(cacheKey)));
      }
      return clientResponse(hit.body, extraHeaders);
    }
  }

  return clientResponse(await refresh(), extraHeaders);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") || "general";
  const query = (searchParams.get("q") || "").trim();
  const country = (searchParams.get("country") || "").toUpperCase();
  const loc = (searchParams.get("loc") || "").toUpperCase();

  // Country-specific feed
  if (country) {
    const countryData = COUNTRY_BY_CODE.get(country);
    if (!countryData || !countryData.fallbackFeeds?.length) {
      return Response.json({ error: `Country "${country}" not supported` }, { status: 400 });
    }
    return cachedRawResponse(`country:${country}`, () => {
      const meta = { lat: countryData.lat, lng: countryData.lng, name: countryData.name };
      const entries = sample(normalizeFeedEntries(countryData.fallbackFeeds!), FEEDS_PER_COUNTRY_VIEW);
      return fetchAll(entries.map((e) => ({ url: e.url, meta: { ...meta, feedName: e.name } })));
    });
  }

  // Search (Bing News RSS, newest first, across a few markets)
  if (query) {
    const markets = [...SEARCH_MARKETS].sort((a, b) => Number(b.code === loc) - Number(a.code === loc));
    return cachedRawResponse(`search:${query.toLowerCase()}:${markets[0].code}`, () =>
      fetchAll(
        markets.map((m) => {
          const c = COUNTRY_BY_CODE.get(m.code)!;
          const url =
            `https://www.bing.com/news/search?format=rss&q=${encodeURIComponent(query)}` +
            `&qft=${encodeURIComponent('sortbydate="1"')}&mkt=${m.mkt}`;
          return { url, meta: { lat: c.lat, lng: c.lng, name: c.name, category: "general" } };
        })
      )
    );
  }

  // Topic feeds
  if (topic !== "general") {
    if (!isTopicCategory(topic)) {
      return Response.json({ error: `Topic "${topic}" not supported` }, { status: 400 });
    }
    return cachedRawResponse(`topic:${topic}`, () =>
      fetchAll(TOPIC_FEEDS[topic].map(({ url, ...meta }) => ({ url, meta: { ...meta, category: topic } })))
    );
  }

  // Global batched view
  const batchIndex = Number.parseInt(searchParams.get("batch") || "0", 10);
  const totalHeader = { "x-total-batches": String(TOTAL_BATCHES) };
  if (!Number.isInteger(batchIndex) || batchIndex < 0 || batchIndex >= TOTAL_BATCHES) {
    return clientResponse("[]", totalHeader);
  }
  const { countries: batchCountries, orderKey } = batchCountriesFor(loc, batchIndex);

  return cachedRawResponse(
    `global:${orderKey}:b${batchIndex}`,
    () =>
      fetchAll(
        batchCountries.flatMap((c) =>
          sample(normalizeFeedEntries(c.fallbackFeeds!), FEEDS_PER_COUNTRY_GLOBAL).map((e) => ({
            url: e.url,
            meta: { lat: c.lat, lng: c.lng, name: c.name, feedName: e.name },
          }))
        )
      ),
    totalHeader
  );
}
