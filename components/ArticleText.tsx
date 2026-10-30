"use client";

import { useArticleTranslation } from "@/lib/useTranslation";
import type { NewsArticle } from "@/lib/types";

export default function ArticleText({ article, field = "title" }: { article: NewsArticle; field?: "title" | "snippet" }) {
  const { ref, text, language, status } = useArticleTranslation(article.title, article.snippet);
  return <span ref={ref} lang={language} dir="auto" title={status} aria-busy={status === "Translating…"}>{text[field]}{status?.startsWith("Translation unavailable") && <small className="block text-gray-500 font-normal">{status}</small>}</span>;
}
