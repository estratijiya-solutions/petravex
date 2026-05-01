type IconProps = { className?: string };

const baseProps = {
  width: 64,
  height: 64,
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/**
 * 3D-styled icons — each form rendered with lit/shadow facets, side faces,
 * and a drop shadow for depth. Monochrome gold via currentColor with
 * opacity-graded gradients that read as light from upper-left.
 */

export function StoneIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <defs>
        <linearGradient id="stone-lit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.10" />
        </linearGradient>
        <linearGradient id="stone-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* Cast shadow on ground */}
      <ellipse cx="32" cy="52" rx="20" ry="2" fill="#000" opacity="0.45" stroke="none" />
      {/* Front shadow face — gives the boulder thickness */}
      <polygon
        points="14,42 22,30 32,38 42,26 50,42 48,46 16,46"
        fill="url(#stone-shade)"
        stroke="currentColor"
        strokeOpacity="0.5"
      />
      {/* Lit top facets */}
      <polygon
        points="14,42 22,30 32,38 42,26 50,42"
        fill="url(#stone-lit)"
        stroke="currentColor"
      />
      {/* Internal facet ridges — catch the light */}
      <line x1="22" y1="30" x2="32" y2="38" strokeOpacity="0.65" />
      <line x1="32" y1="38" x2="42" y2="26" strokeOpacity="0.65" />
      {/* Hot highlight on the brightest ridge */}
      <line x1="22" y1="30" x2="42" y2="26" strokeOpacity="0.85" strokeWidth="1.4" />
    </svg>
  );
}

export function MillIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <defs>
        <linearGradient id="mill-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.30" />
        </linearGradient>
        <radialGradient id="mill-top" cx="40%" cy="40%" r="80%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.10" />
        </radialGradient>
      </defs>
      {/* Cast shadow */}
      <ellipse cx="32" cy="52" rx="16" ry="2" fill="#000" opacity="0.4" stroke="none" />
      {/* Cylinder body — gradient gives volume */}
      <path
        d="M 18 20 V 46 Q 18 49 32 49 Q 46 49 46 46 V 20"
        fill="url(#mill-side)"
        stroke="currentColor"
      />
      {/* Top ellipse — lit dome */}
      <ellipse cx="32" cy="20" rx="14" ry="3.5" fill="url(#mill-top)" stroke="currentColor" />
      {/* Horizontal banding — tighter spacing for industrial feel */}
      <ellipse cx="32" cy="28" rx="14" ry="2.2" stroke="currentColor" strokeOpacity="0.4" fill="none" />
      <ellipse cx="32" cy="36" rx="14" ry="2.2" stroke="currentColor" strokeOpacity="0.4" fill="none" />
      {/* Top spout/feed */}
      <line x1="32" y1="14" x2="32" y2="8" strokeOpacity="0.7" strokeWidth="1.4" />
      <circle cx="32" cy="8" r="2" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeOpacity="0.8" />
      {/* Left edge highlight — light catches the cylinder */}
      <line x1="18" y1="20" x2="18" y2="46" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.4" />
    </svg>
  );
}

export function CementIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <defs>
        <linearGradient id="bag-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.42" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.20" />
        </linearGradient>
        <linearGradient id="bag-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.50" />
        </linearGradient>
      </defs>
      {/* Cast shadow */}
      <ellipse cx="32" cy="54" rx="18" ry="2" fill="#000" opacity="0.45" stroke="none" />
      {/* Side gusset — darker, gives the bag thickness */}
      <polygon points="46,14 50,18 50,52 46,52" fill="url(#bag-side)" stroke="currentColor" strokeOpacity="0.7" />
      {/* Top fold/seal connecting front to side */}
      <polygon points="18,14 46,14 50,18 22,18" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeOpacity="0.7" />
      {/* Front face of bag */}
      <path
        d="M 18 14 L 46 14 L 46 52 L 18 52 Z"
        fill="url(#bag-front)"
        stroke="currentColor"
      />
      {/* Heat-seal stitching */}
      <line x1="22" y1="22" x2="42" y2="22" strokeOpacity="0.45" strokeDasharray="1.5 2" />
      {/* CEM label — readable badge */}
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontSize="9"
        fontFamily="serif"
        fontWeight="700"
        fill="currentColor"
        fillOpacity="0.95"
        stroke="none"
        letterSpacing="1.5"
      >
        CEM
      </text>
      {/* Left edge highlight */}
      <line x1="18" y1="14" x2="18" y2="52" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.4" />
    </svg>
  );
}

export function BlockIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <defs>
        <linearGradient id="block-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.40" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="block-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.40" />
        </linearGradient>
      </defs>
      {/* Cast shadow */}
      <ellipse cx="32" cy="54" rx="22" ry="2" fill="#000" opacity="0.4" stroke="none" />
      {/* Bottom row — back-left brick */}
      <polygon points="10,40 22,40 24,42 24,52 22,52 10,52" fill="url(#block-front)" stroke="currentColor" />
      <polygon points="22,40 24,42 24,52 22,52" fill="url(#block-side)" stroke="currentColor" strokeOpacity="0.7" />
      {/* Bottom row — back-right brick */}
      <polygon points="26,40 38,40 40,42 40,52 38,52 26,52" fill="url(#block-front)" stroke="currentColor" />
      <polygon points="38,40 40,42 40,52 38,52" fill="url(#block-side)" stroke="currentColor" strokeOpacity="0.7" />
      {/* Bottom row — back-far brick */}
      <polygon points="42,40 54,40 54,52 42,52" fill="url(#block-front)" stroke="currentColor" />
      {/* Middle row — staggered */}
      <polygon points="18,28 32,28 34,30 34,40 32,40 18,40" fill="url(#block-front)" stroke="currentColor" />
      <polygon points="32,28 34,30 34,40 32,40" fill="url(#block-side)" stroke="currentColor" strokeOpacity="0.7" />
      <polygon points="36,28 48,28 50,30 50,40 48,40 36,40" fill="url(#block-front)" stroke="currentColor" />
      <polygon points="48,28 50,30 50,40 48,40" fill="url(#block-side)" stroke="currentColor" strokeOpacity="0.7" />
      {/* Top row */}
      <polygon points="22,16 36,16 38,18 38,28 36,28 22,28" fill="url(#block-front)" stroke="currentColor" />
      <polygon points="36,16 38,18 38,28 36,28" fill="url(#block-side)" stroke="currentColor" strokeOpacity="0.7" />
      <polygon points="40,16 50,16 50,28 40,28" fill="url(#block-front)" stroke="currentColor" />
    </svg>
  );
}

