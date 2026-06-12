type IconProps = { className?: string };

const baseProps = {
  width: 40,
  height: 40,
  viewBox: '0 0 40 40',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function TradingIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 32 L6 12 L20 6 L34 12 L34 32" />
      <path d="M6 32 L34 32" />
      <path d="M14 32 L14 18" />
      <path d="M26 32 L26 18" />
      <path d="M14 18 L26 18" />
    </svg>
  );
}

export function ContractingIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="6" y="14" width="12" height="20" />
      <rect x="22" y="8" width="12" height="26" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="9" y1="26" x2="15" y2="26" />
      <line x1="25" y1="14" x2="31" y2="14" />
      <line x1="25" y1="20" x2="31" y2="20" />
      <line x1="25" y1="26" x2="31" y2="26" />
    </svg>
  );
}

export function TransportIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="4" y="14" width="20" height="14" />
      <path d="M24 18 L32 18 L36 24 L36 28 L24 28 Z" />
      <circle cx="12" cy="30" r="2.5" />
      <circle cx="30" cy="30" r="2.5" />
    </svg>
  );
}

export function CementIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <ellipse cx="20" cy="10" rx="8" ry="2.5" />
      <path d="M12 10 L12 30 Q12 33 20 33 Q28 33 28 30 L28 10" />
      <path d="M14 18 L26 18" />
      <path d="M14 24 L26 24" />
    </svg>
  );
}

// Armchair side-view — interior/decor connotation
export function DecorIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M8 22 L8 16 Q8 12 12 12 L28 12 Q32 12 32 16 L32 22" />
      <path d="M6 22 Q6 20 8 20 L32 20 Q34 20 34 22 L34 30 Q34 32 32 32 L8 32 Q6 32 6 30 Z" />
      <line x1="10" y1="32" x2="10" y2="35" />
      <line x1="30" y1="32" x2="30" y2="35" />
      <path d="M12 22 L12 28" />
      <path d="M28 22 L28 28" />
    </svg>
  );
}

// Wrench — fit-out / installation work
export function FitOutIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M27 6 A6 6 0 1 0 32 17 L34 19 L19 34 L17 32 L32 17" />
      <path d="M27 6 L24 9 L27 12 L30 9 Z" />
    </svg>
  );
}

// Shipping container with bidirectional arrows — import/export
export function ImportExportIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="10" y="14" width="20" height="14" />
      <line x1="14" y1="14" x2="14" y2="28" />
      <line x1="20" y1="14" x2="20" y2="28" />
      <line x1="26" y1="14" x2="26" y2="28" />
      <path d="M4 10 L10 10 M7 7 L10 10 L7 13" />
      <path d="M36 32 L30 32 M33 35 L30 32 L33 29" />
    </svg>
  );
}

export const divisionIcons = {
  trading: TradingIcon,
  contracting: ContractingIcon,
  decor: DecorIcon,
  'fit-out': FitOutIcon,
  'import-export': ImportExportIcon,
  transport: TransportIcon,
  cement: CementIcon,
} as const;
