'use client';

import { HeroContent, ScrollHint } from './HeroContent';
import { EntryCards } from './EntryCards';
import { HeroBackdrop, HeroTurntable } from './HeroFallback';

/**
 * Hero layout (top-to-bottom, in flow):
 *   1. HeroTurntable — rotating 3-form centerpiece, owns the upper third
 *   2. HeroContent   — eyebrow + wordmark + headline + subtitle
 *   3. EntryCards    — three role-based CTAs
 *
 * HeroBackdrop renders absolutely behind everything (vignette + stars +
 * legibility fade). The turntable is OUT of the backdrop now — putting
 * the gold rotating form behind the gold wordmark made both bleed into
 * each other; stacking them vertically gives both their own breathing
 * room and reads cleanly across mobile, tablet, and desktop.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden pt-20 pb-28 md:pt-24 md:pb-24"
    >
      <HeroBackdrop />

      <div className="relative z-10 flex w-full flex-col items-center gap-6 md:gap-10">
        <HeroTurntable />
        <HeroContent />
        <EntryCards />
      </div>

      <ScrollHint />
    </section>
  );
}