export function TradeIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <defs>
        <linearGradient id="truck-cab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.50" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="truck-box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.40" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="truck-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      {/* Cast shadow */}
      <ellipse cx="32" cy="52" rx="24" ry="2" fill="#000" opacity="0.45" stroke="none" />
      {/* Container box — back face (perspective) */}
      <polygon points="6,18 36,18 38,20 38,42 36,42 6,42" fill="url(#truck-box)" stroke="currentColor" />
      {/* Container top — perspective wedge */}
      <polygon points="6,18 36,18 38,20 8,20" fill="currentColor" fillOpacity="0.30" stroke="currentColor" strokeOpacity="0.7" />
      {/* Container side */}
      <polygon points="36,18 38,20 38,42 36,42" fill="url(#truck-side)" stroke="currentColor" strokeOpacity="0.7" />
      {/* Cab — angled 3D box */}
      <polygon points="38,24 50,24 54,30 54,42 38,42" fill="url(#truck-cab)" stroke="currentColor" />
      {/* Cab roof line */}
      <line x1="38" y1="24" x2="50" y2="24" strokeOpacity="0.7" strokeWidth="1.2" />
      {/* Windshield — angled glass */}
      <polygon points="42,28 50,28 53,32 42,32" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeOpacity="0.6" />
      {/* Wheels — with hub */}
      <circle cx="14" cy="46" r="4" fill="#000" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="14" cy="46" r="1.5" fill="currentColor" fillOpacity="0.7" stroke="none" />
      <circle cx="46" cy="46" r="4" fill="#000" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="46" cy="46" r="1.5" fill="currentColor" fillOpacity="0.7" stroke="none" />
    </svg>
  );
}

export function BuildIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <defs>
        <linearGradient id="build-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="build-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.50" />
        </linearGradient>
      </defs>
      {/* Cast shadow */}
      <ellipse cx="32" cy="52" rx="22" ry="2" fill="#000" opacity="0.45" stroke="none" />
      {/* Short building — back layer */}
      <rect x="12" y="24" width="16" height="26" fill="url(#build-front)" stroke="currentColor" />
      <polygon points="28,24 32,22 32,48 28,50" fill="url(#build-side)" stroke="currentColor" strokeOpacity="0.65" />
      {/* Short building windows */}
      <rect x="15" y="28" width="3" height="3" fill="currentColor" fillOpacity="0.7" stroke="none" />
      <rect x="22" y="28" width="3" height="3" fill="currentColor" fillOpacity="0.7" stroke="none" />
      <rect x="15" y="34" width="3" height="3" fill="currentColor" fillOpacity="0.7" stroke="none" />
      <rect x="22" y="34" width="3" height="3" fill="currentColor" fillOpacity="0.5" stroke="none" />
      <rect x="15" y="40" width="3" height="3" fill="currentColor" fillOpacity="0.7" stroke="none" />
      <rect x="22" y="40" width="3" height="3" fill="currentColor" fillOpacity="0.7" stroke="none" />

      {/* Tall building — front layer */}
      <rect x="32" y="12" width="20" height="38" fill="url(#build-front)" stroke="currentColor" />
      <polygon points="52,12 56,14 56,48 52,50" fill="url(#build-side)" stroke="currentColor" strokeOpacity="0.7" />
      {/* Tall roof crown */}
      <polygon points="32,12 52,12 56,14 36,14" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeOpacity="0.7" />
      {/* Tall building windows — grid */}
      {[16, 22, 28, 34, 40].map((y) => (
        <g key={y}>
          <rect x="35" y={y} width="3" height="3" fill="currentColor" fillOpacity={0.6 + (y % 12 === 0 ? 0.2 : 0)} stroke="none" />
          <rect x="40" y={y} width="3" height="3" fill="currentColor" fillOpacity="0.7" stroke="none" />
          <rect x="45" y={y} width="3" height="3" fill="currentColor" fillOpacity={0.5 + (y % 8 === 0 ? 0.3 : 0)} stroke="none" />
        </g>
      ))}
      {/* Antenna spire */}
      <line x1="42" y1="12" x2="42" y2="6" strokeOpacity="0.85" strokeWidth="1.3" />
      <circle cx="42" cy="6" r="1.2" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

// Fixed order matching the 5 timeline steps:
// 0: المواد   → StoneIcon
// 1: الكلنكر  → MillIcon
// 2: الإسمنت → CementIcon
// 3: التجارة → TradeIcon
// 4: البناء   → BuildIcon
export const stepIcons = [StoneIcon, MillIcon, CementIcon, TradeIcon, BuildIcon] as const;
