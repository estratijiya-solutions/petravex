'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, type RefObject, useEffect, useState } from 'react';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { StoneAndBuilding } from './StoneAndBuilding';

type Props = {
  scrollRef: RefObject<number>;
  mouseRef: RefObject<{ x: number; y: number }>;
  reduce?: boolean;
};

/**
 * Hero 3D backdrop. The brand metaphor in motion: a rotating object that
 * cross-fades between stone (raw material) and tower (built future).
 *
 * Cinematic tuning — ACES Filmic tone mapping, two-layer parallax stars,
 * smooth fade-in on first paint, light vignette so the wordmark stays
 * legible without dimming the 3D.
 */
export default function JourneyScene({ scrollRef, mouseRef, reduce = false }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Tiny delay before fade-in to let the canvas settle and avoid pop-in
    const t = window.setTimeout(() => setMounted(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  // On mobile the hero grows tall (cards stack vertically), so the canvas
  // is capped to viewport height — otherwise the stone, rendered at the
  // canvas center, ends up below the fold. On md+ it fills the full hero.
  return (
    <div className="absolute top-0 inset-x-0 h-[100svh] md:inset-0 md:h-auto -z-10">
      {/* Center darkening — pulls focus to the wordmark and pushes the
          stone visually backwards so it never competes with the type. */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.30) 28%, rgba(10,10,10,0) 60%)',
        }}
      />
      {/* Edge vignette — soft falloff at the corners */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-radial from-transparent via-black/10 to-black/65" />
      {/* Bottom fade — clean reading background for the entry cards */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-signature"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        <Canvas
          camera={{ position: [0, 0, 9], fov: 38, near: 0.1, far: 60 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          dpr={[1, 1.75]}
          style={{ background: '#0A0A0A' }}
        >
          <ambientLight intensity={0.3} />
          <fog attach="fog" args={['#0A0A0A', 14, 34]} />
          <Suspense fallback={null}>
            {/* Two-layer star field for parallax depth */}
            <Stars radius={45} depth={20} count={280} factor={1.4} fade speed={0.5} />
            <Stars radius={90} depth={50} count={200} factor={3} fade speed={0.25} />
            <StoneAndBuilding scrollRef={scrollRef} mouseRef={mouseRef} reduce={reduce} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
