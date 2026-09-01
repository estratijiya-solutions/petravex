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
  const p = getContent(locale).placeholders.contact;
  return pageMetadata({
    locale,
    path: 'contact',
    title: p.title,
    description: p.description,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Server component: `useContent` resolves the locale through next-intl,
  // which needs a live request. `getContent` is its server-safe sibling and
  // keeps this page statically exportable.
  const { locale } = await params;
  const content = getContent(locale);
  const c = content.footer.contact;
  const p = content.placeholders.contact;
  const cp = content.contactPage;
  return (
    <>
      <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />
      <section className="mx-auto max-w-3xl px-6 md:px-10 pb-24 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="rounded-lg border border-gray-soft bg-black-soft p-6">
            <div className="text-xs uppercase tracking-caption text-gold mb-2">{cp.email}</div>
            <a href={`mailto:${c.email}`} className="font-tech text-white hover:text-gold transition-colors">
              {c.email}
            </a>
          </div>
          <div className="rounded-lg border border-gray-soft bg-black-soft p-6">
            <div className="text-xs uppercase tracking-caption text-gold mb-2">{cp.phone}</div>
            <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="font-tech text-white hover:text-gold transition-colors">
              {c.phone}
            </a>
          </div>
          <div className="rounded-lg border border-gray-soft bg-black-soft p-6">
            <div className="text-xs uppercase tracking-caption text-gold mb-2">{cp.website}</div>
            <span className="font-tech text-white">{c.website}</span>
          </div>
        </div>
      </section>
    </>
  );
}
