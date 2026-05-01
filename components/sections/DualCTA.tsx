'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { content } from '@/lib/content.ar';
import { GoldDivider } from '@/components/ui/GoldDivider';

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

const cards = [
  {
    ...content.dualCta.supplier,
    key: 'supplier' as const,
    // Warehouse / stacked materials — supplier context
    image: UNSPLASH('1553413077-190dd305871c'),
  },
  {
    ...content.dualCta.buyer,
    key: 'buyer' as const,
    // Dubai skyline at sunset — Burj Khalifa unmistakable, verified UAE
    image: UNSPLASH('1512453979798-5ea266f8880c'),
  },
];

export function DualCTA() {
  const reduce = useReducedMotion();
  return (
    <section id="cta" className="relative bg-black py-24 md:py-32 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: i * 0.1 }}
          >
            <Link
              href={card.href}
              className="group relative block aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-lg border border-gray-soft bg-black-soft transition-all duration-500 ease-signature hover:border-gold"
            >
              {/* Real photo with branded treatment */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-1000 ease-signature group-hover:scale-105"
                style={{ filter: 'grayscale(0.3) contrast(1.08) brightness(0.78)' }}
              />
              {/* Gold radial wash */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-overlay"
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 60%, rgba(212, 175, 55, 0.2) 0%, rgba(10, 10, 10, 0) 100%)',
                }}
              />
              {/* Dark gradient overlay for legibility */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 transition-opacity duration-500 ease-signature group-hover:from-black/95 group-hover:via-black/65"
              />

              <div className="relative flex h-full flex-col justify-end p-8 md:p-10 gap-5">
                <GoldDivider width="short" />
                <h3 className="font-arabic text-h2-mobile md:text-h2-desktop font-bold text-white arabic-balance leading-tight">
                  {card.title}
                </h3>
                <p className="font-arabic text-base md:text-lg text-gray-light max-w-md arabic-balance">
                  {card.desc}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 font-arabic text-sm font-medium text-gold">
                  <span>{card.cta}</span>
                  <ArrowLeft
                    className="h-4 w-4 transition-transform duration-300 ease-signature group-hover:-translate-x-1"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
