/**
 * sitemap.xml + robots.txt generation from the route table (see src/entry-server.tsx → getSitemapEntries).
 * Excluded automatically: noindex routes (thank-you, 404), dev-only routes and drafts.
 */
export interface SitemapEntry {
  path: string;
  priority: number;
  changefreq: string;
  lastmod?: string;
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function generateSitemapXml(entries: SitemapEntry[], siteUrl: string, buildDate: string): string {
  const base = siteUrl.replace(/\/+$/, '');
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${xmlEscape(base + e.path)}</loc>
    <lastmod>${e.lastmod ?? buildDate}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function generateRobotsTxt(siteUrl: string): string {
  const base = siteUrl.replace(/\/+$/, '');
  return `User-agent: *
Allow: /
Disallow: /thank-you/
Disallow: /styleguide/

Sitemap: ${base}/sitemap.xml
`;
}
