"use client";

import { useNewsStore } from "@/lib/newsStore";
import { CATEGORY_COLORS } from "@/lib/types";

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Sidebar() {
  const {
    filteredArticles,
    loading,
    setHoveredArticle,
    selectedCountry,
    countryArticles,
    countryLoading,
    clearCountry,
  } = useNewsStore();

  const isCountryView = !!selectedCountry;
  const items = isCountryView
    ? countryArticles.slice(0, 20)
    : filteredArticles.slice(0, 15);
  const isLoading = isCountryView ? countryLoading : loading;

  return (
    <div className="fixed right-4 top-12 bottom-20 w-80 z-40 flex flex-col bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden max-md:hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        {isCountryView ? (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={clearCountry}
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                ← Back
              </button>
              <span className="text-white text-xs font-semibold uppercase tracking-wider">
                {selectedCountry.name}
              </span>
            </div>
            <span className="text-gray-500 text-[10px]">
              {countryArticles.length} stories
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-semibold uppercase tracking-wider">
                Live Feed
              </span>
            </div>
            <span className="text-gray-500 text-[10px]">
              {filteredArticles.length} stories
            </span>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isLoading && items.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {items.map((article) => {
          const color = CATEGORY_COLORS[article.category];
          return (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredArticle(article)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-1 h-full min-h-[40px] rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium leading-tight line-clamp-2">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-gray-500 text-[10px]">
                      {article.source}
                    </span>
                    <span className="text-gray-600 text-[10px]">·</span>
                    <span className="text-gray-500 text-[10px]">
                      {timeAgo(article.publishedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
