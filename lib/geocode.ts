import { LOCATIONS } from "./countries";

interface Match {
  key: string;
  lat: number;
  lng: number;
  specificity: number; // higher = more specific (city > country > region)
  position: number; // position in text (earlier = more relevant, title comes first)
}

// Classify location specificity: cities/places score higher than countries, which score higher than regions
const REGIONS = new Set([
  "middle east", "europe", "european", "africa", "african", "asia", "asian",
  "latin america", "eu", "nato",
]);

const COUNTRIES = new Set([
  "united states", "usa", "u.s.", "america", "american", "canada", "canadian",
  "mexico", "brazil", "brazilian", "argentina", "colombia", "chile", "peru",
  "venezuela", "cuba", "united kingdom", "uk", "britain", "british", "england",
  "scotland", "france", "french", "germany", "german", "italy", "italian",
  "spain", "spanish", "portugal", "netherlands", "dutch", "belgium",
  "switzerland", "swiss", "austria", "poland", "czech", "sweden", "norway",
  "denmark", "finland", "ireland", "irish", "greece", "greek", "turkey",
  "turkish", "romania", "hungary", "ukraine", "ukrainian", "russia", "russian",
  "china", "chinese", "japan", "japanese", "south korea", "korean",
  "north korea", "india", "indian", "pakistan", "bangladesh", "indonesia",
  "thailand", "vietnam", "philippines", "malaysia", "singapore", "taiwan",
  "myanmar", "cambodia", "sri lanka", "nepal", "afghanistan", "iraq", "iran",
  "iranian", "syria", "syrian", "saudi arabia", "saudi", "israel", "israeli",
  "palestine", "palestinian", "lebanon", "jordan", "yemen", "uae", "qatar",
  "kuwait", "egypt", "egyptian", "libya", "tunisia", "algeria", "morocco",
  "nigeria", "south africa", "kenya", "ethiopia", "ghana", "tanzania",
  "uganda", "sudan", "congo", "somalia", "senegal", "mozambique", "zimbabwe",
  "australia", "australian", "new zealand",
]);

// Words that commonly appear in news but aren't location references
const FALSE_POSITIVES = new Set([
  "jordan", // could be a person's name
]);

// Demonyms and vague references get lower specificity
const DEMONYMS = new Set([
  "american", "canadian", "british", "french", "german", "italian", "spanish",
  "dutch", "swiss", "irish", "greek", "turkish", "ukrainian", "russian",
  "chinese", "japanese", "korean", "indian", "iranian", "syrian", "saudi",
  "israeli", "palestinian", "egyptian", "brazilian", "australian", "european",
  "african", "asian",
]);

function getSpecificity(key: string): number {
  if (REGIONS.has(key)) return 1;
  if (DEMONYMS.has(key)) return 1.5; // demonyms are vague
  if (COUNTRIES.has(key)) return 2;
  return 3; // cities, states, and specific places
}

const locationKeys = Object.keys(LOCATIONS);

export function geocode(text: string): { lat: number; lng: number } | null {
  const lower = text.toLowerCase();
  const matches: Match[] = [];

  for (const key of locationKeys) {
    const idx = lower.indexOf(key);
    if (idx === -1) continue;

    const before = lower[idx - 1];
    const after = lower[idx + key.length];
    const wordBoundary = (ch: string | undefined) =>
      !ch || /[\s,.\-—:;!?'"()[\]{}\/]/.test(ch);

    if (!wordBoundary(before) || !wordBoundary(after)) continue;

    // Skip common false positives unless there's strong context
    if (FALSE_POSITIVES.has(key)) {
      // Only use "jordan" if it looks like the country (preceded by articles/prepositions)
      const contextBefore = lower.slice(Math.max(0, idx - 5), idx).trim();
      if (!/\b(in|of|to|from)\b/.test(contextBefore)) continue;
    }

    const loc = LOCATIONS[key];
    matches.push({
      key,
      lat: loc.lat,
      lng: loc.lng,
      specificity: getSpecificity(key),
      position: idx,
    });
  }

  if (matches.length === 0) return null;

  // Pick the most specific match (city > country > region)
  // Among same specificity, prefer the one appearing earliest in text (title first)
  matches.sort((a, b) => {
    if (b.specificity !== a.specificity) return b.specificity - a.specificity;
    return a.position - b.position;
  });

  const best = matches[0];

  // Add tiny jitter (±0.1 degrees ≈ 11km) to prevent dots stacking exactly
  return {
    lat: best.lat + (Math.random() - 0.5) * 0.2,
    lng: best.lng + (Math.random() - 0.5) * 0.2,
  };
}
