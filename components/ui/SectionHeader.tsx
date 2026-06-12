'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GoldDivider } from './GoldDivider';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  className?: string;
};

export function SectionHeader({ eyebrow, title, subtitle, align = 'center', className }: Props) {
  const reduce = useReducedMotion();
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-start items-start';
  // Build a transition that zeros out duration/delay when reduce is true.
  // Keeps `initial` deterministic on both server and client to avoid
  // hydration mismatches.
  const t = (duration: number, delay: number) => ({
    duration: reduce ? 0 : duration,
    ease: [0.4, 0, 0.2, 1] as const,
    delay: reduce ? 0 : delay,
  });
  return (
    <div className={cn('flex flex-col gap-4', alignClass, className)}>
      <GoldDivider width="short" />
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={t(0.6, 0.2)}
          className="text-xs tracking-caption text-gold uppercase"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={t(0.7, 0.3)}
        className="text-h2-mobile md:text-h2-desktop text-white arabic-balance"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={t(0.7, 0.45)}
          className="text-base md:text-lg text-gray-light max-w-2xl arabic-balance"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
