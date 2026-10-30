import test from 'node:test';
import assert from 'node:assert/strict';
import { translateWithCache } from '../lib/translationCache.ts';

const a = { title: 'Bonjour', snippet: 'Une nouvelle.' };
const b = { title: 'Bonsoir', snippet: 'Une autre nouvelle.' };
const c = { title: 'Salut', snippet: '' };

function fixture() {
  const stored = new Map();
  const calls = [];
  const cache = {
    async match(key) { return stored.get(key)?.clone(); },
    async put(key, response) { stored.set(key, response.clone()); },
  };
  const run = (language, texts) => translateWithCache(language, texts, cache, async (missing) => {
    calls.push({ language, texts: missing });
    return missing.map(({ title, snippet }) => ({ title: `${language}: ${title}`, snippet: `${language}: ${snippet}` }));
  });
  return { stored, calls, cache, run };
}

test('overlapping and reordered batches translate only misses and preserve order', async () => {
  const { run, calls, stored } = fixture();
  const first = await run('en', [a, b]);
  assert.equal(first.generated, 2);
  const second = await run('en', [b, c, a]);
  assert.equal(second.hits, 2);
  assert.equal(second.generated, 1);
  assert.deepEqual(calls[1].texts, [c]);
  assert.deepEqual(second.translations.map((text) => text.title), ['en: Bonsoir', 'en: Salut', 'en: Bonjour']);
  const third = await run('en', [c, b]);
  assert.equal(third.generated, 0);
  assert.equal(third.hits, 2);
  assert.equal(calls.length, 2);
  for (const response of stored.values()) assert.equal(response.headers.get('cache-control'), 'public, max-age=86400');
});

test('language and source text changes have independent cache entries', async () => {
  const { run, calls } = fixture();
  await run('en', [a]);
  assert.equal((await run('hi', [a])).generated, 1);
  assert.equal((await run('en', [{ ...a, snippet: 'Updated snippet' }])).generated, 1);
  assert.equal((await run('en', [{ ...a, title: 'Updated headline' }])).generated, 1);
  assert.equal((await run('en', [a])).generated, 0);
  assert.equal(calls.length, 4);
});

test('duplicate articles in one request are translated only once', async () => {
  const { run, calls } = fixture();
  const result = await run('en', [a, a, b, a]);
  assert.equal(result.generated, 2);
  assert.deepEqual(calls[0].texts, [a, b]);
  assert.deepEqual(result.translations[0], result.translations[1]);
  assert.deepEqual(result.translations[0], result.translations[3]);
  assert.equal((await run('en', [a, a])).hits, 2);
});

test('irrelevant input fields and property order do not change identity', async () => {
  const { run } = fixture();
  await run('en', [a]);
  assert.equal((await run('en', [{ snippet: a.snippet, title: a.title, extra: 'ignored' }])).generated, 0);
});

test('failed inference is not cached and cached neighbors survive', async () => {
  const { run, cache, stored } = fixture();
  await run('en', [a]);
  await assert.rejects(translateWithCache('en', [a, b], cache, async () => { throw new Error('provider failed'); }), /provider failed/);
  assert.equal(stored.size, 1);
  const retry = await run('en', [a, b]);
  assert.equal(retry.hits, 1);
  assert.equal(retry.generated, 1);
});
