'use client';

import { useEffect, useRef } from 'react';

/**
 * Hero hero is split in two:
 *   • <HeroBackdrop /> — absolute-positioned background (vignette + stars
 *     + bottom legibility fade). Sits at -z-10 behind everything.
 *   • <HeroTurntable /> — the rotating 3-form centerpiece (stone → bag
 *     → skyscraper), now rendered in normal flow ABOVE the wordmark
 *     instead of behind it. Avoids the "gold on gold" mush that
 *     happened when the gold wordmark sat over the gold rotating form.
 *
 * The cycle IS the brand metaphor: raw material → product → built future
 * ("من الحجر إلى ناطحات السحاب"). 36s period, plateau + ramp opacity so
 * each form gets a long stable beat with a snappy cross-fade between.
 */
export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black" aria-hidden>
      {/* Soft radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.04) 35%, rgba(10,10,10,0) 70%)',
        }}
      />
      {/* Quiet star field */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
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
      {/* Bottom legibility fade — keeps long-form copy below readable
          even when the rotating form's halo bleeds downward. */}
      <div
        className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent"
      />
    </div>
  );
}

export function HeroTurntable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const faceRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const start = performance.now();
    const periodMs = 36000; // slightly slower full rotation — let each form linger
    const targets = [0, 120, 240];

    let targetMx = 0;
    let targetMy = 0;
    let mx = 0;
    let my = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMx = (e.clientX / window.innerWidth) * 2 - 1;
      targetMy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onMouseLeave = () => {
      targetMx = 0;
      targetMy = 0;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const angle = (elapsed / periodMs) * 360;

      mx += (targetMx - mx) * 0.06;
      my += (targetMy - my) * 0.06;

      const tiltX = -my * 12;
      const yawOffset = mx * 8;

      if (containerRef.current) {
        containerRef.current.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${(angle + yawOffset).toFixed(2)}deg)`;
      }

      const els = faceRefs.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        el.style.opacity = String(faceOpacity(angle + yawOffset, targets[i]));
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

  const setFaceRef = (idx: number) => (el: HTMLDivElement | null) => {
    faceRefs.current[idx] = el;
  };

  return (
    <div
      className="pointer-events-none flex justify-center"
      style={{ perspective: '1600px', perspectiveOrigin: '50% 35%' }}
      aria-hidden
    >
      <div
        ref={containerRef}
        className="relative h-[200px] w-[200px] sm:h-[240px] sm:w-[240px] md:h-[300px] md:w-[300px] lg:h-[360px] lg:w-[360px]"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Halo rings — symmetrical so always visible regardless of rotation */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <circle cx="200" cy="200" r="180" stroke="#D4AF37" strokeOpacity="0.15" strokeWidth="1" fill="none" />
          <circle cx="200" cy="200" r="195" stroke="#D4AF37" strokeOpacity="0.07" strokeWidth="1" fill="none" />
        </svg>

        {/* FACE 1: STONE (rotateY 0°) */}
        <div
          ref={setFaceRef(0)}
          className="absolute inset-0"
          style={{
            transform: 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            opacity: 1,
          }}
        >
          <StoneFace />
        </div>

        {/* FACE 2: CEMENT BAG (rotateY -120°) */}
        <div
          ref={setFaceRef(1)}
          className="absolute inset-0"
          style={{
            transform: 'rotateY(-120deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            opacity: 0,
          }}
        >
          <BagFace />
        </div>

        {/* FACE 3: SKYSCRAPER (rotateY -240°) */}
        <div
          ref={setFaceRef(2)}
          className="absolute inset-0"
          style={{
            transform: 'rotateY(-240deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            opacity: 0,
          }}
        >
          <BuildingFace />
        </div>
      </div>
    </div>
  );
}

/**
 * Plateau + ramp fade with partition-of-unity. Each face stays fully
 * visible for `plateau°` around its target, then smoothly ramps down
 * via raised-cosine over `ramp°`, fully invisible beyond.
 *
 * Tuned so adjacent face ramps OVERLAP across the midpoint between
 * targets — at angle 60° between stone (0°) and bag (120°), each face
 * contributes 0.5 (sum = 1) instead of both being zero. Compared to
 * the original wide cosine window (halfWidth = 100°, all three forms
 * muddied together), this gives:
 *   • A long plateau where exactly ONE form is fully visible — cleaner
 *   • A fast ramp transition where exactly TWO forms cross-fade —
 *     no third form bleeding in
 * The full rotation feels slower (longer plateaus), the changeover
 * between forms feels snappier (shorter ramp + no third-face muddiness).
 */
function faceOpacity(currentAngle: number, target: number, plateau = 30, ramp = 60) {
  let d = (currentAngle - target) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  const ad = Math.abs(d);
  if (ad <= plateau) return 1;
  if (ad >= plateau + ramp) return 0;
  const t = (ad - plateau) / ramp;
  return (1 + Math.cos(t * Math.PI)) / 2;
}

/* ── FACE 1 — Stone ────────────────────────────────────────────────── */
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
      <ellipse cx="200" cy="358" rx="120" ry="14" fill="#000000" opacity="0.40" stroke="none" />
      <ellipse cx="200" cy="358" rx="80" ry="8" fill="#000000" opacity="0.55" stroke="none" />

      <g opacity="0.28" style={{ filter: 'blur(4px)' }} stroke="none">
        <polygon points="178,68 320,98 366,200 332,310 244,352 168,352 92,308 50,210 86,118" fill="#D4AF37" fillOpacity="0.5" />
      </g>

      <polygon
        points="180,76 268,90 320,128 354,200 326,294 248,338 168,344 96,304 60,218 88,140 124,98"
        fill="url(#stone-volume)"
      />
      <polygon
        points="60,218 88,140 124,98 180,76 200,200 96,304"
        fill="url(#stone-depth)"
        stroke="none"
      />

      <polygon points="180,76 60,218 96,304 168,344" fill="#000000" fillOpacity="0.30" stroke="none" />
      <polygon points="60,218 88,140 124,98 180,76" fill="#000000" fillOpacity="0.18" stroke="none" />
      <polygon points="96,304 168,344 200,200" fill="#000000" fillOpacity="0.13" stroke="none" />

      <polygon points="180,76 268,90 320,128 200,200" fill="#D4AF37" fillOpacity="0.30" stroke="none" />
      <polygon points="320,128 354,200 326,294 200,200" fill="#D4AF37" fillOpacity="0.20" stroke="none" />
      <polygon points="180,76 200,200 268,90" fill="#D4AF37" fillOpacity="0.16" stroke="none" />
      <polygon points="200,200 326,294 248,338 168,344" fill="#D4AF37" fillOpacity="0.09" stroke="none" />

      <polygon
        points="180,76 268,90 320,128 354,200 326,294 248,338 168,344 96,304 60,218 88,140 124,98"
        strokeWidth="2"
      />

      {/* ── Internal facet edges, SHORTENED so they radiate from the
            stone's center toward each vertex but TERMINATE at the logo's
            outer perimeter (a 92×92 square frame at the center, 4px
            clearance around the 84×84 logo PNG). The lines reach the
            logo and stop — they don't pass through or under it.
            Endpoints computed via square-frame intersection:
              d = 46 / max(|cos θ|, |sin θ|)
            where 46 = half-extent of the clearance frame. */}
      <line x1="180" y1="76" x2="192.6" y2="154" opacity="0.65" />
      <line x1="154" y1="205.9" x2="60" y2="218" opacity="0.50" />
      <line x1="246" y1="200" x2="354" y2="200" opacity="0.70" />
      <line x1="216" y1="246" x2="248" y2="338" opacity="0.50" />
      <line x1="189.8" y1="246" x2="168" y2="344" opacity="0.45" />
      <line x1="246" y1="172.4" x2="320" y2="128" opacity="0.65" />
      <line x1="154" y1="246" x2="96" y2="304" opacity="0.45" />

      {/* ── Official Petravex P monogram, sitting ON TOP of the facet
            lines. With the lines now stopping at the logo's perimeter,
            the logo can render last (z-order: top) without anything
            crossing it. Visual effect: facet lines radiate outward from
            the center, reach the logo's edge, and terminate there — the
            logo is the convergence point. */}
      <image
        href="/logo.png"
        x="158"
        y="160"
        width="84"
        height="84"
        preserveAspectRatio="xMidYMid meet"
        opacity="0.95"
      />

      <line x1="180" y1="76" x2="320" y2="128" stroke="url(#stone-hi)" strokeWidth="4" opacity="0.9" />
      <line x1="186" y1="80" x2="270" y2="92" stroke="#FFE9A8" strokeWidth="1.5" opacity="0.8" />
      <line x1="320" y1="128" x2="354" y2="200" stroke="#F5DC83" strokeWidth="2" opacity="0.5" />

      <circle cx="244" cy="100" r="3.5" fill="#FFE9A8" stroke="none" opacity="0.9" />
      <circle cx="244" cy="100" r="9" fill="#D4AF37" stroke="none" opacity="0.40" />
      <circle cx="300" cy="140" r="2" fill="#FFE9A8" stroke="none" opacity="0.8" />
      <circle cx="300" cy="140" r="5" fill="#D4AF37" stroke="none" opacity="0.35" />
      <circle cx="270" cy="200" r="1.5" fill="#FFE9A8" stroke="none" opacity="0.65" />
    </svg>
  );
}

/* ── FACE 2 — Cement Bag (with embedded /logo.png) ────────────────── */
function BagFace() {
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
        <linearGradient id="bag-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
        </linearGradient>
      </defs>

      {/* Soft halo behind */}
      <g opacity="0.22" style={{ filter: 'blur(3px)' }}>
        <path d="M 96 76 Q 96 66 108 66 H 292 Q 304 66 304 76 V 326 Q 304 334 296 334 H 104 Q 96 334 96 326 Z" />
      </g>

      {/* Bag body */}
      <path
        d="M 102 76 Q 100 68 110 68 H 290 Q 300 68 298 76 L 304 326 Q 304 336 294 336 H 106 Q 96 336 96 326 Z"
        fill="url(#bag-body)"
      />
      <path d="M 102 76 Q 100 68 110 68 H 290 Q 300 68 298 76 L 304 326 Q 304 336 294 336 H 106 Q 96 336 96 326 Z" />

      {/* Top heat-sealed strip */}
      <path d="M 110 70 Q 110 64 116 64 H 284 Q 290 64 290 70 V 92 H 110 Z" opacity="0.92" />
      <line x1="118" y1="78" x2="282" y2="78" strokeWidth="0.7" opacity="0.5" />
      <line x1="118" y1="86" x2="282" y2="86" strokeWidth="0.7" opacity="0.5" />

      {/* Stitch dots */}
      {[124, 144, 164, 184, 204, 224, 244, 264, 280].map((x) => (
        <circle key={x} cx={x} cy="74" r="0.9" fill="#D4AF37" stroke="none" opacity="0.7" />
      ))}

      {/* Bottom band */}
      <path d="M 100 308 H 304 V 326 Q 304 336 294 336 H 106 Q 96 336 96 326 Z" opacity="0.92" />
      <line x1="108" y1="320" x2="296" y2="320" strokeWidth="0.6" opacity="0.5" />

      {/* Paper-grain hint */}
      <g opacity="0.13">
        <line x1="140" y1="100" x2="140" y2="304" strokeWidth="0.5" />
        <line x1="170" y1="100" x2="170" y2="304" strokeWidth="0.5" />
        <line x1="200" y1="100" x2="200" y2="304" strokeWidth="0.5" />
        <line x1="230" y1="100" x2="230" y2="304" strokeWidth="0.5" />
        <line x1="260" y1="100" x2="260" y2="304" strokeWidth="0.5" />
      </g>

      {/* Side gusset folds */}
      <line x1="116" y1="94" x2="116" y2="308" strokeDasharray="2 4" opacity="0.30" strokeWidth="0.8" />
      <line x1="284" y1="94" x2="284" y2="308" strokeDasharray="2 4" opacity="0.30" strokeWidth="0.8" />

      {/* Highlight on left edge */}
      <line x1="106" y1="98" x2="106" y2="320" stroke="#FFE9A8" strokeOpacity="0.55" strokeWidth="2" />
      <line x1="112" y1="98" x2="112" y2="320" stroke="#F5DC83" strokeOpacity="0.25" strokeWidth="1" />

      {/* Depth band on right edge */}
      <rect x="290" y="92" width="14" height="234" fill="#000000" fillOpacity="0.45" stroke="none" />
      <line x1="294" y1="98" x2="294" y2="320" stroke="#000000" strokeOpacity="0.55" strokeWidth="1.2" />
      <line x1="298" y1="98" x2="298" y2="320" stroke="#000000" strokeOpacity="0.4" strokeWidth="0.8" />

      {/* Bottom shadow */}
      <ellipse cx="200" cy="346" rx="100" ry="6" fill="#000000" opacity="0.5" stroke="none" />

      {/* OFFICIAL Petravex logo embedded */}
      <image
        href="/logo.png"
        x="148"
        y="124"
        width="104"
        height="104"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Brand wordmark */}
      <text
        x="200"
        y="252"
        textAnchor="middle"
        fontSize="14"
        fontFamily="serif"
        fontWeight="700"
        fill="#D4AF37"
        stroke="none"
        letterSpacing="3"
      >
        PETRAVEX
      </text>
      <line x1="156" y1="262" x2="244" y2="262" strokeWidth="0.7" opacity="0.5" />

      {/* Weight badge */}
      <g transform="translate(248, 105)">
        <rect x="0" y="0" width="36" height="20" strokeWidth="1.2" rx="1" />
        <text x="18" y="14" textAnchor="middle" fontSize="10" fontFamily="serif" fontWeight="700" fill="#D4AF37" stroke="none">
          50KG
        </text>
      </g>

      {/* Tear notch */}
      <path d="M 110 290 L 124 285 L 124 295 Z" strokeWidth="0.8" opacity="0.45" />
    </svg>
  );
}

/* ── FACE 3 — Art Deco Skyscraper ─────────────────────────────────── */
function BuildingFace() {
  const tiers = [
    { x: 102, y: 348, w: 196, h: 22 },
    { x: 116, y: 332, w: 168, h: 16 },
    { x: 138, y: 152, w: 124, h: 180 },
    { x: 150, y: 130, w: 100, h: 22 },
    { x: 162, y: 108, w: 76, h: 22 },
    { x: 174, y: 88, w: 52, h: 20 },
    { x: 188, y: 64, w: 24, h: 24 },
  ];
  const spire = { x: 196, y: 32, w: 8, h: 32 };
  const foundation = { x: 90, y: 370, w: 220, h: 14 };

  const floorLines = tiers.flatMap((t, ti) => {
    const count = Math.max(2, Math.floor(t.h / 10));
    const ys: number[] = [];
    for (let j = 1; j < count; j++) ys.push(t.y + (j * t.h) / count);
    return ys.map((y) => ({ key: `${ti}-${y}`, x1: t.x, x2: t.x + t.w, y }));
  });

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
        <linearGradient id="tower-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
        </linearGradient>
        <radialGradient id="tower-glow" cx="50%" cy="50%" r="50%">
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="160" fill="url(#tower-glow)" stroke="none" />

      {/* Soft halo silhouette */}
      <g opacity="0.22" style={{ filter: 'blur(3px)' }}>
        <path d="M 90 384 V 370 H 102 V 348 H 116 V 332 H 138 V 152 H 150 V 130 H 162 V 108 H 174 V 88 H 188 V 64 H 196 V 32 H 204 V 64 H 212 V 88 H 226 V 108 H 238 V 130 H 250 V 152 H 262 V 332 H 284 V 348 H 298 V 370 H 310 V 384 Z" />
      </g>

      {/* Foundation */}
      <rect x={foundation.x} y={foundation.y} width={foundation.w} height={foundation.h} fill="url(#tower-grad)" />

      {/* Stepped tiers */}
      {tiers.map((t, i) => (
        <rect key={`tier-${i}`} x={t.x} y={t.y} width={t.w} height={t.h} fill="url(#tower-grad)" />
      ))}

      {/* Spire shaft */}
      <rect x={spire.x} y={spire.y} width={spire.w} height={spire.h} fill="url(#tower-grad)" />

      {/* Crisp full silhouette outline */}
      <path
        d="M 90 384 V 370 H 102 V 348 H 116 V 332 H 138 V 152 H 150 V 130 H 162 V 108 H 174 V 88 H 188 V 64 H 196 V 32 H 204 V 64 H 212 V 88 H 226 V 108 H 238 V 130 H 250 V 152 H 262 V 332 H 284 V 348 H 298 V 370 H 310 V 384 Z"
        strokeWidth="1.6"
      />

      {/* Floor lines per tier */}
      {floorLines.map((fl) => (
        <line key={fl.key} x1={fl.x1} y1={fl.y} x2={fl.x2} y2={fl.y} strokeWidth="0.6" opacity="0.32" />
      ))}

      {/* Right-edge depth bands */}
      {tiers.map((t, i) => (
        <rect key={`depth-${i}`} x={t.x + t.w - 4} y={t.y} width="4" height={t.h} fill="#000000" fillOpacity="0.50" stroke="none" />
      ))}
      <rect x={spire.x + spire.w - 1} y={spire.y} width="1" height={spire.h} fill="#000000" fillOpacity="0.6" stroke="none" />
      <rect x={foundation.x + foundation.w - 8} y={foundation.y} width="8" height={foundation.h} fill="#000000" fillOpacity="0.5" stroke="none" />

      {/* Left-edge highlights */}
      {tiers.map((t, i) => (
        <line key={`hl-${i}`} x1={t.x} y1={t.y} x2={t.x} y2={t.y + t.h} stroke="#FFE9A8" strokeOpacity="0.5" strokeWidth="1.4" />
      ))}
      <line x1={spire.x} y1={spire.y} x2={spire.x} y2={spire.y + spire.h} stroke="#FFE9A8" strokeOpacity="0.6" strokeWidth="0.8" />

      {/* Vertical fluting on main body */}
      <line x1="156" y1="152" x2="156" y2="332" opacity="0.4" strokeWidth="0.7" />
      <line x1="172" y1="152" x2="172" y2="332" opacity="0.32" strokeWidth="0.7" />
      <line x1="186" y1="152" x2="186" y2="332" opacity="0.32" strokeWidth="0.7" />
      <line x1="200" y1="64" x2="200" y2="332" opacity="0.4" strokeWidth="0.7" />
      <line x1="214" y1="152" x2="214" y2="332" opacity="0.32" strokeWidth="0.7" />
      <line x1="228" y1="152" x2="228" y2="332" opacity="0.32" strokeWidth="0.7" />
      <line x1="244" y1="152" x2="244" y2="332" opacity="0.4" strokeWidth="0.7" />

      {/* Floor divisions on main body */}
      {[166, 180, 194, 208, 222, 236, 250, 264, 278, 292, 306, 320].map((y) => (
        <line key={`floor-${y}`} x1="138" y1={y} x2="262" y2={y} strokeWidth="0.5" opacity="0.28" />
      ))}

      {/* Crown tier bands */}
      <line x1="150" y1="142" x2="250" y2="142" strokeWidth="0.7" opacity="0.5" />
      <line x1="162" y1="120" x2="238" y2="120" strokeWidth="0.6" opacity="0.5" />
      <line x1="174" y1="100" x2="226" y2="100" strokeWidth="0.6" opacity="0.5" />

      {/* Decorative crown arches */}
      <path d="M 162 142 Q 170 132 178 142" strokeWidth="0.6" opacity="0.55" fill="none" />
      <path d="M 184 142 Q 192 132 200 142" strokeWidth="0.6" opacity="0.55" fill="none" />
      <path d="M 200 142 Q 208 132 216 142" strokeWidth="0.6" opacity="0.55" fill="none" />
      <path d="M 222 142 Q 230 132 238 142" strokeWidth="0.6" opacity="0.55" fill="none" />

      {/* Spire antenna band */}
      <line x1="195" y1="48" x2="205" y2="48" strokeWidth="1" opacity="0.75" />
      <circle cx="200" cy="48" r="1.6" fill="#D4AF37" opacity="0.6" stroke="none" />

      {/* Lit windows */}
      {[
        [162, 162], [222, 162],
        [192, 176], [232, 176],
        [162, 190], [192, 190], [222, 190],
        [232, 204], [202, 204],
        [162, 218], [192, 218], [232, 218],
        [202, 232], [172, 232],
        [162, 246], [222, 246],
        [192, 260], [232, 260],
        [162, 274], [202, 274], [232, 274],
        [172, 288], [222, 288],
        [162, 302], [202, 302], [232, 302],
        [192, 316],
        [124, 358], [160, 358], [200, 358], [240, 358], [276, 358],
        [128, 340], [170, 340], [230, 340], [272, 340],
        [168, 138], [200, 138], [232, 138],
        [180, 116], [200, 116], [220, 116],
        [192, 96], [208, 96],
      ].map(([x, y], i) => (
        <rect key={`w-${i}`} x={x} y={y} width="3.5" height="4.5" fill="#D4AF37" stroke="none" opacity="0.92" />
      ))}

      {/* Petravex corporate signage on the main facade — illuminated logo
          panel sized to fit between the fluting pilasters. A subtle gold
          glow halo behind it sells the "lit at night" feel. */}
      <circle cx="200" cy="200" r="28" fill="#D4AF37" opacity="0.18" stroke="none" />
      <circle cx="200" cy="200" r="20" fill="#D4AF37" opacity="0.10" stroke="none" />
      <rect x="173" y="173" width="54" height="54" fill="#0A0A0A" stroke="#D4AF37" strokeWidth="0.6" opacity="0.85" />
      <image
        href="/logo.png"
        x="176"
        y="176"
        width="48"
        height="48"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Pinnacle antenna + glow */}
      <line x1="200" y1="32" x2="200" y2="14" strokeWidth="1.2" opacity="1" />
      <line x1="200" y1="14" x2="200" y2="6" strokeWidth="0.7" opacity="0.85" />
      <circle cx="200" cy="5" r="2.5" fill="#FFE9A8" stroke="none" opacity="1" />
      <circle cx="200" cy="5" r="6" fill="#D4AF37" stroke="none" opacity="0.55" />
      <circle cx="200" cy="5" r="10" fill="#D4AF37" stroke="none" opacity="0.22" />

      {/* Drop shadow */}
      <ellipse cx="200" cy="395" rx="135" ry="5" fill="#000000" opacity="0.55" stroke="none" />
      <ellipse cx="200" cy="395" rx="80" ry="2.5" fill="#000000" opacity="0.7" stroke="none" />
    </svg>
  );
}
