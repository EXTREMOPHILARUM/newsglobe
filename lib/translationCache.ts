import type { TranslationText } from "./translation";

export async function translateWithCache(
  language: string,
  texts: TranslationText[],
  cache: Pick<Cache, "match" | "put">,
  translate: (texts: TranslationText[]) => Promise<TranslationText[]>,
) {
  const keys = await Promise.all(texts.map(async ({ title, snippet }) => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify([language, title, snippet])));
    const hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
    return `https://newsglobe-cache.internal/translations/article-v1/${hash}`;
  }));
  const entries = new Map<string, { text: TranslationText; translated?: TranslationText }>();
  keys.forEach((key, i) => entries.set(key, { text: { title: texts[i].title, snippet: texts[i].snippet } }));
  await Promise.all([...entries].map(async ([key, entry]) => {
    const hit = await cache.match(key);
    if (hit) entry.translated = await hit.json() as TranslationText;
  }));
  const hits = keys.filter((key) => entries.get(key)!.translated).length;
  const missing = [...entries].filter(([, entry]) => !entry.translated);
  if (missing.length) {
    const translated = await translate(missing.map(([, entry]) => entry.text));
    // Finish storing before replying so the next batch can immediately reuse these articles.
    await Promise.all(missing.map(async ([key, entry], i) => {
      entry.translated = translated[i];
      await cache.put(key, Response.json(translated[i], { headers: { "cache-control": "public, max-age=86400" } }));
    }));
  }
  return { translations: keys.map((key) => entries.get(key)!.translated!), hits, generated: missing.length };
}
