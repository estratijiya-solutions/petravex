'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { HeroContent, ScrollHint } from './HeroContent';
import { EntryCards } from './EntryCards';
import { HeroFallback } from './HeroFallback';

export type SceneRefs = {
  scrollRef: RefObject<number>;
  mouseRef: RefObject<{ x: number; y: number }>;
};

const JourneyScene = dynamic(() => import('@/components/three/JourneyScene'), {
  ssr: false,
  loading: () => <HeroFallback />,
});

/**
 * Decide whether to render the WebGL hero scene. Default ON — only fall
 * back to the static SVG when the user has explicitly opted out via
 * reduced-motion or save-data. Hardware/connection sniffing is
 * unreliable across browsers and was wrongly flagging healthy machines.
 */
function useShouldRender3D() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    type NavWithConn = Navigator & {
      connection?: { saveData?: boolean };
    };
    const conn = (navigator as NavWithConn).connection;
    const saveData = conn?.saveData === true;
    setEnabled(!reduceMotion && !saveData);
  }, []);

  return enabled;
}

export function Hero() {
  const render3D = useShouldRender3D();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;

    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sec = sectionRef.current;
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        // 0 when hero top is at viewport top, 1 when hero bottom passed viewport top
        const range = rect.height || 1;
        const scrolled = -rect.top;
        scrollRef.current = Math.max(0, Math.min(1, scrolled / range));
      });
    };

    const handleMouse = (e: MouseEvent) => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      // Normalize cursor to [-1, 1] within the hero bounds
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
      mouseRef.current.x = Math.max(-1, Math.min(1, nx));
      mouseRef.current.y = Math.max(-1, Math.min(1, ny));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pt-24 pb-32 md:pt-32 md:pb-24"
    >
      {render3D ? (
        <JourneyScene scrollRef={scrollRef} mouseRef={mouseRef} />
      ) : (
        <HeroFallback />
      )}

      <HeroContent />
      <EntryCards />
      <ScrollHint />
    </section>
  );
}
