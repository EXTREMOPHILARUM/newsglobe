"use client";

import { useReadingLanguage } from "@/lib/useTranslation";
import { LANGUAGES, translatedArticleUrl } from "@/lib/translation";

export default function ArticleLinks({ url }: { url: string }) {
  const language = useReadingLanguage((s) => s.language);
  return (
    <span className="flex flex-wrap gap-2 ml-auto text-[10px]" onClick={(e) => e.stopPropagation()}>
      {language !== "original" && <a href={translatedArticleUrl(url, language)} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Read in {LANGUAGES[language]} ↗</a>}
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Original ↗</a>
    </span>
  );
}
