Add a new topic/category feed to the news globe.

The user will provide: $ARGUMENTS

Steps:
1. Parse the input — expect a topic name (e.g. "climate", "AI", "politics") and optionally a color hex code
2. Read the current topics from:
   - `newsglobe/app/api/news/route.ts` — the `TOPIC_FEEDS` record
   - `newsglobe/lib/types.ts` — the `Category` type and `CATEGORY_COLORS` map
3. Check if the topic already exists — if so, report it
4. Find 2-4 publisher RSS feeds for the topic (not Google News — it throttles Cloudflare Workers egress):
   - Prefer international outlets (BBC section feeds, specialist publications)
   - Verify each URL works by fetching it with curl and use the final post-redirect URL
5. If no color was provided, pick a color that's visually distinct from existing category colors
6. Update the three locations:
   - Add to `Category` type union in `newsglobe/lib/types.ts`
   - Add color to `CATEGORY_COLORS` in `newsglobe/lib/types.ts`
   - Add the feeds (url, feedName, publisher location) to `TOPIC_FEEDS` in `newsglobe/app/api/news/route.ts`
7. Check if the toolbar/UI components need updating to show the new category button — update if needed
8. Run `npx tsc --noEmit` to verify no type errors
9. Report the new topic config
