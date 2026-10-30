import test from 'node:test';
import assert from 'node:assert/strict';
import { browserLanguage, isLanguage, translatedArticleUrl, validTexts, parseTranslation } from '../lib/translation.ts';

test('browser language matching and fallback', () => {
  assert.equal(browserLanguage(['fr-FR', 'en']), 'fr');
  assert.equal(browserLanguage(['xx', 'mr-IN']), 'mr');
  assert.equal(browserLanguage(['zh-Hant-TW']), 'zh-TW');
  assert.equal(browserLanguage(['zh-CN']), 'zh');
  assert.equal(browserLanguage(['xx']), 'en');
  assert.equal(isLanguage('__proto__'), false);
});
test('article translation links auto-detect source and preserve URL', () => {
  const original = 'https://example.com/story?a=1&b=hello#part';
  const link = new URL(translatedArticleUrl(original, 'hi'));
  assert.equal(link.searchParams.get('sl'), 'auto');
  assert.equal(link.searchParams.get('tl'), 'hi');
  assert.equal(link.searchParams.get('u'), original);
  assert.equal(translatedArticleUrl(original, 'original'), original);
});
test('translation input and model output are bounded and validated', () => {
  const texts = [{ title: 'Bonjour', snippet: '' }];
  assert.ok(validTexts(texts));
  assert.ok(!validTexts([]));
  assert.ok(!validTexts(Array(7).fill(texts[0])));
  assert.ok(!validTexts([{ title: 'x'.repeat(401), snippet: '' }]));
  assert.ok(!validTexts([{ title: 'x', snippet: null }]));
  assert.deepEqual(parseTranslation({ translations: texts }, 1), texts);
  assert.throws(() => parseTranslation({ translations: texts }, 2));
  assert.throws(() => parseTranslation({ translations: [{ title: '', snippet: '' }] }, 1));
  assert.throws(() => parseTranslation(null, 1));
});
