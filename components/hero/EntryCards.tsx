'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { content } from '@/lib/content.ar';
import { BuyerIcon, SupplierIcon, CareerIcon } from '@/components/ui/EntryIcons';

const entries = [
  { ...content.entryCards.buyer, Icon: BuyerIcon, key: 'buyer' as const },
  { ...content.entryCards.supplier, Icon: SupplierIcon, key: 'supplier' as const },
  { ...content.entryCards.career, Icon: CareerIcon, key: 'career' as const },
];

function MagneticCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${x * 0.04}px, ${y * 0.04}px, 0)`;
  };
  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="h-full transition-transform duration-300 ease-signature will-change-transform"
    >
      {children}
    </div>
  );
}

export function EntryCards() {
  const reduce = useReducedMotion();
  return (
    <div className="relative z-10 mx-auto mt-14 md:mt-20 grid w-full max-w-6xl grid-cols-1 gap-4 px-6 md:grid-cols-3 md:gap-6 md:px-10">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.key}
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1],
            delay: 1.0 + i * 0.15,
          }}
        >
          <MagneticCard>
            <Link
              href={entry.href}
              className="group relative flex h-full min-h-[280px] md:min-h-[320px] flex-col overflow-hidden rounded-sm bg-black-soft/85 backdrop-blur-sm transition-all duration-500 ease-signature hover:-translate-y-2"
            >
              {/* Subtle base hairline border */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-gold/20 transition-opacity duration-500 group-hover:opacity-0"
              />
              {/* Animated gold gradient border on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(212,175,55,0.6), rgba(212,175,55,0.15) 50%, rgba(212,175,55,0.6))',
                  padding: '1px',
                  WebkitMask:
                    'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              {/* Inner glow + outer drop on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  boxShadow:
                    'inset 0 0 80px -30px rgba(212,175,55,0.28), 0 30px 60px -28px rgba(212,175,55,0.45)',
                }}
              />
              {/* Top accent stripe — animates left-to-right on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gold origin-start scale-x-0 transition-transform duration-500 ease-signature group-hover:scale-x-100"
              />

              <div className="relative flex h-full flex-col p-7 md:p-8">
                {/* Icon zone */}
                <div className="flex flex-col items-start gap-5 pb-7">
                  <entry.Icon className="text-gold transition-transform duration-500 ease-signature group-hover:-rotate-3 group-hover:scale-105" />
                  <span
                    aria-hidden
                    className="block h-px w-8 bg-gold/40 transition-all duration-500 ease-signature group-hover:w-16 group-hover:bg-gold"
                  />
                </div>

                {/* Text zone */}
                <div className="flex flex-1 flex-col gap-3">
                  <h3 className="font-arabic text-2xl md:text-[26px] font-bold text-white leading-tight">
                    {entry.title}
                  </h3>
                  <p className="font-arabic text-sm md:text-base text-gray-light leading-relaxed">
                    {entry.description}
                  </p>
                </div>

                {/* CTA — bottom plate with divider */}
                <div className="mt-7 flex items-center justify-between border-t border-gray-soft pt-5 transition-colors duration-500 ease-signature group-hover:border-gold/50">
                  <span className="font-arabic text-sm font-medium text-gold">
                    {entry.cta}
                  </span>
                  <ArrowLeft
                    className="h-4 w-4 text-gold transition-transform duration-500 ease-signature group-hover:-translate-x-1.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          </MagneticCard>
        </motion.div>
      ))}
    </div>
  );
}
