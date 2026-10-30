import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ headless: true, channel: "chrome" });
try {
  const context = await browser.newContext({ locale: 'fr-FR' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/api/geo', (route) => route.fulfill({ json: { country: 'FR' } }));
  await page.route('**/api/news?**', (route) => route.fulfill({
    headers: { 'x-total-batches': '1' },
    json: [{ xml: `<rss><channel><title>Test Publisher</title><item><title>Bonjour la France</title><link>https://example.com/article?a=1&amp;b=2</link><description>Les nouvelles du jour</description><pubDate>${new Date().toUTCString()}</pubDate></item></channel></rss>`, meta: { lat: 46.2, lng: 2.2, name: 'France', feedName: 'Test Publisher' } }],
  }));
  await page.route('**/api/translate', async (route) => {
    const { language, texts } = route.request().postDataJSON();
    await new Promise((resolve) => setTimeout(resolve, language === 'hi' ? 700 : 50));
    await route.fulfill(language === 'ja' ? { status: 503, json: { error: 'unavailable' } } : {
      json: { translations: texts.map((text) => ({ title: `${language}: ${text.title}`, snippet: `${language}: ${text.snippet}` })) },
    });
  });
  await page.goto(process.env.BASE_URL || 'http://localhost:3025');
  const selector = page.getByRole('combobox', { name: 'Reading language' }).first();
  await selector.waitFor();
  await page.waitForFunction(() => document.querySelector('select')?.value === 'fr');
  await page.getByText('fr: Bonjour la France').first().waitFor();
  await selector.selectOption('hi');
  await page.waitForTimeout(150);
  await selector.selectOption('de');
  await page.getByText('de: Bonjour la France').first().waitFor();
  await page.waitForTimeout(800);
  assert.equal(await page.getByText('hi: Bonjour la France').count(), 0, 'stale language must never display');
  const translatedLink = page.getByRole('link', { name: 'Read in Deutsch' }).first();
  assert.equal(new URL(await translatedLink.getAttribute('href')).searchParams.get('tl'), 'de');
  assert.equal(await page.getByRole('link', { name: 'Original' }).first().getAttribute('href'), 'https://example.com/article?a=1&b=2');
  await page.reload();
  await page.waitForFunction(() => document.querySelector('select')?.value === 'de');
  await selector.selectOption('ja');
  await page.getByText('Translation unavailable — showing original').first().waitFor();
  await selector.selectOption('original');
  assert.equal(await page.getByRole('link', { name: /Read in/ }).count(), 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: '☰', exact: true }).click();
  const mobileSelector = page.getByRole('combobox', { name: 'Reading language' }).last();
  await mobileSelector.selectOption('ar');
  await page.getByText('ar: Bonjour la France').last().waitFor();
  assert.equal(await mobileSelector.inputValue(), 'ar');
  assert.deepEqual(errors, []);
  console.log('PASS: browser default, translation, language race, original links, persistence, failure fallback, mobile selector');
} finally {
  await browser.close();
}
