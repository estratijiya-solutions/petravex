import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

/**
 * `<head>` only — a unique title and description for this route, plus an
 * absolute canonical and the en/ar hreflang pair. Copy is reused verbatim
 * from the content tree that already renders on the page; this function
 * outputs no markup.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const p = getContent(locale).placeholders.news;
  return pageMetadata({
    locale,
    path: 'news',
    title: p.title,
    description: p.description,
  });
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Server component: `useContent` resolves the locale through next-intl,
  // which needs a live request. `getContent` is its server-safe sibling and
  // keeps this page statically exportable.
  const { locale } = await params;
  const content = getContent(locale);
  const p = content.placeholders.news;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
