import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getContent } from '@/lib/content';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { divisionIcons } from '@/components/ui/DivisionIcons';

export default async function GroupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Server component: `useContent` resolves the locale through next-intl,
  // which needs a live request. `getContent` is its server-safe sibling and
  // keeps this page statically exportable.
  const { locale } = await params;
  const content = getContent(locale);
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
      <SectionHeader
        eyebrow={content.nav.group}
        title={content.divisions.sectionTitle}
        subtitle={content.divisions.sectionSubtitle}
      />
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.divisions.items.map((d) => {
          const Icon = divisionIcons[d.key as keyof typeof divisionIcons];
          return (
            <Link
              key={d.key}
              href={d.href}
              className="group flex h-full flex-col gap-5 rounded-lg border border-gray-soft bg-black-soft p-8 transition-all duration-300 ease-signature hover:border-gold hover:-translate-y-1"
            >
              <Icon className="text-gold" />
              <h3 className="text-2xl font-bold text-white">{d.name}</h3>
              <p className="text-sm text-gray-light">{d.location}</p>
              <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-gold">
                <span>{content.divisions.detailsCta}</span>
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-300 ease-signature group-hover:-translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
