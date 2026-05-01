'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A trailing gold ring that follows the cursor on hover-capable devices.
 * Expands when over interactive elements. Smoothed via rAF for buttery motion.
 * Hidden on touch devices and when the user prefers reduced motion.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);
  const isOver = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hoverable || reduced) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      isOver.current = !!t?.closest('a, button, [role="button"], input, textarea, select, label');
      if (ringRef.current) {
        ringRef.current.style.width = isOver.current ? '40px' : '24px';
        ringRef.current.style.height = isOver.current ? '40px' : '24px';
        ringRef.current.style.opacity = isOver.current ? '1' : '0.7';
      }
    };
    const onLeave = () => {
      target.current.x = -100;
      target.current.y = -100;
    };

    let raf = 0;
    const tick = () => {
      // Lerp toward target for smooth trailing
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[110] rounded-full border border-gold transition-[width,height,opacity] duration-200 ease-signature"
        style={{ width: '24px', height: '24px', opacity: 0.7, willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[110] h-1 w-1 rounded-full bg-gold"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
