# Reading language

The reading-language selector uses the first supported browser language on first visit, then remembers an explicit choice in local storage. Original languages disables translation. Unsupported browser languages fall back to English.

Headlines and snippets translate as they become visible in the sidebar, ticker, and globe popups. Original articles and geocoding/search inputs remain unchanged. Publisher links offer both the original and a Google Translate website link with automatic source-language detection. Translation failures keep the original text and show an unavailable message.

`POST /api/translate` uses the existing Cloudflare account's Workers AI binding (`@cf/qwen/qwen3-30b-a3b-fp8`). Requests accept at most six title/snippet pairs, with bounded text/body sizes. Each article title/snippet and target language is cached independently at the edge for 24 hours. Batch order and neighboring articles do not affect reuse. Changed source text gets a fresh translation. Only uncached, distinct articles are sent to AI, then results are restored to request order. Cache writes finish before the response; failed inference is not cached. The response headers `x-translation-cache-hits` and `x-translation-generated` report reused article slots and newly translated distinct articles. Edge caches are local to a Cloudflare location and can expire or evict entries; this is not permanent global deduplication. Simultaneous cold requests can still translate the same article. Cache misses are limited to 30 requests per minute per IP at each Cloudflare location. Workers AI usage applies to the account; this limit is not a global spending cap. Client results are cached for the browsing session, and language switches cancel obsolete client requests.

Full publisher pages are translated by Google Translate, not by NewsGlobe. Paywalls and publisher restrictions may prevent translation. Machine translations can be inaccurate.

## Verification

- `node --experimental-strip-types --test tests/translation.test.mjs tests/translation-cache.test.mjs` (Node 22.18+)
- `npm run lint`
- `npx tsc --noEmit`
- `npx opennextjs-cloudflare build`
- `npx wrangler deploy --dry-run`
- With Playwright available and Chrome installed, start `npm run dev -- --port 3025`, then run `node tests/reading-language.browser.mjs`. Use `NODE_PATH` if Playwright comes from a shared runtime. The browser test stubs feeds and translation responses to verify preference, stale-result handling, fallback, links, and mobile behavior. Set `BASE_URL` to test the deployed UI with the same fixtures.

The deployment sets `OPEN_NEXT_DEPLOY=true` when invoking Wrangler directly after the OpenNext build. The app has no OpenNext cache bindings to populate; this avoids the adapter starting a remote AI development preview just to read environment variables. Production AI remains enabled.

After deployment, separately send real French headlines to `/api/translate` with English and Hindi targets and confirm valid translated output. Stubbed browser tests do not establish real model quality or third-party publisher compatibility.
