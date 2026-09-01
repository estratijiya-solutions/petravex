import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

const slugMap = {
  trading: 'trading',
  contracting: 'contracting',
  decor: 'decor',
  'fit-out': 'fit-out',
  'import-export': 'import-export',
  transport: 'transport',
  cement: 'cement',
} as const;

export function generateStaticParams() {
  return Object.keys(slugMap).map((division) => ({ division }));
}

/**
 * `<head>` only. Each division gets its own title and description built
 * from the division's own name and location — the exact strings already
 * rendered by `PlaceholderPage` below. Without this, all seven division
 * pages shared one duplicate title.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string; locale: string }>;
}): Promise<Metadata> {
  const { division, locale } = await params;
  const content = getContent(locale);
  const item = content.divisions.items.find((d) => d.key === division);
  if (!item) return {};
  return pageMetadata({
    locale,
    path: `group/${division}`,
    title: `${item.name} — ${content.nav.group}`,
    description: `${item.location} — ${item.name}. ${content.divisions.sectionTitle}`,
  });
}

export default async function DivisionPage({
  params,
}: {
  params: Promise<{ division: string; locale: string }>;
}) {
  const { division, locale } = await params;
  if (!(division in slugMap)) notFound();
  // `getContent` is the server-safe sibling of `useContent`: this page is an
  // async component, and next-intl's `useLocale()` cannot be called in one.
  const content = getContent(locale);
  const item = content.divisions.items.find((d) => d.key === division);
  if (!item) notFound();
  return (
    <>
      {/* Home › The group › <division>. A ld+json script is never painted,
          so this changes nothing on screen. */}
      <BreadcrumbJsonLd
        locale={locale}
        trail={[
          { name: content.nav.group, path: 'group' },
          { name: item.name, path: `group/${division}` },
        ]}
      />
      <PlaceholderPage
        eyebrow={content.nav.group}
        title={item.name}
        description={`${item.location} — ${item.name}.`}
      />
    </>
  );
}
