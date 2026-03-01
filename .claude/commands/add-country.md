Add a new country to `newsglobe/lib/countryFeeds.ts`.

The user will provide: $ARGUMENTS

Steps:
1. Parse the input — expect a country name, and optionally a Google News edition or RSS feed URLs
2. Look up the country's ISO alpha-2 code and approximate lat/lng centroid
3. Check if the country already exists in the COUNTRIES array in `newsglobe/lib/countryFeeds.ts` — if so, report it and ask whether to update it
4. If the country has a Google News edition, verify it works by constructing `https://news.google.com/rss?hl={hl}&gl={gl}&ceid={ceid}` and fetching it with curl
5. If RSS feed URLs are provided, add them as `fallbackFeeds`
6. If neither Google News nor feeds are provided, search for RSS feeds from major news outlets in that country using web search, and suggest 2-3 working feeds
7. Add the country entry to the COUNTRIES array in the appropriate section (Google News or fallback)
8. Update the COUNTRY_BY_CODE export (it's auto-derived, so just verify it works)
9. Run `npx tsc --noEmit` to verify no type errors
10. Report what was added
