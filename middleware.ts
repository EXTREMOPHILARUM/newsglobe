import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only track page views, not API/static requests
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const source = request.nextUrl.searchParams.get("utm_source") || "";
  const medium = request.nextUrl.searchParams.get("utm_medium") || "";
  const campaign = request.nextUrl.searchParams.get("utm_campaign") || "";
  const country = request.headers.get("cf-ipcountry") || "";
  const referer = request.headers.get("referer") || "";

  // Infer source from referer if no UTM params
  let effectiveSource = source;
  if (!effectiveSource && referer) {
    try {
      const host = new URL(referer).hostname;
      if (host.includes("t.co") || host.includes("twitter.com") || host.includes("x.com")) effectiveSource = "twitter";
      else if (host.includes("linkedin.com")) effectiveSource = "linkedin";
      else if (host.includes("reddit.com")) effectiveSource = "reddit";
      else if (host.includes("ycombinator.com")) effectiveSource = "hackernews";
      else if (host.includes("producthunt.com")) effectiveSource = "producthunt";
      else effectiveSource = host;
    } catch {
      // invalid referer URL
    }
  }

  try {
    const { env, ctx } = getCloudflareContext();
    const analytics = (env as Record<string, unknown>).ANALYTICS as
      | { writeDataPoint: (p: { blobs: string[]; doubles: number[] }) => void }
      | undefined;

    if (analytics) {
      ctx.waitUntil(
        Promise.resolve(
          analytics.writeDataPoint({
            blobs: [effectiveSource, medium, campaign, country, pathname],
            doubles: [1],
          })
        )
      );
    }
  } catch {
    // No CF context (local dev) — skip tracking
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
