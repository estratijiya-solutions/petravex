type IconProps = { className?: string };

const baseProps = {
  width: 32,
  height: 32,
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function BuyerIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="6" y="20" width="20" height="6" rx="1" />
      <rect x="8" y="13" width="16" height="6" rx="1" />
      <rect x="10" y="6" width="12" height="6" rx="1" />
    </svg>
  );
}

export function SupplierIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 8 L14 16 L6 24" />
      <path d="M26 8 L18 16 L26 24" />
      <line x1="14" y1="16" x2="18" y2="16" />
    </svg>
  );
}

export function CareerIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M5 26 H10 V21 H15 V16 H20 V11 H25 V6" />
      <path d="M21 6 H25 V10" />
    </svg>
  );
}
