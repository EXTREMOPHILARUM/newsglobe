Update the fallback RSS feeds in `newsglobe/lib/countryFeeds.ts` from the upstream GitHub repo.

Steps:
1. Fetch the latest `active-feeds-auto-generated.json` from `yavuz/news-feed-list-of-countries` using `gh api`
2. For each country in the JSON, add working RSS feed URLs from the repo to its `fallbackFeeds` array (use final post-redirect URLs, skip duplicates)
3. Add any new countries from the repo that don't exist in our COUNTRIES array yet — look up their ISO alpha-2 code, name, and approximate lat/lng centroid
4. Remove any fallback feed URLs that are clearly broken or duplicated
5. Run `npx tsc --noEmit` to verify no type errors after the update
6. Report a summary: how many countries updated, how many new countries added, total country count
