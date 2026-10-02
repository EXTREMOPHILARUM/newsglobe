# NewsGlobe

Interactive 3D news globe that visualizes trending stories from 148 countries in real-time.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **3D/Map**: MapLibre GL, React Map GL (globe projection), Three.js + React Three Fiber
- **State**: Zustand (`lib/newsStore.ts`)
- **Styling**: Tailwind CSS 4, Framer Motion
- **Data**: publisher RSS feeds (+ Bing News RSS for search), parsed client-side with DOMParser; geocoding via Nominatim

## Project Structure

```
newsglobe/               ← repo root = Next.js app root
├── app/
│   ├── api/news/route.ts    ← news API: global feed, topic feeds, country feeds, search
│   ├── page.tsx             ← main page, polls API every 5 min (when tab visible)
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
│   ├── countryFeeds.ts      ← 148 countries: publisher RSS URLs (`fallbackFeeds`)
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
- Single source of truth for all 148 supported countries; every country has `fallbackFeeds` (direct publisher RSS)
- **No Google News**: it throttles Cloudflare Workers egress (requests hang or 503), which broke the feed
- Store post-redirect URLs: each redirect costs a Workers subrequest
- Verify new feeds from the Cloudflare edge, not just locally — some publishers block CF IPs
- Upstream source for fallback feeds: `github.com/yavuz/news-feed-list-of-countries`
- Use `/update-country-feeds` to sync from upstream

### News API (`app/api/news/route.ts`)
- `GET /api/news?batch=N&loc=XX` — global feed, 12 countries x 1 feed per batch; `x-total-batches` header; user's country swapped into batch 0
- `GET /api/news?topic=technology` — topic feed (publisher RSS, `TOPIC_FEEDS`)
- `GET /api/news?q=search` — Bing News RSS across a few markets
- `GET /api/news?country=MM` — up to 20 sampled feeds for that country
- Returns raw XML (trimmed to 20 items) — the client parses, keeping worker CPU low
- Workers Free limits: 50 subrequests/invocation (redirects + Cache API count), 6 concurrent fetches (pooled in `fetchAll`)
- Stale-while-revalidate on `caches.default`: fresh 10 min, served stale up to 6h while refreshing via `waitUntil`; bump `CACHE_VERSION` to invalidate

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

- Publisher RSS feeds go stale — run `/test-feeds` periodically
- Globe auto-rotation stops at zoom > 3.5 and during flyTo animations
