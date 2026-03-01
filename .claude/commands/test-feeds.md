Test all RSS feeds configured in `newsglobe/lib/countryFeeds.ts` and report which ones are broken.

Steps:
1. Read `newsglobe/lib/countryFeeds.ts` and extract all feed URLs:
   - For Google News countries: construct the URL from `gl`, `ceid`, `hl` params
   - For fallback countries: use the `fallbackFeeds` array URLs
2. Test each feed URL by fetching it with curl (timeout 10 seconds) and checking:
   - HTTP status code (should be 200)
   - Response contains valid XML/RSS (check for `<rss` or `<feed` tag)
   - Has at least 1 item/entry
3. Run tests in parallel batches of 10 to avoid overwhelming networks
4. Report results in a table format:
   - Country code | Country name | Feed type (Google News / Fallback) | URL | Status (OK / Timeout / HTTP error / Invalid XML / Empty)
5. Summarize: total tested, working, broken, timeout
6. For broken feeds, suggest replacement feeds if possible by searching for major news outlets in that country
7. Ask whether to remove or replace broken feeds in the code
