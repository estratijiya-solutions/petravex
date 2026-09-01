import type { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from '@/i18n';

/**
 * Single source of truth for every SEO / analytics constant on this site.
 * Nothing here renders anything — it only feeds `<head>`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ⚠️  DOMAIN NOTE (2026-09-01 audit)
 * The build is currently served from `estratijiyatest.com`, a temporary
 * preview domain the client does not own. Every canonical, hreflang and
 * sitemap URL below deliberately points at `petravex.com` — the real
 * production domain — so the preview can never be indexed as a duplicate.
 * Indexing must stay switched OFF (see `app/robots.ts`) until the site is
 * actually moved to petravex.com.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const SITE_URL = 'https://petravex.com';
export const SITE_NAME = 'Petravex';

/**
 * Master switch for search-engine crawling. **Keep this `false`** while the
 * build is served from the temporary `estratijiyatest.com` preview domain:
 * letting Google crawl a domain the client does not own creates duplicate
 * content and puts the wrong hostname next to the brand.
 *
 * Flip to `true` in ONE place, here, on the day the site actually moves to
 * petravex.com. `app/robots.ts` reads it and switches from `Disallow: /`
 * to a normal allow-all plus the `Sitemap:` line.
 */
export const ALLOW_INDEXING = false;

/**
 * Open Graph / Twitter share image. `/logo.png` is the only brand asset in
 * the repo (2000×2000, supplied by the client). It clears Google's and
 * Twitter's minimum dimensions but it is a square logo, not a designed
 * 1200×630 share card — request a proper OG card from the client.
 */
export const OG_IMAGE = '/logo.png';
export const OG_IMAGE_WIDTH = 2000;
export const OG_IMAGE_HEIGHT = 2000;

/**
 * Google Search Console verification token.
 *
 * Leave this as an EMPTY STRING until Taif creates the property and pastes
 * the real token here. While it is empty no `<meta name="google-site-
 * verification">` tag is emitted at all — an invented or copied token would
 * fail verification and pollute every page.
 *
 * How to fill it: Search Console → Add property → HTML tag method → copy the
 * value of the `content="…"` attribute (the token only, not the whole tag).
 */
export const GOOGLE_SITE_VERIFICATION = '';

/**
 * GA4 Measurement ID. Stays as the placeholder below until Taif creates the
 * GA4 property. `components/analytics/GA4.tsx` renders NOTHING while the
 * value equals the placeholder — no script tag, no network request.
 */
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
export const GA_PLACEHOLDER = 'G-XXXXXXXXXX';

/** OG locale tag per site locale. */
const OG_LOCALE: Record<Locale, string> = {
  en: 'en_AE',
  ar: 'ar_AE',
};

/**
 * Build the public URL for a route in a given locale.
 *
 * English is the primary locale and lives at the site ROOT (`/story/`), not
 * under `/en/`; Arabic lives under `/ar/`. `next.config.mjs` sets
 * `trailingSlash: true`, so every URL here ends in `/` — a canonical that
 * disagrees with the served URL is worse than no canonical at all.
 *
 * @param path route path with no locale prefix, e.g. `''`, `'story'`,
 *             `'group/cement'`.
 */
export function localeUrl(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return clean ? `${SITE_URL}${prefix}/${clean}/` : `${SITE_URL}${prefix}/`;
}

/** `alternates.languages` map: every locale points at its own real URL. */
function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const loc of locales) {
    map[loc] = localeUrl(loc, path);
  }
  // x-default sends anyone we cannot place to the primary locale.
  map['x-default'] = localeUrl(defaultLocale, path);
  return map;
}

/**
 * Per-page `<head>` metadata: unique title + description, an absolute
 * self-referencing canonical, hreflang for both locales, and the shared
 * Open Graph / Twitter block.
 *
 * Pure metadata — it never touches the rendered body.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const loc = (locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : defaultLocale;
  const url = localeUrl(loc, path);
  // The root layout's title template appends " — Petravex"; OG/Twitter get
  // the fully-resolved string so the share card is not missing the brand.
  const fullTitle = `${title} — ${loc === 'ar' ? 'بترافكس' : SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[loc],
      title: fullTitle,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
