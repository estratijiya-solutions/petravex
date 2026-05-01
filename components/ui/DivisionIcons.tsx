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

export const divisionIcons = {
  trading: TradingIcon,
  contracting: ContractingIcon,
  transport: TransportIcon,
  cement: CementIcon,
} as const;
