'use client';

import { useEffect, useRef } from 'react';

/**
 * Hero centerpiece — three forms (stone, cement bag, skyscraper) on a 3-sided
 * 3D turntable rotating around the vertical axis. Each face has both:
 *  - CSS 3D rotateY positioning (-120° apart) + backface-visibility:hidden
 *  - JS rAF opacity fade with cosine window for soft transitions
 *
 * The opacity fade kicks in earlier than backface-visibility so faces dim
 * gracefully into and out of view rather than snapping at 90°.
 */
export function HeroFallback() {
  const containerRef = useRef<HTMLDivElement>(null);
  const faceRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const flareRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null]);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const start = performance.now();
    // Base period — rotation slows down on hover (controlled below)
    const basePeriodMs = 42000;
    const targets = [0, 120, 240]; // stone, bag, building
    // Each face's static rotateY around the turntable axis
    const baseRotations = ['rotateY(0deg)', 'rotateY(-120deg)', 'rotateY(-240deg)'];

    // Mouse interaction — smoothed parallax tilt
    let targetMx = 0;
    let targetMy = 0;
    let mx = 0;
    let my = 0;
    // Hover state — smoothed 0..1 based on cursor proximity to the form
    let targetHover = 0;
    let hover = 0;
    // Time-based phase that we accumulate manually so we can vary speed
    // (slow down on hover) without resetting the rotation.
    let phase = 0;
    let lastT = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      // Normalize cursor to [-1, 1] across the viewport (parallax)
      targetMx = (e.clientX / window.innerWidth) * 2 - 1;
      targetMy = (e.clientY / window.innerHeight) * 2 - 1;
      // Hover detection — within the form's bounds (with a soft outer ring)
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Inside the radius → hover=1, outside (within 1.4× radius) → linearly fades
      const inner = rect.width * 0.5;
      const outer = rect.width * 0.7;
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

    const tick = (now: number) => {
      if (cancelled) return;
      const dtMs = now - lastT;
      lastT = now;

      // Smooth hover follow
      hover += (targetHover - hover) * 0.08;

      // Speed modulation — slower (~50%) when hovered so user can study the form
      const speedFactor = 1 - 0.5 * hover;
      phase += (dtMs / basePeriodMs) * speedFactor;
      const angle = (phase % 1) * 360;

      // Smooth mouse interpolation — "lazy" follow
      mx += (targetMx - mx) * 0.06;
      my += (targetMy - my) * 0.06;

      // Convert smoothed mouse into tilt angles
      const tiltX = -my * 12; // ±12° vertical tilt (lean toward cursor)
      const yawOffset = mx * 8; // ±8° subtle yaw bias

      if (containerRef.current) {
        containerRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${
          angle + yawOffset
        }deg)`;
      }

      // Per-face opacity + vertical lift — every face stays at its natural
      // size and remains crisp; only the cross-fade and a gentle vertical
      // drift carry the "transformation" feel. Outgoing face rises, incoming
      // emerges from below.
      const els = faceRefs.current;
      let maxT = 0; // highest opacity across faces — for the transition flare
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const target = targets[i];
        // Signed distance from face's target — positive = past peak (leaving),
        // negative = before peak (arriving).
        let d = (angle + yawOffset - target) % 360;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;

        const t = faceOpacity(angle + yawOffset, target); // 0..1
        if (t > maxT) maxT = t;
        el.style.opacity = String(t);

        // VERTICAL DRIFT only — no scale, no blur. All shapes stay full-size
        // and crisp. Sign is opposite to d's sign: negative d (arriving) → +Y
        // (from below) → settles to 0 at peak; positive d (leaving) → -Y
        // (rising up away).
        const dSign = d >= 0 ? 1 : -1;
        const lift = -dSign * 16 * Math.sin((1 - t) * (Math.PI / 2));
        el.style.transform = `${baseRotations[i]} translateY(${lift.toFixed(1)}px)`;
        el.style.filter = 'none';
      }

      // Transition flare — peaks (1.0) at the exact moment between two faces,
      // dims (0) when a face is fully facing the camera. Gives a soft "puff
      // of light" feel during transformation.
      if (flareRef.current) {
        const flareIntensity = Math.max(0, 1 - maxT);
        const eased = Math.pow(flareIntensity, 1.4);
        // Hover boosts flare visibility
        flareRef.current.style.opacity = (eased * (1 + hover * 0.4)).toFixed(3);
      }

      // HOVER AURA — soft golden ring around the form that fades in as cursor
      // approaches. Stays subtle but adds the "lights up" interaction.
      if (auraRef.current) {
        auraRef.current.style.opacity = (hover * 0.85).toFixed(3);
        // Gentle breathing scale when hovered
        const breath = 1 + 0.04 * Math.sin(phase * Math.PI * 2 * 6);
        auraRef.current.style.transform = `translate(-50%, -50%) scale(${(1 + hover * 0.06 * breath).toFixed(3)})`;
      }

      // CAPTIONS — each label crossfades with its corresponding face. Hover
      // brightens them so the user can read what's currently showing.
      const caps = captionRefs.current;
      for (let i = 0; i < caps.length; i++) {
        const cap = caps[i];
        if (!cap) continue;
        const t = faceOpacity(angle + yawOffset, targets[i]);
        // Base 0.55 visibility, hover boost up to ~1.0
        const intensity = t * (0.55 + 0.45 * hover);
        cap.style.opacity = intensity.toFixed(3);
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

  const setCaptionRef = (idx: number) => (el: HTMLSpanElement | null) => {
    captionRefs.current[idx] = el;
  };

  // Caption text for each form. Order matches `targets` (stone, bag, building).
  const captions = ['الحجر', 'الإسمنت', 'البرج'];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      {/* Soft radial vignette */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 35%, rgba(10,10,10,0) 70%)',
        }}
      />

      {/* Quiet star field */}
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
          <circle cx="200" cy="380" r="0.9" opacity="0.35" />
          <circle cx="600" cy="320" r="1" opacity="0.4" />
          <circle cx="1000" cy="340" r="0.9" opacity="0.4" />
          <circle cx="1400" cy="380" r="1" opacity="0.45" />
        </g>
      </svg>

      {/* Caption — sits ABOVE the form, near the top of hero. Crossfades
          with the dominant face. Brightens on hover. z-10 so it floats
          above the rotating form silhouette. */}
      <div className="pointer-events-none absolute inset-x-0 z-10 flex justify-center" style={{ top: '4%' }}>
        <div className="relative h-5 w-44 text-center">
          {captions.map((label, i) => (
            <span
              key={label}
              ref={setCaptionRef(i)}
              className="absolute inset-0 font-arabic text-[11px] md:text-xs tracking-[0.4em] text-gold"
              style={{ opacity: 0 }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* 3-faced rotating turntable */}
      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
        style={{ top: '8%' }}
      >
        {/* Wrapper for form + aura glow */}
        <div className="relative" style={{ perspective: '1600px', perspectiveOrigin: '50% 35%' }}>
          {/* Hover aura — soft golden halo that brightens when cursor approaches */}
          <div
            ref={auraRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] md:h-[420px] md:w-[420px]"
            style={{
              opacity: 0,
              background:
                'radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.12) 32%, rgba(212,175,55,0) 65%)',
              filter: 'blur(14px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        <div
          ref={containerRef}
          className="relative h-[180px] w-[180px] md:h-[340px] md:w-[340px]"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Halo rings — share the rotation but symmetrical so always visible */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full"
            aria-hidden
            style={{ transformStyle: 'preserve-3d' }}
          >
            <circle cx="200" cy="200" r="180" stroke="#D4AF37" strokeOpacity="0.15" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="195" stroke="#D4AF37" strokeOpacity="0.07" strokeWidth="1" fill="none" />
          </svg>

          {/* TRANSITION FLARE — golden bloom that pulses at the moment
              between two faces. Sits at the turntable's center so it always
              faces the camera regardless of yaw. */}
          <div
            ref={flareRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 md:h-[360px] md:w-[360px]"
            style={{
              opacity: 0,
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,233,168,0.55) 0%, rgba(212,175,55,0.30) 22%, rgba(212,175,55,0.10) 45%, rgba(212,175,55,0) 70%)',
              filter: 'blur(8px)',
              transform: 'translateZ(0)',
            }}
          />

          {/* FACE 1: STONE (rotateY 0°) */}
          <div
            ref={setFaceRef(0)}
            className="absolute inset-0"
            style={{
              transform: 'rotateY(0deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              opacity: 1,
              willChange: 'transform, filter, opacity',
              transformOrigin: '50% 50%',
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
              willChange: 'transform, filter, opacity',
              transformOrigin: '50% 50%',
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
              willChange: 'transform, filter, opacity',
              transformOrigin: '50% 50%',
            }}
          >
            <BuildingFace />
          </div>
        </div>
        </div>
      </div>

      {/* Ground glow at bottom */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-48"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0) 60%)',
        }}
      />

      {/* Bottom black fade for text legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent"
      />
    </div>
  );
}

/**
 * Cosine fade for face opacity — peaks at 1 when the face directly faces the
 * camera, smoothly fades to 0 by ±halfWidth. Tighter halfWidth = each face
 * stays "fully there" longer, with a quicker hand-off between forms.
 */
function faceOpacity(currentAngle: number, target: number, halfWidth = 80) {
  let d = (currentAngle - target) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  const x = Math.abs(d) / halfWidth;
  if (x >= 1) return 0;
  // cos² gives a flatter top — face stays "fully present" longer
  const c = Math.cos((x * Math.PI) / 2);
  return c * c;
}


/* ──────────────────────────────────────────────────────────────────
   Three faces: Stone, Cement Bag, Skyscraper.
   Each is a self-contained 400×400 SVG.
   ────────────────────────────────────────────────────────────────── */

function StoneFace() {
  /**
   * Crystal/gem-like stone — 11-vertex polygon with multi-facet shading,
   * volumetric gradient, lit/shadow planes, highlight glint along the
   * top-right ridge, and three specular sparkles for gem shimmer.
   */
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
        {/* Volumetric gradient — light from upper-right */}
        <radialGradient id="stone-volume" cx="68%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.62" />
          <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
        </radialGradient>
        {/* Hot highlight on the top-right facet */}
        <linearGradient id="stone-hi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5DC83" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
        {/* Deep shadow gradient for back-side depth */}
        <linearGradient id="stone-depth" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        {/* Soft outer glow */}
        <radialGradient id="stone-glow" cx="50%" cy="50%" r="50%">
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer atmospheric glow */}
      <circle cx="200" cy="200" r="160" fill="url(#stone-glow)" stroke="none" />

      {/* Drop shadow */}
      <ellipse cx="200" cy="358" rx="120" ry="14" fill="#000000" opacity="0.45" stroke="none" />
      <ellipse cx="200" cy="358" rx="80" ry="8" fill="#000000" opacity="0.6" stroke="none" />

      {/* Soft halo bloom */}
      <g opacity="0.36" style={{ filter: 'blur(4px)' }} stroke="none">
        <polygon points="178,68 320,98 366,200 332,310 244,352 168,352 92,308 50,210 86,118" fill="#D4AF37" fillOpacity="0.55" />
      </g>

      {/* Crystal silhouette — volume gradient fill */}
      <polygon
        points="180,76 268,90 320,128 354,200 326,294 248,338 168,344 96,304 60,218 88,140 124,98"
        fill="url(#stone-volume)"
      />

      {/* Deep shadow depth band on the unlit side */}
      <polygon
        points="60,218 88,140 124,98 180,76 200,200 96,304"
        fill="url(#stone-depth)"
        stroke="none"
      />

      {/* Shadow facets */}
      <polygon points="180,76 60,218 96,304 168,344" fill="#000000" fillOpacity="0.35" stroke="none" />
      <polygon points="60,218 88,140 124,98 180,76" fill="#000000" fillOpacity="0.22" stroke="none" />
      <polygon points="96,304 168,344 200,200" fill="#000000" fillOpacity="0.15" stroke="none" />

      {/* Lit facets — bright top-right */}
      <polygon points="180,76 268,90 320,128 200,200" fill="#D4AF37" fillOpacity="0.34" stroke="none" />
      <polygon points="320,128 354,200 326,294 200,200" fill="#D4AF37" fillOpacity="0.22" stroke="none" />
      <polygon points="180,76 200,200 268,90" fill="#D4AF37" fillOpacity="0.18" stroke="none" />

      {/* Mid-tone bottom facet */}
      <polygon points="200,200 326,294 248,338 168,344" fill="#D4AF37" fillOpacity="0.10" stroke="none" />

      {/* Crisp main outline */}
      <polygon
        points="180,76 268,90 320,128 354,200 326,294 248,338 168,344 96,304 60,218 88,140 124,98"
        strokeWidth="2"
      />

      {/* Internal facet edges */}
      <line x1="180" y1="76" x2="200" y2="200" opacity="0.7" />
      <line x1="200" y1="200" x2="60" y2="218" opacity="0.55" />
      <line x1="200" y1="200" x2="354" y2="200" opacity="0.75" />
      <line x1="200" y1="200" x2="248" y2="338" opacity="0.55" />
      <line x1="200" y1="200" x2="168" y2="344" opacity="0.5" />
      <line x1="200" y1="200" x2="320" y2="128" opacity="0.7" />
      <line x1="200" y1="200" x2="96" y2="304" opacity="0.5" />

      {/* Highlight glint — brightest edge catching light */}
      <line x1="180" y1="76" x2="320" y2="128" stroke="url(#stone-hi)" strokeWidth="4" opacity="0.95" />
      <line x1="186" y1="80" x2="270" y2="92" stroke="#FFE9A8" strokeWidth="1.5" opacity="0.85" />
      <line x1="320" y1="128" x2="354" y2="200" stroke="#F5DC83" strokeWidth="2" opacity="0.55" />

      {/* Specular sparkles — gem shimmer */}
      <circle cx="244" cy="100" r="3.5" fill="#FFE9A8" stroke="none" opacity="0.95" />
      <circle cx="244" cy="100" r="9" fill="#D4AF37" stroke="none" opacity="0.45" />
      <circle cx="300" cy="140" r="2" fill="#FFE9A8" stroke="none" opacity="0.85" />
      <circle cx="300" cy="140" r="5" fill="#D4AF37" stroke="none" opacity="0.4" />
      <circle cx="270" cy="200" r="1.5" fill="#FFE9A8" stroke="none" opacity="0.7" />
    </svg>
  );
}

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
        {/* Soft body shading — light from upper-left */}
        <linearGradient id="bag-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
        </linearGradient>
      </defs>

      {/* Soft halo behind bag */}
      <g opacity="0.22" style={{ filter: 'blur(3px)' }}>
        <path d="M 96 76 Q 96 66 108 66 H 292 Q 304 66 304 76 V 326 Q 304 334 296 334 H 104 Q 96 334 96 326 Z" />
      </g>

      {/* Bag body — slight curve at sides (paper feel) */}
      <path
        d="M 102 76 Q 100 68 110 68 H 290 Q 300 68 298 76 L 304 326 Q 304 336 294 336 H 106 Q 96 336 96 326 Z"
        fill="url(#bag-body)"
      />
      <path d="M 102 76 Q 100 68 110 68 H 290 Q 300 68 298 76 L 304 326 Q 304 336 294 336 H 106 Q 96 336 96 326 Z" />

      {/* Top folded heat-sealed strip */}
      <path d="M 110 70 Q 110 64 116 64 H 284 Q 290 64 290 70 V 92 H 110 Z" opacity="0.92" />
      <line x1="118" y1="78" x2="282" y2="78" strokeWidth="0.7" opacity="0.5" />
      <line x1="118" y1="86" x2="282" y2="86" strokeWidth="0.7" opacity="0.5" />

      {/* Stitch line on the seal */}
      {[124, 144, 164, 184, 204, 224, 244, 264, 280].map((x) => (
        <circle key={x} cx={x} cy="74" r="0.9" fill="#D4AF37" stroke="none" opacity="0.7" />
      ))}

      {/* Bottom brand band */}
      <path d="M 100 308 H 304 V 326 Q 304 336 294 336 H 106 Q 96 336 96 326 Z" opacity="0.92" />
      <line x1="108" y1="320" x2="296" y2="320" strokeWidth="0.6" opacity="0.5" />

      {/* Vertical paper-grain hint */}
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

      {/* Highlight strip on the left edge — light hits here */}
      <line x1="106" y1="98" x2="106" y2="320" stroke="#FFE9A8" strokeOpacity="0.55" strokeWidth="2" />
      <line x1="112" y1="98" x2="112" y2="320" stroke="#F5DC83" strokeOpacity="0.25" strokeWidth="1" />

      {/* DEPTH band on right edge — suggests bag has 3D thickness */}
      <rect x="290" y="92" width="14" height="234" fill="#000000" fillOpacity="0.45" stroke="none" />
      <line x1="294" y1="98" x2="294" y2="320" stroke="#000000" strokeOpacity="0.55" strokeWidth="1.2" />
      <line x1="298" y1="98" x2="298" y2="320" stroke="#000000" strokeOpacity="0.4" strokeWidth="0.8" />

      {/* Bottom shadow — bag sits on a surface */}
      <ellipse cx="200" cy="346" rx="100" ry="6" fill="#000000" opacity="0.5" stroke="none" />

      {/* OFFICIAL Petravex P monogram — embedded brand asset (centered, bigger) */}
      <image
        href="/logo.png"
        x="148"
        y="124"
        width="104"
        height="104"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Brand wordmark below logo */}
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

      {/* Hairline divider under wordmark */}
      <line x1="156" y1="262" x2="244" y2="262" strokeWidth="0.7" opacity="0.5" />

      {/* Weight badge — kept (real bags show weight prominently) */}
      <g transform="translate(248, 105)">
        <rect x="0" y="0" width="36" height="20" strokeWidth="1.2" rx="1" />
        <text x="18" y="14" textAnchor="middle" fontSize="10" fontFamily="serif" fontWeight="700" fill="#D4AF37" stroke="none">
          50KG
        </text>
      </g>

      {/* Tear notch indicator */}
      <path d="M 110 290 L 124 285 L 124 295 Z" strokeWidth="0.8" opacity="0.45" />
    </svg>
  );
}

function BuildingFace() {
  /**
   * Refined classical skyscraper — feels like a real Manhattan/Chicago
   * landmark from the 1930s. Dense, solid, with believable proportions:
   *
   *   • Foundation plinth + entrance podium
   *   • Two-tier setback base
   *   • Tall main body with proper window grid (8 cols × 12 rows)
   *   • Three-tier wedding-cake crown with cornice banding
   *   • Slender spire with mast and pinnacle aviation lamp
   *
   * Light source: upper-left. Each surface has a distinct fill (not just a
   * gradient) so the silhouette reads as solid stone, not transparent.
   */
  const tiers = [
    { x: 102, y: 348, w: 196, h: 22 }, // wide base
    { x: 116, y: 332, w: 168, h: 16 }, // base setback
    { x: 138, y: 152, w: 124, h: 180 }, // main body
    { x: 150, y: 130, w: 100, h: 22 }, // crown lower
    { x: 162, y: 108, w: 76, h: 22 }, // crown middle
    { x: 174, y: 88, w: 52, h: 20 }, // crown upper
    { x: 188, y: 64, w: 24, h: 24 }, // spire base
  ];
  const spire = { x: 196, y: 32, w: 8, h: 32 };
  const foundation = { x: 90, y: 370, w: 220, h: 14 };

  // Main body window grid — 8 columns × 12 rows, evenly spaced
  const bodyCols = [144, 158, 172, 186, 200, 214, 228, 242, 256];
  const bodyRows = [
    158, 170, 182, 194, 206, 218, 230, 242, 254, 266, 278, 290, 302, 314,
  ];
  const bodyWindows: Array<[number, number]> = [];
  for (const y of bodyRows) {
    for (let c = 0; c < bodyCols.length - 1; c++) {
      const x = (bodyCols[c] + bodyCols[c + 1]) / 2 - 2;
      bodyWindows.push([x, y]);
    }
  }

  // Stochastic-but-deterministic "lit" mask — varies by row & column.
  // Roughly 55% of windows lit (gives the building a real night look).
  const isLit = (x: number, y: number) => {
    const seed = Math.sin(x * 0.13 + y * 0.27) * 43758.5453;
    return seed - Math.floor(seed) > 0.45;
  };

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      <defs>
        {/* Solid stone fill — light hits the left half, deep shadow on right */}
        <linearGradient id="stone-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a2f1a" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#241d10" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0f0c06" stopOpacity="0.98" />
        </linearGradient>
        {/* Vertical gradient — top brighter (catches sky light) */}
        <linearGradient id="stone-vfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.16" />
          <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
        </linearGradient>
        {/* Lit window glow */}
        <radialGradient id="win-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFE9A8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tower-glow" cx="50%" cy="50%" r="50%">
          <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Normalize building to match the visual size of stone + bag faces.
          The building's pinnacle reaches y=5 and base sits at y=384, giving
          a natural height of ~379. Scaling by 0.72 around the viewBox center
          (200, 200) brings its height to ~273 — same as the other faces. */}
      <g transform="translate(56 56) scale(0.72)">

      {/* Outer atmospheric glow */}
      <circle cx="200" cy="200" r="170" fill="url(#tower-glow)" stroke="none" />

      {/* Soft halo silhouette */}
      <g opacity="0.18" style={{ filter: 'blur(4px)' }}>
        <path
          d="M 90 384 V 370 H 102 V 348 H 116 V 332 H 138 V 152 H 150 V 130 H 162 V 108 H 174 V 88 H 188 V 64 H 196 V 32 H 204 V 64 H 212 V 88 H 226 V 108 H 238 V 130 H 250 V 152 H 262 V 332 H 284 V 348 H 298 V 370 H 310 V 384 Z"
          fill="#D4AF37"
          stroke="none"
        />
      </g>

      {/* SOLID base fill — gives the tower real visual weight */}
      <path
        d="M 90 384 V 370 H 102 V 348 H 116 V 332 H 138 V 152 H 150 V 130 H 162 V 108 H 174 V 88 H 188 V 64 H 196 V 32 H 204 V 64 H 212 V 88 H 226 V 108 H 238 V 130 H 250 V 152 H 262 V 332 H 284 V 348 H 298 V 370 H 310 V 384 Z"
        fill="url(#stone-fill)"
        stroke="none"
      />
      {/* Vertical light wash on top of solid fill */}
      <path
        d="M 90 384 V 370 H 102 V 348 H 116 V 332 H 138 V 152 H 150 V 130 H 162 V 108 H 174 V 88 H 188 V 64 H 196 V 32 H 204 V 64 H 212 V 88 H 226 V 108 H 238 V 130 H 250 V 152 H 262 V 332 H 284 V 348 H 298 V 370 H 310 V 384 Z"
        fill="url(#stone-vfill)"
        stroke="none"
      />

      {/* DEEP shadow on right side — strong 3D illusion (whole right ~30%) */}
      <path
        d="M 232 152 H 262 V 332 H 284 V 348 H 298 V 370 H 310 V 384 H 200 V 152 Z"
        fill="#000000"
        fillOpacity="0.32"
        stroke="none"
      />

      {/* LIGHT wash on left side — light hits this face */}
      <path
        d="M 138 152 H 168 V 332 H 200 V 384 H 90 V 370 H 102 V 348 H 116 V 332 H 138 Z"
        fill="#D4AF37"
        fillOpacity="0.06"
        stroke="none"
      />

      {/* CRISP outline — the silhouette */}
      <path
        d="M 90 384 V 370 H 102 V 348 H 116 V 332 H 138 V 152 H 150 V 130 H 162 V 108 H 174 V 88 H 188 V 64 H 196 V 32 H 204 V 64 H 212 V 88 H 226 V 108 H 238 V 130 H 250 V 152 H 262 V 332 H 284 V 348 H 298 V 370 H 310 V 384 Z"
        strokeWidth="1.5"
        opacity="0.95"
      />

      {/* Subtle setback shadow lines on left edge of each setback */}
      {tiers.slice(1).map((t, i) => (
        <line
          key={`setback-${i}`}
          x1={t.x}
          y1={t.y}
          x2={t.x + t.w}
          y2={t.y}
          stroke="#D4AF37"
          strokeOpacity="0.55"
          strokeWidth="0.8"
        />
      ))}

      {/* Highlighted left edge — light catching */}
      <line x1="138" y1="152" x2="138" y2="332" stroke="#FFE9A8" strokeOpacity="0.45" strokeWidth="1.2" />
      <line x1="150" y1="130" x2="150" y2="152" stroke="#FFE9A8" strokeOpacity="0.45" strokeWidth="1" />
      <line x1="162" y1="108" x2="162" y2="130" stroke="#FFE9A8" strokeOpacity="0.45" strokeWidth="1" />
      <line x1="174" y1="88" x2="174" y2="108" stroke="#FFE9A8" strokeOpacity="0.45" strokeWidth="1" />
      <line x1="188" y1="64" x2="188" y2="88" stroke="#FFE9A8" strokeOpacity="0.5" strokeWidth="1" />
      <line x1="116" y1="332" x2="116" y2="348" stroke="#FFE9A8" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="102" y1="348" x2="102" y2="370" stroke="#FFE9A8" strokeOpacity="0.4" strokeWidth="1" />

      {/* Vertical PILASTERS on main body — load-bearing piers between window bays */}
      {bodyCols.map((x, i) => (
        <line
          key={`pier-${i}`}
          x1={x}
          y1="152"
          x2={x}
          y2="332"
          stroke="#D4AF37"
          strokeOpacity={i === 4 ? 0.45 : 0.28}
          strokeWidth={i === 4 ? 0.9 : 0.6}
        />
      ))}
      {/* Center fluting carries through the crown */}
      <line x1="200" y1="64" x2="200" y2="152" stroke="#D4AF37" strokeOpacity="0.4" strokeWidth="0.7" />

      {/* Horizontal SPANDREL bands — concrete bands between window rows */}
      {bodyRows.map((y) => (
        <line
          key={`row-${y}`}
          x1="138"
          y1={y - 5}
          x2="262"
          y2={y - 5}
          stroke="#000000"
          strokeOpacity="0.45"
          strokeWidth="0.6"
        />
      ))}

      {/* Cornice band at top of main body — separates body from crown */}
      <rect x="138" y="148" width="124" height="4" fill="#D4AF37" fillOpacity="0.18" stroke="none" />
      <line x1="138" y1="148" x2="262" y2="148" stroke="#D4AF37" strokeOpacity="0.6" strokeWidth="0.7" />
      <line x1="138" y1="152" x2="262" y2="152" stroke="#D4AF37" strokeOpacity="0.5" strokeWidth="0.6" />

      {/* Cornice band on each crown tier */}
      <rect x="150" y="148" width="100" height="2" fill="#D4AF37" fillOpacity="0.22" stroke="none" />
      <line x1="150" y1="130" x2="250" y2="130" stroke="#D4AF37" strokeOpacity="0.6" strokeWidth="0.7" />
      <rect x="162" y="126" width="76" height="2" fill="#D4AF37" fillOpacity="0.20" stroke="none" />
      <line x1="162" y1="108" x2="238" y2="108" stroke="#D4AF37" strokeOpacity="0.6" strokeWidth="0.7" />
      <rect x="174" y="104" width="52" height="2" fill="#D4AF37" fillOpacity="0.20" stroke="none" />
      <line x1="174" y1="88" x2="226" y2="88" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="0.6" />

      {/* Decorative arches on crown lower — Art Deco rhythm */}
      <path d="M 158 142 Q 168 130 178 142" strokeWidth="0.7" stroke="#D4AF37" strokeOpacity="0.7" fill="none" />
      <path d="M 184 142 Q 192 130 200 142" strokeWidth="0.7" stroke="#D4AF37" strokeOpacity="0.7" fill="none" />
      <path d="M 200 142 Q 208 130 216 142" strokeWidth="0.7" stroke="#D4AF37" strokeOpacity="0.7" fill="none" />
      <path d="M 222 142 Q 232 130 242 142" strokeWidth="0.7" stroke="#D4AF37" strokeOpacity="0.7" fill="none" />

      {/* Crown middle: vertical fluting ribs */}
      <line x1="174" y1="108" x2="174" y2="130" strokeWidth="0.6" stroke="#D4AF37" strokeOpacity="0.5" />
      <line x1="186" y1="108" x2="186" y2="130" strokeWidth="0.6" stroke="#D4AF37" strokeOpacity="0.5" />
      <line x1="200" y1="108" x2="200" y2="130" strokeWidth="0.6" stroke="#D4AF37" strokeOpacity="0.55" />
      <line x1="214" y1="108" x2="214" y2="130" strokeWidth="0.6" stroke="#D4AF37" strokeOpacity="0.5" />
      <line x1="226" y1="108" x2="226" y2="130" strokeWidth="0.6" stroke="#D4AF37" strokeOpacity="0.5" />

      {/* Crown upper: portico arches */}
      <path d="M 178 108 Q 186 100 194 108" strokeWidth="0.7" stroke="#D4AF37" strokeOpacity="0.65" fill="none" />
      <path d="M 198 108 Q 206 100 214 108" strokeWidth="0.7" stroke="#D4AF37" strokeOpacity="0.65" fill="none" />
      <path d="M 214 108 Q 220 100 226 108" strokeWidth="0.7" stroke="#D4AF37" strokeOpacity="0.6" fill="none" />

      {/* Spire base ornament — observation deck windows */}
      <rect x="190" y="68" width="20" height="4" stroke="#D4AF37" strokeOpacity="0.6" strokeWidth="0.5" />
      <rect x="190" y="76" width="20" height="4" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="0.5" />

      {/* MAIN BODY WINDOWS — proper grid with stochastic lit/dark variation */}
      {bodyWindows.map(([x, y], i) => {
        const lit = isLit(x, y);
        return (
          <g key={`bw-${i}`}>
            {/* Base recessed window frame */}
            <rect
              x={x}
              y={y}
              width="4"
              height="6"
              fill={lit ? '#D4AF37' : '#000000'}
              fillOpacity={lit ? 0.95 : 0.6}
              stroke="none"
            />
            {/* Soft glow halo on lit windows only */}
            {lit && (
              <rect
                x={x - 2}
                y={y - 1}
                width="8"
                height="8"
                fill="url(#win-glow)"
                stroke="none"
                opacity="0.75"
              />
            )}
          </g>
        );
      })}

      {/* Base & podium windows — wider arched openings (lobby/entrance vibe) */}
      {[
        // Base setback (y 332-348) — 4 windows
        [128, 336], [168, 336], [212, 336], [252, 336],
        // Wide base (y 348-370) — 5 windows
        [120, 354], [156, 354], [196, 354], [232, 354], [268, 354],
        // Foundation podium (y 370-384) — entrance bays
        [128, 374], [196, 374], [264, 374],
      ].map(([x, y], i) => (
        <rect
          key={`pw-${i}`}
          x={x as number}
          y={y as number}
          width="16"
          height="8"
          fill="#D4AF37"
          fillOpacity="0.55"
          stroke="#D4AF37"
          strokeOpacity="0.4"
          strokeWidth="0.5"
        />
      ))}

      {/* Crown lit windows — fewer, brighter (penthouse / observation) */}
      {[
        [168, 134], [198, 134], [228, 134], // crown lower
        [180, 114], [200, 114], [218, 114], // crown middle
        [192, 92], [206, 92], // crown upper
      ].map(([x, y], i) => (
        <g key={`cw-${i}`}>
          <rect
            x={x as number}
            y={y as number}
            width="4"
            height="5"
            fill="#FFE9A8"
            stroke="none"
            opacity="0.95"
          />
          <rect
            x={(x as number) - 2}
            y={(y as number) - 1}
            width="8"
            height="7"
            fill="url(#win-glow)"
            stroke="none"
          />
        </g>
      ))}

      {/* Spire shaft outline */}
      <rect
        x={spire.x}
        y={spire.y}
        width={spire.w}
        height={spire.h}
        fill="#241d10"
        stroke="#D4AF37"
        strokeOpacity="0.8"
        strokeWidth="0.6"
      />
      {/* Spire highlight on left edge */}
      <line x1={spire.x} y1={spire.y} x2={spire.x} y2={spire.y + spire.h} stroke="#FFE9A8" strokeOpacity="0.5" strokeWidth="0.7" />
      {/* Spire antenna bands */}
      <line x1="194" y1="48" x2="206" y2="48" strokeWidth="0.8" stroke="#D4AF37" strokeOpacity="0.85" />
      <line x1="195" y1="56" x2="205" y2="56" strokeWidth="0.6" stroke="#D4AF37" strokeOpacity="0.7" />

      {/* Mast above spire base */}
      <line x1="200" y1="32" x2="200" y2="14" strokeWidth="1.4" stroke="#D4AF37" strokeOpacity="0.95" />
      <line x1="200" y1="14" x2="200" y2="6" strokeWidth="0.7" stroke="#D4AF37" strokeOpacity="0.85" />
      {/* Cross arms on mast */}
      <line x1="196" y1="22" x2="204" y2="22" strokeWidth="0.6" stroke="#D4AF37" strokeOpacity="0.7" />
      <line x1="197" y1="14" x2="203" y2="14" strokeWidth="0.5" stroke="#D4AF37" strokeOpacity="0.6" />

      {/* Aviation warning lamp at pinnacle — pulsing red feel via static layered glow */}
      <circle cx="200" cy="5" r="2.2" fill="#FFE9A8" stroke="none" />
      <circle cx="200" cy="5" r="5" fill="#D4AF37" stroke="none" opacity="0.5" />
      <circle cx="200" cy="5" r="9" fill="#D4AF37" stroke="none" opacity="0.22" />
      <circle cx="200" cy="5" r="14" fill="#D4AF37" stroke="none" opacity="0.10" />

      {/* GROUND CAST shadow — soft, double-layered */}
      <ellipse cx="200" cy="394" rx="148" ry="6" fill="#000000" opacity="0.55" stroke="none" />
      <ellipse cx="200" cy="394" rx="92" ry="3" fill="#000000" opacity="0.75" stroke="none" />
      {/* Light leak from base — golden spill on the ground */}
      <ellipse cx="200" cy="385" rx="120" ry="3" fill="#D4AF37" opacity="0.18" stroke="none" />

      </g>
    </svg>
  );
}
