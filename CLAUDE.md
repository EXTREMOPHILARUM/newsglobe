# NewsGlobe

Interactive 3D news globe that visualizes trending stories from 150 countries in real-time.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **3D/Map**: MapLibre GL, React Map GL (globe projection), Three.js + React Three Fiber
- **State**: Zustand (`lib/newsStore.ts`)
- **Styling**: Tailwind CSS 4, Framer Motion
- **Data**: Google News RSS + fallback RSS feeds via `rss-parser`, geocoding via Nominatim

## Project Structure

```
newsglobe/               ← repo root = Next.js app root
├── app/
│   ├── api/news/route.ts    ← news API: global feed, topic feeds, country feeds, search
│   ├── page.tsx             ← main page, polls API every 60s
│   └── layout.tsx
├── components/
│   ├── GlobeScene.tsx       ← MapLibre globe with news dots, country click handler, auto-rotation
│   ├── Sidebar.tsx          ← article list, country trending view with back button
│   ├── SearchBar.tsx        ← search input, triggers fetchNews + flyTo
│   ├── Toolbar.tsx          ← category filter buttons
│   ├── NewsTicker.tsx       ← scrolling headline ticker
│   ├── DayNightOverlay.tsx  ← day/night terminator on globe
│   └── Watermark.tsx
├── lib/
│   ├── countryFeeds.ts      ← 150 countries: Google News params OR fallback RSS URLs
│   ├── newsStore.ts         ← Zustand store: articles, country selection, flyTo, search
│   ├── types.ts             ← NewsArticle, Category, CATEGORY_COLORS
│   ├── countries.ts         ← geocoding location lookup table (cities, countries, regions)
│   └── geocode.ts           ← text-based geocoding using Nominatim + location table
└── public/
    ├── land-110m.json       ← TopoJSON for globe landmass
    └── countries-110m.json
```

## Key Patterns

### Country Feed System (`lib/countryFeeds.ts`)
- Single source of truth for all 150 supported countries
- Countries with Google News editions have `gl`, `ceid`, `hl` fields
- Countries without Google News have `fallbackFeeds` (direct RSS URLs from news outlets)
- Upstream source for fallback feeds: `github.com/yavuz/news-feed-list-of-countries`
- Use `/update-country-feeds` to sync from upstream

### News API (`app/api/news/route.ts`)
- `GET /api/news` — global feed (fetches from all Google News regions in parallel)
- `GET /api/news?topic=technology` — topic-specific feed
- `GET /api/news?q=search` — search across regions
- `GET /api/news?country=MM` — country-specific feed (Google News or fallback RSS)
- 5-minute in-memory cache per query

### Globe Interaction (`components/GlobeScene.tsx`)
- Clicking the map finds nearest country centroid via haversine distance (2000km max)
- News dot clicks take priority over country clicks (via `dotClickedRef`)
- `pendingFlyTo` + `flyToVersion` pattern in store triggers map animations
- Auto-rotation pauses during user interaction and flyTo animations

### State (`lib/newsStore.ts`)
- `selectCountry(code, name)` — fetches country feed, triggers flyTo
- `clearCountry()` — returns to global view, zooms out
- `fetchNews()` — on search, flies to centroid of results

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npx tsc --noEmit` — type check

## Custom Slash Commands

- `/update-country-feeds` — sync fallback RSS feeds from upstream GitHub repo
- `/add-country <name>` — add a new country with feeds
- `/test-feeds` — validate all RSS feed URLs are working
- `/add-topic-feed <topic>` — add a new news category
- `/refresh-geocode-cache` — inspect and refresh geocoding cache
- `/perf-audit` — full performance audit

## Important Notes

- Google News RSS feeds don't require API keys
- Fallback RSS feeds may go stale — run `/test-feeds` periodically
- The `REGION_FEEDS` array in `route.ts` is kept for the global view but country clicks use `countryFeeds.ts`
- Globe auto-rotation stops at zoom > 3.5 and during flyTo animations
