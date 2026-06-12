'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useContent } from '@/lib/content';

const SIGNATURE_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * Hero text stack. The `useReducedMotion` hook returns `null` on the
 * server and a boolean on the client — branching `initial` on it caused
 * a hydration mismatch (server: opacity:0 / client: opacity:1).
 *
 * Fix: keep `initial` deterministic on both sides, and zero out the
 * transition duration when the user prefers reduced motion. Animations
 * still complete instantly when reduced is preferred.
 */
export function HeroContent() {
  const reduce = useReducedMotion();
  const content = useContent();
  const t = (duration: number, delay = 0) => ({
    duration: reduce ? 0 : duration,
    ease: SIGNATURE_EASE,
    delay: reduce ? 0 : delay,
  });

  return (
    <div className="relative z-10 flex flex-col items-center text-center gap-6 md:gap-8 px-6 max-w-4xl mx-auto">
      {/* Latin eyebrow stamp — restrained luxury */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.7, 0.1)}
        className="font-display text-gold/70 text-[10px] md:text-xs uppercase"
        style={{ letterSpacing: '0.5em', paddingInlineStart: '0.5em' }}
      >
        Petravex Group · UAE
      </motion.div>

      {/* Wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.9, 0.25)}
        className="font-display rtl:font-arabic text-gold text-5xl md:text-7xl lg:text-[88px] font-light tracking-[0.15em] rtl:tracking-wide leading-none"
      >
        {content.hero.wordmark}
      </motion.div>

      {/* H1 tagline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.9, 0.5)}
        className="font-display rtl:font-arabic font-bold rtl:font-extrabold text-white text-h1-mobile md:text-h1-desktop arabic-balance leading-tight"
      >
        {content.hero.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.8, 0.75)}
        className="font-body rtl:font-arabic text-base md:text-lg text-gray-light max-w-2xl"
      >
        {content.hero.subtitle}
      </motion.p>
    </div>
  );
}

export function ScrollHint() {
  const reduce = useReducedMotion();
  const content = useContent();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: reduce ? 0 : 0.8,
        ease: SIGNATURE_EASE,
        delay: reduce ? 0 : 1.4,
      }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gray-light"
      aria-hidden
    >
      <span className="text-xs tracking-caption uppercase">
        {content.hero.scrollHint}
      </span>
      <motion.div
        animate={reduce ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-5 w-5 text-gold" strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
}
