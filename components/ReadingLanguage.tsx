"use client";

import { useEffect } from "react";
import { initializeLanguage, useReadingLanguage } from "@/lib/useTranslation";
import { LANGUAGES } from "@/lib/translation";

export default function ReadingLanguage() {
  const { language, setLanguage } = useReadingLanguage();
  useEffect(() => { initializeLanguage(); }, []);
  return (
    <label className="flex items-center gap-2 px-4 py-2 border-b border-white/10 text-gray-400 text-[10px] shrink-0">
      <span>Reading language</span>
      <select aria-label="Reading language" value={language} onChange={(e) => setLanguage(e.target.value)} className="min-w-0 flex-1 rounded bg-black text-white p-1 border border-white/20">
        <option value="original">Original languages</option>
        {Object.entries(LANGUAGES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>
    </label>
  );
}
