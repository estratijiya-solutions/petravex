import { notFound } from 'next/navigation';
import { getContent } from '@/lib/content';
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
    <PlaceholderPage
      eyebrow={content.nav.group}
      title={item.name}
      description={`${item.location} — ${item.name}.`}
    />
  );
}
