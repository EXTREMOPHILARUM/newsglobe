import { create } from "zustand";
import { NewsArticle, Category } from "./types";
import { COUNTRY_BY_CODE } from "./countryFeeds";
import { geocodeFast } from "./geocode";
import { parseRawFeeds, RawFeedResponse } from "./parseFeeds";

interface SelectedCountry {
  code: string;
  name: string;
}

interface FlyToTarget {
  lat: number;
  lng: number;
  zoom: number;
}

interface NewsState {
  articles: NewsArticle[];
  filteredArticles: NewsArticle[];
  activeCategory: Category | "all";
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hoveredArticle: NewsArticle | null;
  selectedCountry: SelectedCountry | null;
  countryArticles: NewsArticle[];
  countryLoading: boolean;
  pendingFlyTo: FlyToTarget | null;
  flyToVersion: number;
  userCountry: string | null;
  setActiveCategory: (cat: Category | "all") => void;
  setSearchQuery: (q: string) => void;
  setHoveredArticle: (a: NewsArticle | null) => void;
  fetchNews: () => Promise<void>;
  flyToArticle: (a: NewsArticle) => void;
  selectCountry: (code: string, name: string) => Promise<void>;
  clearCountry: () => void;
}

/**
 * Small offset so dots at the same region coord don't stack. Seeded by the article
 * URL so a dot stays put across polls instead of jumping on every refresh.
 */
function jitter(seed: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return ((h >>> 0) / 0xffffffff - 0.5) * 2; // ±1 degree (~100km)
}

/** Apply client-side geocoding to refine article coordinates */
function geocodeArticles(articles: NewsArticle[]): NewsArticle[] {
  return articles.map((a) => {
    const coords = geocodeFast(`${a.title} ${a.snippet}`);
    if (coords) {
      return { ...a, lat: coords.lat + jitter(a.url, 1) * 0.3, lng: coords.lng + jitter(a.url, 2) * 0.3 };
    }
    // Fall back to region coords with jitter to spread dots
    return {
      ...a,
      lat: (a.regionLat ?? a.lat) + jitter(a.url, 1),
      lng: (a.regionLng ?? a.lng) + jitter(a.url, 2),
    };
  });
}

/** Global view drops articles older than this (some publisher feeds update rarely) */
const GLOBAL_MAX_AGE_MS = 7 * 24 * 3600 * 1000;
/** Parallel batch requests for the global view */
const BATCH_CONCURRENCY = 6;

/**
 * Round-robin articles across countries (in first-seen order, so the user's
 * country leads). The globe only draws the first 100 and the ticker the first 20,
 * so plain concatenation would put them all in one region.
 */
function interleaveByRegion(articles: NewsArticle[]): NewsArticle[] {
  const groups = new Map<string, NewsArticle[]>();
  for (const a of articles) {
    const key = `${a.regionLat},${a.regionLng}`;
    const group = groups.get(key);
    if (group) group.push(a);
    else groups.set(key, [a]);
  }
  const lists = [...groups.values()];
  const out: NewsArticle[] = [];
  for (let i = 0; out.length < articles.length; i++) {
    for (const list of lists) {
      if (i < list.length) out.push(list[i]);
    }
  }
  return out;
}

interface BatchResult {
  feeds: RawFeedResponse[];
  totalBatches: number | null;
}

async function fetchBatch(params: URLSearchParams, batch: number): Promise<BatchResult | null> {
  const batchParams = new URLSearchParams(params);
  batchParams.set("batch", String(batch));
  const res = await fetch(`/api/news?${batchParams.toString()}`);
  if (!res.ok) return null;
  const total = Number(res.headers.get("x-total-batches"));
  return { feeds: await res.json(), totalBatches: Number.isInteger(total) && total > 0 ? total : null };
}

/** Bumped on every fetchNews call; older in-flight fetches stop writing to the store */
let fetchGeneration = 0;
/** View (category + query) currently shown, so a poll refreshes in place */
let loadedViewKey: string | null = null;

