import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/hero/Hero';
import { DivisionsGrid } from '@/components/sections/DivisionsGrid';
import { StoryTimeline } from '@/components/sections/StoryTimeline';
import { StatsBar } from '@/components/sections/StatsBar';
import { DualCTA } from '@/components/sections/DualCTA';
import { NewsHighlight } from '@/components/sections/NewsHighlight';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="relative">
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
