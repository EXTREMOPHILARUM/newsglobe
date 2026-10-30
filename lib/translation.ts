export const LANGUAGES: Record<string, string> = {
  en: "English", hi: "हिन्दी", mr: "मराठी", bn: "বাংলা", ta: "தமிழ்",
  te: "తెలుగు", gu: "ગુજરાતી", kn: "ಕನ್ನಡ", ml: "മലയാളം", pa: "ਪੰਜਾਬੀ",
  ur: "اردو", ar: "العربية", fa: "فارسی", he: "עברית", fr: "Français",
  de: "Deutsch", es: "Español", pt: "Português", it: "Italiano", nl: "Nederlands",
  ru: "Русский", uk: "Українська", pl: "Polski", cs: "Čeština", ro: "Română",
  el: "Ελληνικά", tr: "Türkçe", sv: "Svenska", da: "Dansk", no: "Norsk",
  fi: "Suomi", hu: "Magyar", id: "Bahasa Indonesia", ms: "Bahasa Melayu",
  vi: "Tiếng Việt", th: "ไทย", zh: "中文（简体）", "zh-TW": "中文（繁體）",
  ja: "日本語", ko: "한국어", tl: "Filipino", sw: "Kiswahili", af: "Afrikaans",
};

export function isLanguage(value: unknown): value is string {
  return typeof value === "string" && Object.hasOwn(LANGUAGES, value);
}

export function browserLanguage(locales: readonly string[]): string {
  for (const locale of locales) {
    const code = locale.toLowerCase();
    if (/^zh-(tw|hk|hant)(-|$)/.test(code)) return "zh-TW";
    const base = code.split("-")[0];
    if (isLanguage(base)) return base;
  }
  return "en";
}

export function translatedArticleUrl(url: string, language: string): string {
  if (!isLanguage(language)) return url;
  return `https://translate.google.com/translate?${new URLSearchParams({ sl: "auto", tl: language, u: url })}`;
}

export interface TranslationText { title: string; snippet: string }
export const TRANSLATION_BATCH_SIZE = 6;

export function validTexts(value: unknown): value is TranslationText[] {
  return Array.isArray(value) && value.length > 0 && value.length <= TRANSLATION_BATCH_SIZE &&
    value.every((item) => item && typeof item.title === "string" && item.title.trim().length > 0 &&
      item.title.length <= 400 && typeof item.snippet === "string" && item.snippet.length <= 800);
}

export function parseTranslation(value: unknown, count: number): TranslationText[] {
  if (!value || typeof value !== "object" || !("translations" in value)) throw new Error("Invalid translation");
  const items = value.translations;
  if (!Array.isArray(items) || items.length !== count || !items.every((item) =>
    item && typeof item.title === "string" && item.title.trim().length > 0 && item.title.length <= 1600 &&
    typeof item.snippet === "string" && item.snippet.length <= 3200
  )) throw new Error("Invalid translation");
  return items.map(({ title, snippet }) => ({ title, snippet }));
}
