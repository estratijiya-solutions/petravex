import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/hero/Hero';
import { DivisionsGrid } from '@/components/sections/DivisionsGrid';
import { StoryTimeline } from '@/components/sections/StoryTimeline';
import { StatsBar } from '@/components/sections/StatsBar';
import { DualCTA } from '@/components/sections/DualCTA';
import { NewsHighlight } from '@/components/sections/NewsHighlight';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

const HOME_TITLE: Record<string, string> = {
  en: 'Petravex — An integrated building-materials group',
  ar: 'بترافكس — مجموعة متكاملة لمواد البناء',
};

const HOME_DESCRIPTION: Record<string, string> = {
  en: 'Petravex: from stone, we build the future. Multiple companies, one purpose across the UAE.',
  ar: 'بترافكس: من الحجر، نبني المستقبل. شركات متعددة بهدف واحد عبر الإمارات.',
};

/**
 * `<head>` only. The title and description strings are the ones the home
 * page already shipped with — kept byte-for-byte so nothing in the browser
 * tab changes. What is NEW here is the absolute canonical and the en/ar
 * hreflang pair, which the page had neither of.
 *
 * `title.absolute` bypasses the layout's `%s — Petravex` template, because
 * the brand is already inside these strings.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = pageMetadata({
    locale,
    path: '',
    title: HOME_TITLE[locale] ?? HOME_TITLE.en,
    description: HOME_DESCRIPTION[locale] ?? HOME_DESCRIPTION.en,
  });
  return {
    ...base,
    title: { absolute: HOME_TITLE[locale] ?? HOME_TITLE.en },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="relative">
      {/* Structured data. `<script type="application/ld+json">` is never
          painted by the browser, so this adds no box and no spacing. */}
      <OrganizationJsonLd locale={locale} />
      <Header />
      <Hero />
      <DivisionsGrid />
      <StoryTimeline />
      <StatsBar />
      <DualCTA />
      <NewsHighlight />
      <Footer />
    </main>
  );
}
