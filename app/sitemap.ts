import type { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n';
import { localeUrl } from '@/lib/seo';

export const dynamic = 'force-static';

/**
 * Every route that actually exists as a prerendered page, with no locale
 * prefix. Kept in sync by hand with `app/[locale]/(pages)/` — there are no
 * dynamic data sources behind this site, so a generated crawl would add
 * moving parts for nothing.
 *
 * Deliberately NOT listed:
 *  • `/news/<slug>` article pages — `NewsHighlight` links to three of them
 *    (`clinker-mill`, `distribution-network-expansion`,
 *    `new-construction-partnership`) but no route renders them yet, so
 *    every one of those URLs 404s. Listing a 404 in a sitemap is an error
 *    in Search Console. Add them here the day the article route ships.
 */
const DIVISIONS = [
  'trading',
  'contracting',
  'decor',
  'fit-out',
  'import-export',
  'transport',
  'cement',
] as const;

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'monthly' },
  { path: 'group', priority: 0.9, changeFrequency: 'monthly' },
  { path: 'story', priority: 0.8, changeFrequency: 'yearly' },
  { path: 'products', priority: 0.8, changeFrequency: 'monthly' },
  { path: 'suppliers', priority: 0.7, changeFrequency: 'monthly' },
  { path: 'careers', priority: 0.7, changeFrequency: 'monthly' },
  { path: 'contact', priority: 0.7, changeFrequency: 'yearly' },
  { path: 'news', priority: 0.6, changeFrequency: 'monthly' },
  { path: 'projects', priority: 0.6, changeFrequency: 'monthly' },
  { path: 'sustainability', priority: 0.5, changeFrequency: 'yearly' },
  { path: 'privacy', priority: 0.3, changeFrequency: 'yearly' },
  ...DIVISIONS.map((d) => ({
    path: `group/${d}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  })),
];

/**
 * sitemap.xml — absolute URLs on the production domain (petravex.com), one
 * entry per route per locale, each carrying the full hreflang alternates
 * block so Google pairs the English and Arabic versions correctly.
 *
 * Note: `app/robots.ts` currently keeps crawling closed while the build is
 * served from the temporary preview domain, so this file is generated and
 * ready but not yet advertised.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-09-01');

  const alternatesFor = (path: string) => {
    const languages: Record<string, string> = {};
    for (const loc of locales) languages[loc] = localeUrl(loc, path);
    languages['x-default'] = localeUrl(defaultLocale, path);
    return { languages };
  };

  return locales.flatMap((locale) =>
    ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: localeUrl(locale, path),
      lastModified,
      changeFrequency,
      // Arabic is the secondary locale; nudge priority down a notch so the
      // English set is the one Google leads with.
      priority: locale === defaultLocale ? priority : Math.max(0.1, priority - 0.1),
      alternates: alternatesFor(path),
    })),
  );
}
