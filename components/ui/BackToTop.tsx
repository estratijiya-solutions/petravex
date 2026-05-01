'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LogoMark } from './LogoMark';

/**
 * Circular back-to-top control with the Petravex P monogram inside.
 * Appears after the user scrolls past ~80% of the viewport height.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => setShow(window.scrollY > window.innerHeight * 0.8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="group fixed bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-black/80 backdrop-blur-md text-gold transition-all duration-300 ease-signature hover:border-gold hover:bg-black/90 hover:shadow-[0_0_28px_-6px_rgba(212,175,55,0.55)]"
          style={{ insetInlineEnd: '24px' }}
          aria-label="العودة إلى الأعلى"
        >
          <span
            aria-hidden
            className="absolute inset-1.5 rounded-full ring-1 ring-transparent transition-all duration-500 group-hover:ring-gold/60"
          />
          <LogoMark
            size={26}
            className="transition-transform duration-500 ease-signature group-hover:-translate-y-0.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
