'use client';

import { useEffect, useRef } from 'react';

/**
 * No-WebGL fallback. A single, stable stone — same brand metaphor as the
 * 3D version but rendered in SVG with only the most restrained motion
 * (a very gentle gold pulse + soft mouse parallax tilt). Used when the
 * browser blocks Canvas, when prefers-reduced-motion is on, or when
 * save-data is enabled. The fallback must feel calm and deliberate — it
 * is NOT a slideshow.
 */
export function HeroFallback() {
  const containerRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;

    let targetMx = 0;
    let targetMy = 0;
    let mx = 0;
    let my = 0;
    let targetHover = 0;
    let hover = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMx = (e.clientX / window.innerWidth) * 2 - 1;
      targetMy = (e.clientY / window.innerHeight) * 2 - 1;
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const inner = rect.width * 0.5;
      const outer = rect.width * 0.85;
      if (dist <= inner) targetHover = 1;
      else if (dist >= outer) targetHover = 0;
      else targetHover = 1 - (dist - inner) / (outer - inner);
    };
    const onMouseLeave = () => {
      targetMx = 0;
      targetMy = 0;
      targetHover = 0;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    const tick = () => {
      if (cancelled) return;

      // Smooth follow — heavy easing so motion feels heavy and intentional
      hover += (targetHover - hover) * 0.06;
      mx += (targetMx - mx) * 0.05;
      my += (targetMy - my) * 0.05;

      // Subtle parallax tilt only — no continuous rotation
      const tiltX = -my * 6; // ±6° vertical
      const tiltY = mx * 6;  // ±6° horizontal

      if (containerRef.current) {
        containerRef.current.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      }

      // Hover aura — soft gold halo brightens when cursor approaches
      if (auraRef.current) {
        auraRef.current.style.opacity = (0.25 + hover * 0.55).toFixed(3);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      {/* Soft radial halo behind the stone */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 30%, rgba(10,10,10,0) 65%)',
        }}
      />

      {/* Quiet star field — same as before, just decoration */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <g fill="#D4AF37">
          <circle cx="160" cy="120" r="1" opacity="0.5" />
          <circle cx="280" cy="200" r="0.8" opacity="0.4" />
          <circle cx="420" cy="80" r="1.1" opacity="0.55" />
          <circle cx="560" cy="160" r="0.9" opacity="0.45" />
          <circle cx="720" cy="100" r="1.2" opacity="0.6" />
          <circle cx="880" cy="220" r="0.8" opacity="0.4" />
          <circle cx="1020" cy="120" r="1" opacity="0.5" />
          <circle cx="1180" cy="180" r="0.9" opacity="0.45" />
          <circle cx="1340" cy="100" r="1.1" opacity="0.55" />
          <circle cx="1480" cy="200" r="0.8" opacity="0.4" />
        </g>
      </svg>

      {/* Stone position adapts to viewport:
          - Mobile: sits above the wordmark (top of hero), small + dim so
            it reads as a decorative crown, not a competing focal point.
          - Desktop: centered in the hero, large, full opacity — the
            visual centerpiece behind/around the wordmark. */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2">
        <div className="relative" style={{ perspective: '1600px', perspectiveOrigin: '50% 35%' }}>
          {/* Hover aura */}
          <div
            ref={auraRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[180px] w-[180px] md:h-[420px] md:w-[420px] -translate-x-1/2 -translate-y-1/2"
            style={{
              opacity: 0.25,
              background:
                'radial-gradient(circle, rgba(212,175,55,0.30) 0%, rgba(212,175,55,0.10) 32%, rgba(212,175,55,0) 65%)',
              filter: 'blur(14px)',
              transition: 'opacity 0.6s ease-out',
            }}
          />
          <div
            ref={containerRef}
            className="relative h-[120px] w-[120px] md:h-[340px] md:w-[340px] opacity-50 md:opacity-100"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              transition: 'transform 0.05s linear',
            }}
          >
            {/* Halo rings */}
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <circle cx="200" cy="200" r="180" stroke="#D4AF37" strokeOpacity="0.12" strokeWidth="1" fill="none" />
              <circle cx="200" cy="200" r="195" stroke="#D4AF37" strokeOpacity="0.06" strokeWidth="1" fill="none" />
            </svg>
            <StoneFace />
          </div>
        </div>
      </div>

      {/* Bottom black fade for text legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent"
      />
    </div>
  );
}

/**
 * Crystal/gem stone — 11-vertex polygon with multi-facet shading,
 * volumetric gradient, lit/shadow planes, highlight glint along the
 * top-right ridge, and three specular sparkles for gem shimmer.
 */
function StoneFace() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      <defs>
        <radialGradient id="stone-volume" cx="68%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stone-hi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5DC83" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="stone-depth" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="stone-glow" cx="50%" cy="50%" r="50%">
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="160" fill="url(#stone-glow)" stroke="none" />

      {/* Drop shadow */}
      <ellipse cx="200" cy="358" rx="120" ry="14" fill="#000000" opacity="0.40" stroke="none" />
      <ellipse cx="200" cy="358" rx="80" ry="8" fill="#000000" opacity="0.55" stroke="none" />

      {/* Soft halo bloom */}
      <g opacity="0.28" style={{ filter: 'blur(4px)' }} stroke="none">
        <polygon points="178,68 320,98 366,200 332,310 244,352 168,352 92,308 50,210 86,118" fill="#D4AF37" fillOpacity="0.5" />
      </g>

      {/* Crystal silhouette */}
      <polygon
        points="180,76 268,90 320,128 354,200 326,294 248,338 168,344 96,304 60,218 88,140 124,98"
        fill="url(#stone-volume)"
      />

      <polygon
        points="60,218 88,140 124,98 180,76 200,200 96,304"
        fill="url(#stone-depth)"
        stroke="none"
      />

      {/* Shadow facets */}
      <polygon points="180,76 60,218 96,304 168,344" fill="#000000" fillOpacity="0.30" stroke="none" />
      <polygon points="60,218 88,140 124,98 180,76" fill="#000000" fillOpacity="0.18" stroke="none" />
      <polygon points="96,304 168,344 200,200" fill="#000000" fillOpacity="0.13" stroke="none" />

      {/* Lit facets */}
      <polygon points="180,76 268,90 320,128 200,200" fill="#D4AF37" fillOpacity="0.30" stroke="none" />
      <polygon points="320,128 354,200 326,294 200,200" fill="#D4AF37" fillOpacity="0.20" stroke="none" />
      <polygon points="180,76 200,200 268,90" fill="#D4AF37" fillOpacity="0.16" stroke="none" />

      {/* Mid-tone bottom facet */}
      <polygon points="200,200 326,294 248,338 168,344" fill="#D4AF37" fillOpacity="0.09" stroke="none" />

      {/* Outline */}
      <polygon
        points="180,76 268,90 320,128 354,200 326,294 248,338 168,344 96,304 60,218 88,140 124,98"
        strokeWidth="2"
      />

      {/* Internal facet edges */}
      <line x1="180" y1="76" x2="200" y2="200" opacity="0.65" />
      <line x1="200" y1="200" x2="60" y2="218" opacity="0.50" />
      <line x1="200" y1="200" x2="354" y2="200" opacity="0.70" />
      <line x1="200" y1="200" x2="248" y2="338" opacity="0.50" />
      <line x1="200" y1="200" x2="168" y2="344" opacity="0.45" />
      <line x1="200" y1="200" x2="320" y2="128" opacity="0.65" />
      <line x1="200" y1="200" x2="96" y2="304" opacity="0.45" />

      {/* Highlight glint */}
      <line x1="180" y1="76" x2="320" y2="128" stroke="url(#stone-hi)" strokeWidth="4" opacity="0.9" />
      <line x1="186" y1="80" x2="270" y2="92" stroke="#FFE9A8" strokeWidth="1.5" opacity="0.8" />
      <line x1="320" y1="128" x2="354" y2="200" stroke="#F5DC83" strokeWidth="2" opacity="0.5" />

      {/* Specular sparkles */}
      <circle cx="244" cy="100" r="3.5" fill="#FFE9A8" stroke="none" opacity="0.9" />
      <circle cx="244" cy="100" r="9" fill="#D4AF37" stroke="none" opacity="0.40" />
      <circle cx="300" cy="140" r="2" fill="#FFE9A8" stroke="none" opacity="0.8" />
      <circle cx="300" cy="140" r="5" fill="#D4AF37" stroke="none" opacity="0.35" />
      <circle cx="270" cy="200" r="1.5" fill="#FFE9A8" stroke="none" opacity="0.65" />
    </svg>
  );
}
