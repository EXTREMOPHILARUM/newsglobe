Add a new country to `newsglobe/lib/countryFeeds.ts`.

The user will provide: $ARGUMENTS

Steps:
1. Parse the input — expect a country name, and optionally RSS feed URLs
2. Look up the country's ISO alpha-2 code and approximate lat/lng centroid
3. Check if the country already exists in the COUNTRIES array in `newsglobe/lib/countryFeeds.ts` — if so, report it and ask whether to update it
4. Do not use Google News RSS — it throttles Cloudflare Workers egress
5. If RSS feed URLs are provided, add them as `fallbackFeeds`; otherwise search for RSS feeds from major news outlets in that country and suggest 2-3 working feeds
6. Verify each feed returns items with titles/links, and store its final post-redirect URL
7. Add the country entry to the COUNTRIES array
8. Update the COUNTRY_BY_CODE export (it's auto-derived, so just verify it works)
9. Run `npx tsc --noEmit` to verify no type errors
10. Report what was added
