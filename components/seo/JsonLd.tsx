import { SITE_URL, SITE_NAME, localeUrl } from '@/lib/seo';
import { getContent } from '@/lib/content';
import { locales, type Locale } from '@/i18n';

/**
 * Structured data for the home page: `Organization` + `WebSite`.
 *
 * ⚠️ Every value below is taken from something the site already states —
 * the approved landing page at `landing/index.html` (address, email,
 * telephone, legal name) and `lib/content.*.ts` (description, divisions).
 * NOTHING here is invented. Anything Google would also like but the site
 * has never published — geo coordinates, opening hours, social profiles,
 * a registration number — is deliberately absent and listed as an open
 * request in `docs/AUDIT-2026-09-01.md`.
 *
 * Renders a single `<script type="application/ld+json">`, which browsers
 * never paint. No visual effect whatsoever.
 */
export function OrganizationJsonLd({ locale }: { locale: string }) {
  const loc = ((locales as readonly string[]).includes(locale) ? locale : 'en') as Locale;
  const content = getContent(loc);

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: 'Petravex Group',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 2000,
      height: 2000,
    },
    description: content.footer.description,
    email: content.footer.contact.email,
    telephone: content.footer.contact.phone.replace(/\s/g, ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Al Hulaila Industrial Zone',
      addressLocality: 'Ras Al Khaimah',
      addressRegion: 'RAKEZ',
      addressCountry: 'AE',
    },
    // The seven operating companies the site lists under "The group".
    department: content.divisions.items.map((d) => ({
      '@type': 'Organization',
      name: d.name,
      areaServed: d.location,
      url: `${SITE_URL}${d.href}/`,
    })),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: content.footer.description,
    inLanguage: [...locales],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  };

  return (
    <script
      type="application/ld+json"
      // Serialised from a plain object literal above — no user input reaches
      // this string, and `<` is escaped so the JSON can never close the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, '\\u003c'),
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * `BreadcrumbList` for a second-level page, e.g. Home › The group › Cement.
 * Same contract as above: one non-rendering `<script>`, nothing painted.
 */
export function BreadcrumbJsonLd({
  locale,
  trail,
}: {
  locale: string;
  trail: { name: string; path: string }[];
}) {
  const loc = ((locales as readonly string[]).includes(locale) ? locale : 'en') as Locale;
  const content = getContent(loc);

  const items = [{ name: content.nav.home, path: '' }, ...trail];

  const graph = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: localeUrl(loc, item.path),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, '\\u003c'),
      }}
      suppressHydrationWarning
    />
  );
}
