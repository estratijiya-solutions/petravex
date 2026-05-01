'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { content } from '@/lib/content.ar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PatternBg } from '@/components/ui/PatternBg';
import { stepIcons } from '@/components/ui/StepIcons';

export function StoryTimeline() {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  // Hover state — lights up a step on cursor enter, restores on leave
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Drawn rail + active-step tracking
  useEffect(() => {
    if (reduce) return;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sec = sectionRef.current;
        const line = lineRef.current;
        if (!sec || !line) return;

        const rect = sec.getBoundingClientRect();
        const winH = window.innerHeight;
        const total = rect.height;
        const scrolled = clamp(winH - rect.top, 0, total + winH);
        const ratio = clamp(scrolled / total, 0, 1);
        line.style.transform = `scaleY(${ratio})`;

        // Determine active step — whichever step's chip is closest to viewport center
        const centerY = winH * 0.5;
        let nearest = 0;
        let nearestDist = Infinity;
        itemRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const itemCenter = r.top + r.height / 2;
          const dist = Math.abs(itemCenter - centerY);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = i;
          }
        });
        setActiveIdx(nearest);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative bg-black-soft py-24 md:py-32 border-y border-gray-soft overflow-hidden"
    >
      <PatternBg variant="arches" opacity={0.05} />

      {/* Soft radial spotlight following content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[600px] bg-gradient-radial from-gold/[0.04] via-transparent to-transparent"
      />

      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeader title={content.story.sectionTitle} />

        <div className="relative mt-24">
          {/* Static rail */}
          <div
            className="absolute top-0 bottom-0 w-px bg-gray-soft"
            style={{ insetInlineStart: '36px' }}
            aria-hidden
          />
          {/* Drawn (active) rail */}
          <div
            ref={lineRef}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold to-gold/40 origin-top"
            style={{
              insetInlineStart: '36px',
              transform: reduce ? 'scaleY(1)' : 'scaleY(0)',
            }}
            aria-hidden
          />

          <ol className="flex flex-col gap-16 md:gap-20">
            {content.story.steps.map((step, i) => {
              const Icon = stepIcons[i] ?? stepIcons[0];
              const isActive = activeIdx === i;
              const isHovered = hoveredIdx === i;
              // "Lit" combines scroll-based active state with hover state.
              // Either makes the step glow up.
              const isLit = isActive || isHovered;
              return (
                <motion.li
                  key={step.num}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx((prev) => (prev === i ? null : prev))}
                  className="group relative grid grid-cols-[72px_1fr] md:grid-cols-[72px_minmax(0,1fr)_120px] items-start gap-x-6 md:gap-x-10 cursor-default"
                >
                  {/* Step chip — large Cormorant numeral */}
                  <div className="relative flex justify-center">
                    {/* Glow halo, intensifies when lit (active or hovered) */}
                    <span
                      aria-hidden
                      className="absolute inset-[-12px] rounded-full bg-gold/20 blur-xl transition-opacity duration-700"
                      style={{ opacity: isLit ? 0.95 : 0.3 }}
                    />
                    {/* Hover-only inner shimmer — extra brightness on cursor */}
                    <span
                      aria-hidden
                      className="absolute inset-[-6px] rounded-full bg-gold/30 blur-md transition-opacity duration-500"
                      style={{ opacity: isHovered ? 0.7 : 0 }}
                    />
                    {/* Outer ring — thicker on hover */}
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full ring-1 transition-all duration-500"
                      style={{
                        boxShadow: isHovered
                          ? '0 0 0 6px rgba(212, 175, 55, 0.18)'
                          : isActive
                          ? '0 0 0 4px rgba(212, 175, 55, 0.12)'
                          : '0 0 0 0 rgba(212, 175, 55, 0)',
                      }}
                    />
                    {/* Number chip — scales up subtly on hover */}
                    <span
                      className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border bg-black-elevated font-display font-light leading-none transition-all duration-500 ease-signature"
                      style={{
                        borderColor: isLit ? '#D4AF37' : 'rgba(212, 175, 55, 0.45)',
                        color: '#D4AF37',
                        fontSize: '32px',
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                      }}
                    >
                      {step.num}
                    </span>
                  </div>

                  {/* Text content — title shifts subtly toward gold on hover.
                      A richer "story" paragraph reveals on hover, separated
                      by a thin gold rule that animates in. */}
                  <div className="flex flex-col gap-2 pt-3">
                    <h3
                      className="font-arabic text-2xl md:text-3xl font-bold leading-tight transition-colors duration-500 ease-signature"
                      style={{ color: isHovered ? '#F5DC83' : '#FFFFFF' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="font-arabic text-base md:text-lg max-w-xl leading-relaxed transition-colors duration-500 ease-signature"
                      style={{ color: isHovered ? '#D4D4D4' : '#B5B5B5' }}
                    >
                      {step.desc}
                    </p>

                    {/* Story panel — fades in on hover.
                        Animated max-height + opacity for smooth reveal. */}
                    <div
                      className="overflow-hidden transition-all duration-500 ease-signature"
                      style={{
                        maxHeight: isHovered ? '160px' : '0px',
                        opacity: isHovered ? 1 : 0,
                        marginTop: isHovered ? '12px' : '0px',
                      }}
                    >
                      {/* Thin gold accent line that grows in */}
                      <span
                        aria-hidden
                        className="block h-px bg-gradient-to-l from-gold/70 via-gold/40 to-transparent transition-all duration-700 ease-signature"
                        style={{
                          width: isHovered ? '64px' : '0px',
                          marginBottom: '10px',
                        }}
                      />
                      <p className="font-arabic text-sm md:text-[15px] text-gray-light/95 leading-loose max-w-xl">
                        {step.story}
                      </p>
                    </div>
                  </div>

                  {/* Step illustration — desktop only, fades up when lit */}
                  <div className="hidden md:flex items-start justify-center pt-2">
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isLit ? 1 : 0.35,
                        scale: isHovered ? 1.04 : isActive ? 1 : 0.92,
                      }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="relative h-[88px] w-[88px]"
                    >
                      {/* Soft tile bg — brightens on hover */}
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-lg backdrop-blur-[1px] transition-colors duration-500"
                        style={{
                          background: isHovered
                            ? 'rgba(212,175,55,0.10)'
                            : 'rgba(212,175,55,0.04)',
                        }}
                      />
                      {/* Ring becomes solid gold on hover */}
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-lg ring-1 transition-all duration-500"
                        style={{
                          boxShadow: isHovered
                            ? 'inset 0 0 0 1px rgba(212,175,55,0.6), 0 8px 32px -10px rgba(212,175,55,0.5)'
                            : 'inset 0 0 0 1px rgba(212,175,55,0.3)',
                        }}
                      />
                      <Icon className="absolute inset-0 m-auto text-gold w-14 h-14" />
                    </motion.div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
