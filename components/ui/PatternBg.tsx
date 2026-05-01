import { cn } from '@/lib/utils';

type Props = {
  variant?: 'arches' | 'chevrons';
  className?: string;
  opacity?: number;
};

export function PatternBg({ variant = 'arches', className, opacity = 0.08 }: Props) {
  const url = variant === 'arches' ? '/patterns/pattern-arches.svg' : '/patterns/pattern-chevrons.svg';
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 mix-blend-overlay', className)}
      style={{
        backgroundImage: `url(${url})`,
        backgroundRepeat: 'repeat',
        backgroundSize: variant === 'arches' ? '120px 160px' : '160px 160px',
        opacity,
      }}
    />
  );
}
