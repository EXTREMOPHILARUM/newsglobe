import { NewsArticle, Category } from "./types";

/** Raw feed response from the API (XML string + metadata) */
export interface RawFeedResponse {
  xml: string;
  meta: {
    lat: number;
    lng: number;
    name: string;
    feedName?: string;
    category?: string;
  };
}

const ATOM_NS = "http://www.w3.org/2005/Atom";

/** Parse RSS 2.0 / RSS 1.0 (RDF) / Atom XML using the browser's native DOMParser */
function parseRssXml(xml: string): {
  title: string;
  items: {
    title: string;
    link: string;
    guid: string;
    pubDate: string;
    content: string;
    thumbnail?: string;
    source?: string;
  }[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const feedTitle =
    doc.querySelector("channel > title, feed > title")?.textContent || "";
  const itemEls = doc.querySelectorAll("item, entry");

  const items = Array.from(itemEls).map((el) => {
    const title = el.querySelector("title")?.textContent || "";
    // RSS puts the URL in the <link> text, Atom in <link href> (prefer rel="alternate")
    const linkEl =
      el.querySelector('link[rel="alternate"]') || el.querySelector("link");
    const link = unwrapRedirect(
      linkEl?.textContent?.trim() || linkEl?.getAttribute("href") || ""
    );
    // Bing News RSS carries the publisher in <News:Source>
    const source =
      el.getElementsByTagName("News:Source")[0]?.textContent || undefined;
    const guid = el.querySelector("guid, id")?.textContent || link;
    const pubDate =
      el.querySelector("pubDate, published, updated")?.textContent ||
      el.getElementsByTagName("dc:date")[0]?.textContent ||
      "";
    const content =
      el.querySelector("description, summary")?.textContent ||
      el.getElementsByTagName("content:encoded")[0]?.textContent ||
      el.getElementsByTagNameNS(ATOM_NS, "content")[0]?.textContent ||
      "";

    // Extract thumbnail from Bing's News:Image, media:content, media:thumbnail, or enclosure
    let thumbnail: string | undefined;
    const mediaContent = el.getElementsByTagNameNS("http://search.yahoo.com/mrss/", "content")[0];
    const mediaThumbnail = el.getElementsByTagNameNS("http://search.yahoo.com/mrss/", "thumbnail")[0];
    const enclosure = el.querySelector("enclosure");
    const bingImage = el.getElementsByTagName("News:Image")[0]?.textContent;

    if (bingImage) {
      thumbnail = bingImage.replace(/^http:/, "https:");
    } else if (mediaContent?.getAttribute("url")) {
      thumbnail = mediaContent.getAttribute("url")!;
    } else if (mediaThumbnail?.getAttribute("url")) {
      thumbnail = mediaThumbnail.getAttribute("url")!;
    } else if (enclosure?.getAttribute("url")) {
      const encUrl = enclosure.getAttribute("url")!;
      if (/\.(jpg|jpeg|png|webp|gif)/i.test(encUrl)) {
        thumbnail = encUrl;
      }
    }

    return { title, link, guid, pubDate, content, thumbnail, source };
  });

  return { title: feedTitle, items };
}

/** Parse a feed date; unparseable or missing dates fall back to now */
function toIsoDate(raw: string): string {
  const t = raw ? Date.parse(raw.trim()) : NaN;
  return new Date(Number.isNaN(t) ? Date.now() : t).toISOString();
}

/** Bing News links go through bing.com/news/apiclick.aspx?url=<article>; link to the article directly */
function unwrapRedirect(link: string): string {
  if (!link.includes("bing.com/news/apiclick")) return link;
  try {
    return new URL(link).searchParams.get("url") || link;
  } catch {
    return link;
  }
}

function extractSource(title: string): string {
  const match = title.match(/ - ([^-]+)$/);
  return match ? match[1].trim() : "Unknown";
}

function cleanTitle(title: string): string {
  return title.replace(/ - [^-]+$/, "").trim();
}

function stripHtml(html: string): string {
  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
  return html.replace(/<[^>]*>/g, "");
}

/** Parse an array of raw feed responses into NewsArticle[] */
export function parseRawFeeds(
  rawFeeds: RawFeedResponse[],
  defaultCategory: Category | "all" = "all"
): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const seenUrls = new Set<string>();

  for (const raw of rawFeeds) {
    try {
      const feed = parseRssXml(raw.xml);
      const category = (raw.meta.category || "general") as Category;

      for (const item of feed.items) {
        const url = item.link;
        if (!url || seenUrls.has(url)) continue;
        seenUrls.add(url);

        // "Headline - Publisher" suffixes are only split off when the feed doesn't
        // name its publisher; publisher feeds use " - " inside real headlines.
        const knownSource = raw.meta.feedName || item.source;
        const titleSource = knownSource ? "Unknown" : extractSource(item.title);
        const source =
          knownSource ||
          (titleSource !== "Unknown" ? titleSource : feed.title || "Unknown");

        articles.push({
          id: item.guid || url || Math.random().toString(36),
          title: knownSource ? item.title.trim() : cleanTitle(item.title),
          snippet: stripHtml(item.content).slice(0, 200),
          url,
          source,
          publishedAt: toIsoDate(item.pubDate),
          category: defaultCategory !== "all" ? defaultCategory as Category : category,
          lat: raw.meta.lat,
          lng: raw.meta.lng,
          regionLat: raw.meta.lat,
          regionLng: raw.meta.lng,
          thumbnail: item.thumbnail,
        });
      }
    } catch {
      // Skip feeds that fail to parse
    }
  }

  // Sort by date, newest first
  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return articles;
}
