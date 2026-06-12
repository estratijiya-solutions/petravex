'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useContent } from '@/lib/content';
import { toArabicNumerals } from '@/lib/utils';
import { PatternBg } from '@/components/ui/PatternBg';
import { isRtl } from '@/i18n';

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const content = useContent();
  const locale = useLocale();
  const rtl = isRtl(locale);

  return (
    <section id="stats" className="relative bg-black py-24 md:py-32 overflow-hidden">
      <PatternBg variant="chevrons" opacity={0.04} />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-0">
          {content.stats.items.map((stat, i) => (
            <StatItem
              key={i}
              target={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              animate={inView}
              delay={i * 0.1}
              isLast={i === content.stats.items.length - 1}
              useArabicNumerals={rtl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type StatItemProps = {
  target: number;
  suffix: string;
  label: string;
  animate: boolean;
  delay: number;
  isLast: boolean;
  useArabicNumerals: boolean;
};

function StatItem({ target, suffix, label, animate: shouldAnimate, delay, isLast, useArabicNumerals }: StatItemProps) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce || !shouldAnimate ? target : 0);

  useEffect(() => {
    if (reduce) {
      setValue(target);
      return;
    }
    if (!shouldAnimate) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.4, 0, 0.2, 1],
      delay,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [shouldAnimate, target, delay, reduce]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduce ? 0 : 0.6, ease: [0.4, 0, 0.2, 1], delay: reduce ? 0 : delay }}
      className={
        // Equal-height number row + equal-height label row across all cells.
        // No padding hacks — real layout via fixed heights inside the cell.
        'relative flex flex-col items-center text-center ' +
        (isLast ? '' : 'md:after:absolute md:after:top-4 md:after:bottom-4 md:after:start-full md:after:w-px md:after:bg-gold/15')
      }
    >
      <div className="flex h-[68px] md:h-[88px] items-end justify-center">
        <span
          className="font-display font-light text-gold leading-none"
          style={{ fontSize: 'clamp(52px, 8vw, 80px)' }}
        >
          {useArabicNumerals ? toArabicNumerals(value) : value.toLocaleString('en-US')}
          {suffix && <span>{suffix}</span>}
        </span>
      </div>
      <div className="mt-3 flex min-h-[44px] md:min-h-[48px] max-w-[160px] items-start justify-center">
        <span className="text-xs md:text-sm text-gray-light tracking-caption uppercase leading-relaxed">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
