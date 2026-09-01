import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { getContent } from '@/lib/content';

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Server component: `useContent` resolves the locale through next-intl,
  // which needs a live request. `getContent` is its server-safe sibling and
  // keeps this page statically exportable.
  const { locale } = await params;
  const content = getContent(locale);
  const p = content.placeholders.careers;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
