'use client';

import { useEffect, useRef } from 'react';

/**
 * Hairline gold progress bar pinned to the top of the viewport.
 * Fills from the start side as the user scrolls. Driven by rAF.
 */
export function ScrollProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        const ratio =
          total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0;
        if (ref.current) {
          ref.current.style.transform = `scaleX(${ratio})`;
        }
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      aria-hidden
      ref={ref}
      className="fixed top-0 inset-x-0 z-[55] h-px bg-gradient-to-l from-transparent via-gold to-gold origin-end"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
