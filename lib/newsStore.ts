import { create } from "zustand";
import { NewsArticle, Category } from "./types";
import { COUNTRY_BY_CODE } from "./countryFeeds";

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
  setActiveCategory: (cat: Category | "all") => void;
  setSearchQuery: (q: string) => void;
  setHoveredArticle: (a: NewsArticle | null) => void;
  fetchNews: () => Promise<void>;
  selectCountry: (code: string, name: string) => Promise<void>;
  clearCountry: () => void;
}

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

  fetchNews: async () => {
    const { activeCategory, searchQuery } = get();
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("topic", activeCategory);
      if (searchQuery) params.set("q", searchQuery);

      // For search/topic queries, fetch all at once (no batching)
      if (searchQuery || (activeCategory !== "all" && activeCategory !== "world")) {
        const res = await fetch(`/api/news?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const data: NewsArticle[] = await res.json();
        const filtered = filterArticles(data, activeCategory, searchQuery);

        let pendingFlyTo: FlyToTarget | null = null;
        if (searchQuery && filtered.length > 0) {
          const avgLat = filtered.reduce((s, a) => s + a.lat, 0) / filtered.length;
          const avgLng = filtered.reduce((s, a) => s + a.lng, 0) / filtered.length;
          pendingFlyTo = { lat: avgLat, lng: avgLng, zoom: 4 };
        }

        set({
          articles: data,
          filteredArticles: filtered,
          loading: false,
          pendingFlyTo,
          flyToVersion: pendingFlyTo ? get().flyToVersion + 1 : get().flyToVersion,
        });
        return;
      }

      // Global view: fetch incrementally in batches
      const totalBatches = 4; // ceil(69 regions / 20 per batch)

      for (let b = 0; b < totalBatches; b++) {
        // Abort if user started a search or selected a country mid-fetch
        const currentState = get();
        if (currentState.searchQuery || currentState.selectedCountry) break;

        const batchParams = new URLSearchParams(params);
        batchParams.set("batch", String(b));
        const res = await fetch(`/api/news?${batchParams.toString()}`);
        if (!res.ok) continue;
        const batchData: NewsArticle[] = await res.json();

        const { articles: existing, activeCategory: cat, searchQuery: q } = get();
        // First batch replaces, subsequent batches merge
        const base = b === 0 ? [] : existing;
        const baseUrls = new Set(base.map((a) => a.url));
        const newArticles = batchData.filter((a) => !baseUrls.has(a.url));
        const merged = [...base, ...newArticles];
        const filtered = filterArticles(merged, cat, q);

        set({
          articles: merged,
          filteredArticles: filtered,
          loading: false,
        });
      }

      set({ loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
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
      const data: NewsArticle[] = await res.json();
      set({ countryArticles: data, countryLoading: false });
    } catch {
      set({ countryLoading: false });
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
