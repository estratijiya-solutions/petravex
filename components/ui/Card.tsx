'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
  href?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
  interactive?: boolean;
};

export function Card({ href, className, children, delay = 0, interactive = true }: Props) {
  const reduce = useReducedMotion();
  const innerClass = cn(
    'relative block overflow-hidden rounded-lg border border-gold/40 bg-black-soft',
    'transition-[border-color,transform,box-shadow] duration-300 ease-signature',
    interactive &&
      'hover:border-gold hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(212,175,55,0.45)]',
    className,
  );

  const content = (
    <motion.div
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay }}
      className={innerClass}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg">
        {content}
      </Link>
    );
  }
  return content;
}