function filterArticles(
  articles: NewsArticle[],
  category: Category | "all",
  query: string
) {
  let filtered = articles;
  if (category !== "all") {
    filtered = filtered.filter((a) => a.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.snippet.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  filteredArticles: [],
  activeCategory: "all",
  searchQuery: "",
  loading: false,
  error: null,
  hoveredArticle: null,
  selectedCountry: null,
  countryArticles: [],
  countryLoading: false,
  pendingFlyTo: null,
  flyToVersion: 0,
  userCountry: null,

  setActiveCategory: (cat) => {
    set({ activeCategory: cat });
    const { articles, searchQuery } = get();
    set({ filteredArticles: filterArticles(articles, cat, searchQuery) });
  },

  setSearchQuery: (q) => {
    set({ searchQuery: q });
    const { articles, activeCategory } = get();
    set({ filteredArticles: filterArticles(articles, activeCategory, q) });
  },

  setHoveredArticle: (a) => set({ hoveredArticle: a }),

  flyToArticle: (a) => set({
    hoveredArticle: a,
    pendingFlyTo: { lat: a.lat, lng: a.lng, zoom: 6 },
    flyToVersion: get().flyToVersion + 1,
  }),

  fetchNews: async () => {
    const { activeCategory, searchQuery } = get();
    const generation = ++fetchGeneration;
    const requestedViewKey = searchQuery ? `q:${searchQuery}` : activeCategory === "all" ? "global" : `topic:${activeCategory}`;
    // Polls refresh the current view in place; only a view change shows the loading state
    if (requestedViewKey !== loadedViewKey || get().articles.length === 0) {
      set({ loading: true, error: null });
    }
    try {
      // Fetch user's geo location once
      let { userCountry } = get();
      if (userCountry === null) {
        try {
          const geoRes = await fetch("/api/geo");
          if (geoRes.ok) {
            const geo = await geoRes.json();
            userCountry = geo.country || "US";
          } else {
            userCountry = "US";
          }
        } catch {
          userCountry = "US";
        }
        set({ userCountry });
      }

      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("topic", activeCategory);
      if (searchQuery) params.set("q", searchQuery);
      if (userCountry) params.set("loc", userCountry);

      // For search/topic queries, fetch all at once (no batching)
      if (searchQuery || activeCategory !== "all") {
        // When searching, don't pass topic — search results aren't categorised
        if (searchQuery) params.delete("topic");
        const res = await fetch(`/api/news?${params.toString()}`);
        if (generation !== fetchGeneration) return;
        if (!res.ok) throw new Error("Failed to fetch news");
        const rawFeeds: RawFeedResponse[] = await res.json();
        if (generation !== fetchGeneration) return;
        const parsed = parseRawFeeds(rawFeeds, activeCategory);
        const data = geocodeArticles(parsed);
        // Don't filter by category during search — results don't have meaningful categories
        const filtered = searchQuery
          ? filterArticles(data, "all", searchQuery)
          : filterArticles(data, activeCategory, searchQuery);

        let pendingFlyTo: FlyToTarget | null = null;
        if (searchQuery && filtered.length > 0 && requestedViewKey !== loadedViewKey) {
          const avgLat = filtered.reduce((s, a) => s + a.lat, 0) / filtered.length;
          const avgLng = filtered.reduce((s, a) => s + a.lng, 0) / filtered.length;
          pendingFlyTo = { lat: avgLat, lng: avgLng, zoom: 4 };
        }

        loadedViewKey = requestedViewKey;
        set({
          articles: data,
          filteredArticles: filtered,
          loading: false,
          pendingFlyTo,
          flyToVersion: pendingFlyTo ? get().flyToVersion + 1 : get().flyToVersion,
        });
        return;
      }

      // Global view: batch 0 first (user's region, gives the total), then the rest in parallel
      const viewKey = requestedViewKey;
      const isRefresh = loadedViewKey === viewKey && get().articles.length > 0;
      const isCurrent = () => {
        const s = get();
        return generation === fetchGeneration && s.activeCategory === "all" && !s.searchQuery;
      };

      // Parsed + geocoded once per batch; publish() only merges
      const batches: NewsArticle[][] = [];
      const cutoff = Date.now() - GLOBAL_MAX_AGE_MS;
      const addBatch = (b: number, feeds: RawFeedResponse[]) => {
        batches[b] = geocodeArticles(parseRawFeeds(feeds)).filter(
          (a) => Date.parse(a.publishedAt) >= cutoff
        );
      };
      const publish = () => {
        const seen = new Set<string>();
        const merged = interleaveByRegion(
          batches.flat().filter((a) => {
            if (seen.has(a.url)) return false;
            seen.add(a.url);
            return true;
          })
        );
        loadedViewKey = viewKey;
        set({ articles: merged, filteredArticles: merged, loading: false, error: null });
      };

      // Batch 0 also tells us how many batches exist, so give it one retry
      const first =
        (await fetchBatch(params, 0).catch(() => null)) ??
        (await fetchBatch(params, 0).catch(() => null));
      if (!isCurrent()) return;
      if (first) addBatch(0, first.feeds);
      // Initial load: show the user's region right away. A refresh swaps once at the end
      // so the globe doesn't shrink to one batch while the rest reload.
      if (!isRefresh && batches[0]?.length) publish();

      const total = first?.totalBatches ?? 1;
      let next = 1;
      let failed = first ? 0 : 1;
      await Promise.all(
        Array.from({ length: Math.min(BATCH_CONCURRENCY, total - 1) }, async () => {
          while (next < total) {
            const b = next++;
            const result = await fetchBatch(params, b).catch(() => null);
            if (!isCurrent()) return;
            if (!result) {
              failed++;
              continue;
            }
            addBatch(b, result.feeds);
            if (!isRefresh && batches[b].length > 0) publish();
          }
        })
      );
      if (!isCurrent()) return;

      if (batches.some((list) => list && list.length > 0)) {
        publish();
      } else if (failed > 0 && !isRefresh) {
        set({ error: "Failed to fetch news", loading: false });
      } else {
        set({ loading: false });
      }
    } catch (e) {
      if (generation === fetchGeneration) {
        set({ error: (e as Error).message, loading: false });
      }
    }
  },

  selectCountry: async (code, name) => {
    const coords = COUNTRY_BY_CODE.get(code.toUpperCase());
    set({
      selectedCountry: { code, name },
      countryLoading: true,
      countryArticles: [],
      pendingFlyTo: coords ? { lat: coords.lat, lng: coords.lng, zoom: 4 } : null,
      flyToVersion: coords ? get().flyToVersion + 1 : get().flyToVersion,
    });
    try {
      const res = await fetch(`/api/news?country=${encodeURIComponent(code)}`);
      if (!res.ok) throw new Error("Failed to fetch country news");
      const rawFeeds: RawFeedResponse[] = await res.json();
      // A later click (or Back) superseded this request
      if (get().selectedCountry?.code !== code) return;
      const parsed = parseRawFeeds(rawFeeds);
      const data = geocodeArticles(parsed);
      set({ countryArticles: data, countryLoading: false });
    } catch {
      if (get().selectedCountry?.code === code) set({ countryLoading: false });
    }
  },

  clearCountry: () => {
    set({
      selectedCountry: null,
      countryArticles: [],
      pendingFlyTo: { lat: 30, lng: 20, zoom: 1.8 },
      flyToVersion: get().flyToVersion + 1,
    });
  },
}));
