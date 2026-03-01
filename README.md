# NewsGlobe

Real-time trending news from 150 countries on an interactive 3D globe.

**[newsglobe.saurabhn.com](https://newsglobe.saurabhn.com)**

## What is this?

NewsGlobe pulls headlines from ~150 countries via Google News RSS feeds and plots them on a spinning 3D globe. Click any country to see its trending stories, search for topics, or just watch the world's news light up in real time.

Inspired by [Polyglobe](https://pizz.watch/polyglobe) (which does this for Polymarket bets).

## Features

- Interactive 3D globe with auto-rotation and day/night overlay
- 150 countries with Google News feeds + fallback RSS for countries without Google News
- Polygon-based country selection (click anywhere inside a country's border)
- Client-side geocoding using 7,000+ city database for precise article placement
- Category filters: World, Business, Tech, Science, Sports, Entertainment, Health
- Search across regions with automatic fly-to
- Incremental loading — first batch renders immediately, rest loads in background
- Mobile-optimized with slide-up sidebar and scrollable toolbar

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **3D/Map**: MapLibre GL (globe projection), React Map GL, TopoJSON
- **State**: Zustand
- **Styling**: Tailwind CSS 4, Framer Motion
- **Data**: Google News RSS via `rss-parser`, geocoding via `city-timezones`
- **Hosting**: Cloudflare Workers via `@opennextjs/cloudflare`
- **Caching**: Workers Cache API (5-min TTL, per-datacenter)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deployed to Cloudflare Workers via GitHub Actions on push to `main`.

```bash
npm run preview   # local preview in workerd runtime
npm run deploy    # deploy to production
```

## Project Structure

```
app/
  api/news/route.ts     — News API: global, topic, country, and search feeds
  page.tsx              — Main page, polls API every 60s
components/
  GlobeScene.tsx        — MapLibre globe with news dots, polygon country selection
  Sidebar.tsx           — Article list + mobile slide-up sheet
  SearchBar.tsx         — Search input with fly-to
  Toolbar.tsx           — Category filter buttons
  NewsTicker.tsx        — Scrolling headline ticker
  DayNightOverlay.tsx   — Day/night terminator on globe
  InfoButton.tsx        — About modal + GitHub link
lib/
  countryFeeds.ts       — 150 countries: Google News params or fallback RSS URLs
  newsStore.ts          — Zustand store: articles, country selection, search
  types.ts              — NewsArticle, Category, colors
  geocode.ts            — Client-side geocoding (city-timezones + static table)
  countries.ts          — Manual location overrides (regions, demonyms)
public/
  countries-110m.json   — TopoJSON country polygons for click detection
  land-110m.json        — TopoJSON landmass
```

## Credits & Data Sources

- **[Google News RSS](https://news.google.com/)** — primary news feed for countries with Google News editions
- **[news-feed-list-of-countries](https://github.com/yavuz/news-feed-list-of-countries)** — fallback RSS feed URLs for countries without Google News
- **[Natural Earth](https://www.naturalearthdata.com/)** — TopoJSON country polygons and landmass data (via [world-atlas](https://github.com/topojson/world-atlas))
- **[CARTO](https://carto.com/basemaps/)** — Dark Matter basemap tiles
- **[Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org/)** — geocoding
- **[city-timezones](https://github.com/kevinroberts/city-timezones)** — 7,000+ city database for client-side geocoding
- **[Polyglobe](https://pizz.watch/polyglobe)** — inspiration for the spinning globe concept
