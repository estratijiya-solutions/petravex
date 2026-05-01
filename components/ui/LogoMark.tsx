import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** Total height/width in pixels — the official logo is square. */
  size?: number;
  priority?: boolean;
};

/**
 * Petravex official P monogram — uses the brand-supplied PNG asset
 * dropped into /public/logo.png. Render via next/image for proper
 * optimization, srcset, and lazy loading.
 *
 * Color is baked into the PNG (gold on transparent), so this component
 * doesn't honour currentColor. Sizing is square.
 */
export function LogoMark({ className, size = 32, priority = false }: Props) {
  return (
    <Image
      src="/logo.png"
      alt="Petravex"
      width={size}
      height={size}
      priority={priority}
      className={cn('shrink-0', className)}
    />
  );
}
