import type { APIContext } from 'astro';
import { getArticlePairs } from '../lib/articles';

// /sitemap.xml — every public page, for search engines (linked from
// robots.txt). One entry per article, dated by its publish date. /system is
// dev-only and 404 is noindex, so neither is listed.
export async function GET(context: APIContext) {
  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://h11t-labs.nl';
  const articles = await getArticlePairs();

  const urls: { loc: string; lastmod?: string }[] = [
    { loc: `${site}/` },
    { loc: `${site}/work/` },
    { loc: `${site}/writing/` },
    { loc: `${site}/about/` },
    ...articles.map((a) => ({
      loc: `${site}/writing/${a.slug}/`,
      lastmod: a.en.data.pubDate.toISOString().slice(0, 10),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
