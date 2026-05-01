import { unstable_setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/hero/Hero';
import { DivisionsGrid } from '@/components/sections/DivisionsGrid';
import { StoryTimeline } from '@/components/sections/StoryTimeline';
import { StatsBar } from '@/components/sections/StatsBar';
import { DualCTA } from '@/components/sections/DualCTA';
import { NewsHighlight } from '@/components/sections/NewsHighlight';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
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
