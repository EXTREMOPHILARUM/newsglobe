Inspect and refresh the geocoding layer used by the news API.

Steps:
1. Read `newsglobe/lib/geocode.ts` to understand the current geocoding implementation (caching strategy, provider, etc.)
2. Check if there's an in-memory cache, file-based cache, or external cache — report what's found
3. If there's a cache file or persisted cache, report its size and age
4. Check the API route `newsglobe/app/api/news/route.ts` for the in-memory `cache` Map — report how many entries it would hold and the TTL
5. Suggest improvements if any:
   - Is the cache TTL appropriate?
   - Should geocode results be persisted to disk?
   - Are there rate limit concerns with the geocoding provider?
6. If the user confirms, clear any persisted geocode cache files
7. Optionally warm the cache by triggering a fetch of the main news endpoint locally: `curl http://localhost:3000/api/news`
8. Report what was done
