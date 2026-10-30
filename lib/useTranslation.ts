"use client";

import { create } from "zustand";
import { useEffect, useRef, useState } from "react";
import { browserLanguage, isLanguage, parseTranslation, TRANSLATION_BATCH_SIZE, type TranslationText } from "./translation";

let activeRequest: AbortController | null = null;

export const useReadingLanguage = create<{
  language: string;
  setLanguage: (language: string) => void;
}>((set) => ({
  language: "original",
  setLanguage: (language) => {
    if (language !== "original" && !isLanguage(language)) return;
    activeRequest?.abort();
    set({ language });
    try { localStorage.setItem("newsglobe-language", language); } catch { /* Storage can be disabled. */ }
  },
}));

export function initializeLanguage() {
  let saved: string | null = null;
  try { saved = localStorage.getItem("newsglobe-language"); } catch { /* Use the browser language. */ }
  useReadingLanguage.setState({ language: saved === "original" || isLanguage(saved) ? saved : browserLanguage(navigator.languages) });
}

type Result = { text: TranslationText; failed: boolean };
const requests = new Map<string, Promise<Result>>();
const queues = new Map<string, { text: TranslationText; resolve: (result: Result) => void }[]>();
let scheduled = false;
let running = false;

async function drain() {
  if (running) return;
  running = true;
  try {
    for (const [language, queue] of queues) {
      while (queue.length) {
        if (language !== useReadingLanguage.getState().language) {
          queue.splice(0).forEach((item) => item.resolve({ text: item.text, failed: true }));
          break;
        }
        const batch = queue.splice(0, TRANSLATION_BATCH_SIZE);
        try {
          activeRequest = new AbortController();
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ language, texts: batch.map((item) => item.text) }),
            signal: AbortSignal.any([activeRequest.signal, AbortSignal.timeout(45_000)]),
          });
          if (!res.ok) throw new Error("Translation unavailable");
          const translated = parseTranslation(await res.json(), batch.length);
          batch.forEach((item, i) => item.resolve({ text: translated[i], failed: false }));
        } catch {
          batch.forEach((item) => item.resolve({ text: item.text, failed: true }));
        } finally {
          activeRequest = null;
        }
      }
      queues.delete(language);
    }
  } finally {
    running = false;
  }
}

function translate(text: TranslationText, language: string) {
  const key = JSON.stringify([language, text]);
  const existing = requests.get(key);
  if (existing) return existing;
  const promise = new Promise<Result>((resolve) => {
    const queue = queues.get(language) ?? [];
    queue.push({ text, resolve });
    queues.set(language, queue);
  });
  // Bound the session cache during long browsing sessions.
  if (requests.size >= 2000) requests.delete(requests.keys().next().value!);
  requests.set(key, promise);
  promise.then((result) => { if (result.failed) requests.delete(key); });
  if (!scheduled) {
    scheduled = true;
    setTimeout(() => { scheduled = false; void drain(); }, 80);
  }
  return promise;
}

export function useArticleTranslation(title: string, snippet: string) {
  const language = useReadingLanguage((s) => s.language);
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState<{ key: string; result: Result } | null>(null);
  const text = { title: title.slice(0, 400), snippet: snippet.slice(0, 800) };
  const key = JSON.stringify([language, text]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || language === "original") return;
    let current = true;
    const [, input] = JSON.parse(key) as [string, TranslationText];
    translate(input, language).then((value) => { if (current) setResult({ key, result: value }); });
    return () => { current = false; };
  }, [key, language, visible]);

  const translated = result?.key === key ? result.result : null;
  return {
    ref,
    text: translated && !translated.failed ? translated.text : { title, snippet },
    language: translated && !translated.failed ? language : undefined,
    status: language === "original" ? undefined : translated?.failed ? "Translation unavailable — showing original" : !translated ? "Translating…" : "Machine translated",
  };
}
