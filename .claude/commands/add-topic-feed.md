Add a new topic/category feed to the news globe.

The user will provide: $ARGUMENTS

Steps:
1. Parse the input — expect a topic name (e.g. "climate", "AI", "politics") and optionally a color hex code
2. Read the current topics from:
   - `newsglobe/app/api/news/route.ts` — the `TOPIC_FEEDS` record
   - `newsglobe/lib/types.ts` — the `Category` type and `CATEGORY_COLORS` map
3. Check if the topic already exists — if so, report it
4. Find the Google News RSS topic URL:
   - Search Google News for the topic and identify the correct topic RSS URL
   - The URL format is: `https://news.google.com/rss/topics/TOPIC_ID?hl=en-US&gl=US&ceid=US:en`
   - Verify the URL works by fetching it with curl
5. If no color was provided, pick a color that's visually distinct from existing category colors
6. Update the three locations:
   - Add to `Category` type union in `newsglobe/lib/types.ts`
   - Add color to `CATEGORY_COLORS` in `newsglobe/lib/types.ts`
   - Add feed URL to `TOPIC_FEEDS` in `newsglobe/app/api/news/route.ts`
7. Check if the toolbar/UI components need updating to show the new category button — update if needed
8. Run `npx tsc --noEmit` to verify no type errors
9. Report the new topic config
