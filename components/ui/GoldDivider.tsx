'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  delay?: number;
  width?: 'short' | 'medium' | 'full';
};

const widths = {
  short: 'w-16',
  medium: 'w-24 md:w-32',
  full: 'w-full',
};

export function GoldDivider({ className, delay = 0, width = 'medium' }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 1, scaleX: 1 } : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay }}
      className={cn(
        'h-px bg-gold origin-start',
        widths[width],
        className,
      )}
      aria-hidden
    />
  );
}
