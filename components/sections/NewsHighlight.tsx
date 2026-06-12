'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useContent } from '@/lib/content';
import { SectionHeader } from '@/components/ui/SectionHeader';

/**
 * Themed placeholder photos via Unsplash. Each one is matched to its news
 * topic. Drop a real Petravex photo into /public/images/news-{key}.jpg
 * and swap the src below — that's the only change needed.
 */
const UNSPLASH = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const newsImages = [
  // Lead — industrial plant with smokestacks at sunset (cement-mill plausible)
  UNSPLASH('1611273426858-450d8e3c9fce', 1600),
  // Distribution — aerial view of container port / logistics network
  UNSPLASH('1494412651409-8963ce7935a7', 800),
  // Construction partnership — active construction site with cranes
  UNSPLASH('1565008447742-97f6f38c985c', 800),
];

export function NewsHighlight() {
  const reduce = useReducedMotion();
  const content = useContent();
  const [lead, ...rest] = content.news.items;

  return (
    <section id="news" className="relative bg-black-soft py-24 md:py-32 border-t border-gray-soft overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader title={content.news.sectionTitle} />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="lg:col-span-7"
          >
            <Link
              href={lead.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-soft bg-black transition-all duration-500 ease-signature hover:-translate-y-1 hover:border-gold"
            >
              <BrandedPhoto
                src={newsImages[0]}
                alt={lead.title}
                aspect="16/10"
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
              />
              <div className="relative flex flex-1 flex-col gap-4 p-7 md:p-9">
                <span className="text-xs uppercase tracking-caption text-gold">
                  {lead.date}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {lead.title}
                </h3>
                <p className="text-base text-gray-light leading-relaxed">
                  {lead.excerpt}
                </p>
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-gold pt-2">
                  <span>{content.news.cta}</span>
                  <ArrowLeft
                    className="h-4 w-4 transition-transform duration-300 ease-signature group-hover:-translate-x-1"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          </motion.article>

          <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8">
            {rest.map((item, i) => (
              <motion.article
                key={item.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reduce ? 0 : 0.6, ease: [0.4, 0, 0.2, 1], delay: reduce ? 0 : 0.1 + i * 0.1 }}
                className="flex-1"
              >
                <Link
                  href={item.href}
                  className="group relative flex h-full gap-4 md:gap-5 overflow-hidden rounded-lg border border-gray-soft bg-black p-5 md:p-6 transition-all duration-500 ease-signature hover:-translate-y-1 hover:border-gold"
                >
                  <div className="hidden sm:block flex-shrink-0 w-32 md:w-44 self-stretch">
                    <BrandedPhoto
                      src={newsImages[i + 1]}
                      alt={item.title}
                      aspect="4/3"
                      sizes="(min-width: 1024px) 22vw, 30vw"
                      compact
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 min-w-0">
                    <span className="text-xs uppercase tracking-caption text-gold">
                      {item.date}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-white leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-light leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>
                    <div className="mt-auto inline-flex items-center gap-2 text-xs font-medium text-gold pt-1">
                      <span>{content.news.cta}</span>
                      <ArrowLeft
                        className="h-3 w-3 transition-transform duration-300 ease-signature group-hover:-translate-x-1"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Real photo with subtle on-brand treatment — desaturate slightly,
 * darken to integrate with black bg, layer a faint gold glow + dark
 * vertical gradient. Result reads as a refined editorial photo
 * instead of a raw stock image.
 */
function BrandedPhoto({
  src,
  alt,
  aspect,
  priority = false,
  sizes,
  compact = false,
}: {
  src: string;
  alt: string;
  aspect: string;
  priority?: boolean;
  sizes?: string;
  compact?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded bg-black-elevated h-full"
      style={{ aspectRatio: compact ? undefined : aspect }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? '50vw'}
        className="object-cover transition-transform duration-700 ease-signature group-hover:scale-[1.03]"
        style={{ filter: 'grayscale(0.25) contrast(1.08) brightness(0.85)' }}
      />
      {/* Gold tonal wash */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background: 'radial-gradient(60% 60% at 50% 60%, rgba(212, 175, 55, 0.18) 0%, rgba(10, 10, 10, 0) 100%)',
        }}
      />
      {/* Bottom dark gradient for legibility */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0) 60%)',
        }}
      />
    </div>
  );
}
