Audit the performance of the news globe application.

Steps:
1. **API Route Analysis** — Read `newsglobe/app/api/news/route.ts` and analyze:
   - How many parallel RSS fetches happen for the global view?
   - What's the cache TTL and is it appropriate?
   - Are there any sequential bottlenecks (e.g. geocoding in a loop)?
   - Estimate worst-case response time based on the number of external fetches

2. **Geocoding Performance** — Read `newsglobe/lib/geocode.ts`:
   - Is geocoding called per-article? How many API calls per news fetch?
   - Is there caching? What's the hit rate likely to be?
   - Could batch geocoding or pre-computed lookups reduce calls?

3. **Frontend Performance** — Read `newsglobe/components/GlobeScene.tsx`:
   - How many DOM elements (markers) are rendered?
   - Is visibility culling working efficiently?
   - Are there unnecessary re-renders? (check useCallback/useMemo usage)
   - Is the auto-rotation causing performance issues?

4. **Bundle Size** — Check if there are heavy dependencies that could be optimized:
   - Run `du -sh newsglobe/node_modules/maplibre-gl` and other large deps
   - Check if there are unused imports

5. **Country Feed Performance** — For the country click feature:
   - How long does fetching a single country's feed take?
   - Are fallback RSS feeds slower than Google News feeds?

6. **Report** — Present findings as a prioritized list:
   - Critical issues (blocking user experience)
   - Moderate issues (noticeable delays)
   - Minor optimizations (nice to have)
   - For each issue, suggest a concrete fix

7. Ask the user which optimizations to implement
