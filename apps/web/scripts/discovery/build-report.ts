import type {
  ColorScheme,
  DiscoveryOptions,
  DiscoveryReport,
  FontRecord,
  PageRecord,
  RedirectRecord,
  RouteRecord,
} from './types';
import { isKnownError } from './utils';

export function buildReport(
  options: DiscoveryOptions,
  origin: string,
  pages: PageRecord[],
  sitemapStatus: number,
  statuses: Map<string, { status: number; location: string | null }>,
  redirects: RedirectRecord[],
  metaProbes: { path: string; status: number; contentType: string | null }[],
  tokens: { scheme: ColorScheme; values: Record<string, string> }[],
  fonts: FontRecord[],
  keyframes: string[],
): DiscoveryReport {
  const dead = [...statuses.entries()].filter(([, value]) => value.status === 404);
  const unexpected = pages.filter((page) => page.errors.some((error) => !isKnownError(error)));
  const heavy = pages.filter((page) => page.htmlBytes > 400_000);
  const missingMeta = pages.filter(
    (page) => !page.meta.description || !page.meta.canonical || !page.meta.ogImage,
  );
  const missingH1 = pages.filter((page) => !page.meta.h1);
  const brokenMedia = pages.filter((page) =>
    page.failedRequests.some(
      (request) =>
        request.status !== null &&
        request.status >= 400 &&
        !request.url.includes('/_vercel/insights/'),
    ),
  );

  const anomalies: string[] = [];
  if (dead.length > 0) {
    anomalies.push(
      `${dead.length} sitemap routes return 404 (for example ${dead
        .slice(0, 5)
        .map(([path]) => `\`${path}\``)
        .join(', ')}). Exclude them from the clone.`,
    );
  }
  if (sitemapStatus !== 200) anomalies.push(`Sitemap returned ${sitemapStatus}.`);
  const robots = metaProbes.find((probe) => probe.path === '/robots.txt');
  if (robots && robots.status !== 200) {
    anomalies.push(`robots.txt returned ${robots.status}.`);
  }
  if (
    metaProbes
      .filter((probe) => /rss|feed|atom/.test(probe.path))
      .every((probe) => probe.status !== 200)
  ) {
    anomalies.push('No RSS or Atom feed is present.');
  }
  if (unexpected.length > 0) {
    anomalies.push(
      `Unexpected console errors on ${unexpected
        .map((page) => `\`${page.route.path}\``)
        .join(', ')}.`,
    );
  }
  if (brokenMedia.length > 0) {
    anomalies.push(
      `Broken media requests on ${brokenMedia
        .map((page) => {
          const broken = page.failedRequests
            .filter((request) => request.status !== null && request.status >= 400)
            .slice(0, 3)
            .map((request) => `${request.status} ${request.url.slice(-60)}`)
            .join(', ');
          return `\`${page.route.path}\` (${broken})`;
        })
        .join('; ')}.`,
    );
  }
  if (heavy.length > 0) {
    anomalies.push(
      `Pages over 400 KB of HTML: ${heavy
        .map((page) => `\`${page.route.path}\` (${Math.round(page.htmlBytes / 1024)} KB)`)
        .join(', ')}.`,
    );
  }
  if (missingMeta.length > 0) {
    anomalies.push(
      `Pages missing description, canonical, or OG image: ${missingMeta
        .map((page) => `\`${page.route.path}\``)
        .join(', ')}.`,
    );
  }
  if (missingH1.length > 0) {
    anomalies.push(
      `Pages without an h1: ${missingH1.map((page) => `\`${page.route.path}\``).join(', ')}.`,
    );
  }
  for (const redirect of redirects) {
    anomalies.push(`Redirect: \`${redirect.from}\` (${redirect.status}) → \`${redirect.to}\`.`);
  }

  return {
    generatedAt: new Date().toISOString(),
    baseUrl: origin,
    options,
    routes: [...statuses.entries()].map(([path, value]): RouteRecord => ({
      path,
      url: new URL(path, origin).href,
      status: value.status,
      finalUrl: '',
      redirected: value.status >= 300 && value.status < 400,
      title: pages.find((page) => page.route.path === path)?.route.title ?? '',
      sitemap: true,
      discoveredFrom: ['sitemap'],
    })),
    pages,
    tokens,
    fonts,
    keyframes,
    redirects,
    metaProbes,
    anomalies,
  };
}
