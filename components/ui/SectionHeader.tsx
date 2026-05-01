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
  return (
    <div className={cn('flex flex-col gap-4', alignClass, className)}>
      <GoldDivider width="short" />
      {eyebrow && (
        <motion.span
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className="font-arabic text-xs tracking-caption text-gold uppercase"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        className="font-arabic text-h2-mobile md:text-h2-desktop text-white arabic-balance"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.45 }}
          className="font-arabic text-base md:text-lg text-gray-light max-w-2xl arabic-balance"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
