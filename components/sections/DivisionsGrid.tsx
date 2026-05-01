'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { content } from '@/lib/content.ar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { divisionIcons } from '@/components/ui/DivisionIcons';

export function DivisionsGrid() {
  const reduce = useReducedMotion();

  return (
    <section id="divisions" className="relative bg-black py-24 md:py-32 overflow-hidden">
      {/* Subtle radial accent — gold light pool from top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-radial from-gold/[0.05] via-transparent to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          title={content.divisions.sectionTitle}
          subtitle={content.divisions.sectionSubtitle}
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 lg:grid-cols-4 lg:gap-7">
          {content.divisions.items.map((d, i) => {
            const Icon = divisionIcons[d.key as keyof typeof divisionIcons];
            return (
              <motion.div
                key={d.key}
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: i * 0.06 }}
              >
                <Link
                  href={d.href}
                  className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-lg bg-black-soft p-6 md:p-7 transition-all duration-500 ease-signature hover:-translate-y-1.5"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-lg ring-1 ring-gray-soft transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <ClockwiseBorder />

                  <Icon className="relative text-gold transition-transform duration-500 ease-signature group-hover:-rotate-3 group-hover:scale-105" />

                  <div className="relative flex flex-col gap-1">
                    <h3 className="font-arabic text-base md:text-lg font-bold text-white">
                      {d.name}
                    </h3>
                    <p className="font-arabic text-xs text-gray-light tracking-wide">
                      {d.location}
                    </p>
                  </div>

                  <div className="relative mt-auto flex items-center gap-2 text-xs text-gold font-arabic">
                    <span className="opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                      التفاصيل
                    </span>
                    <ArrowLeft
                      className="h-3 w-3 transition-transform duration-300 ease-signature group-hover:-translate-x-1"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <Button href="/group" variant="primary">
            {content.divisions.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}

function ClockwiseBorder() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 left-0 h-px bg-gold origin-start scale-x-0 transition-transform duration-300 ease-signature group-hover:scale-x-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 bottom-0 w-px bg-gold origin-top scale-y-0 transition-transform duration-300 ease-signature delay-[200ms] group-hover:scale-y-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gold origin-end scale-x-0 transition-transform duration-300 ease-signature delay-[400ms] group-hover:scale-x-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 top-0 w-px bg-gold origin-bottom scale-y-0 transition-transform duration-300 ease-signature delay-[600ms] group-hover:scale-y-100"
      />
    </>
  );
}
