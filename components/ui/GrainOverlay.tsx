/**
 * Fixed-position SVG turbulence noise at very low opacity. Adds film-like
 * texture without measurable performance cost. Mix-blend overlay so it
 * works on dark and light surfaces alike.
 */
export function GrainOverlay() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'>` +
    `<filter id='n'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>` +
    `<feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/>` +
    `</filter>` +
    `<rect width='240' height='240' filter='url(#n)'/>` +
    `</svg>`;
  const dataUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-overlay"
      style={{
        backgroundImage: dataUrl,
        backgroundSize: '240px 240px',
        opacity: 0.05,
      }}
    />
  );
}
