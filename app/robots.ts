import type { MetadataRoute } from 'next';
import { SITE_URL, ALLOW_INDEXING } from '@/lib/seo';

export const dynamic = 'force-static';

/**
 * robots.txt
 *
 * The build is currently served from `estratijiyatest.com` — a temporary
 * preview domain that Petravex does not own. Crawling is therefore CLOSED:
 * indexing the preview would duplicate the real site and attach the wrong
 * hostname to the brand in search results.
 *
 * To open the site up on the day it moves to petravex.com, flip
 * `ALLOW_INDEXING` to `true` in `lib/seo.ts`. That single change turns this
 * file into a normal allow-all with the `Sitemap:` line, and nothing else
 * needs editing.
 */
export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
