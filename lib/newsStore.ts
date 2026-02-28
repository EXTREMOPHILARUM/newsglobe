import { create } from "zustand";
import { NewsArticle, Category } from "./types";

interface NewsState {
  articles: NewsArticle[];
  filteredArticles: NewsArticle[];
  activeCategory: Category | "all";
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hoveredArticle: NewsArticle | null;
  setActiveCategory: (cat: Category | "all") => void;
  setSearchQuery: (q: string) => void;
  setHoveredArticle: (a: NewsArticle | null) => void;
  fetchNews: () => Promise<void>;
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
      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch news");
      const data: NewsArticle[] = await res.json();
      set({
        articles: data,
        filteredArticles: filterArticles(data, activeCategory, searchQuery),
        loading: false,
      });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
}));
