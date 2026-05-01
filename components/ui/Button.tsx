'use client';

import Link from 'next/link';
import { forwardRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'gold';

type CommonProps = {
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type LinkButtonProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

const base =
  'inline-flex items-center gap-2 px-6 py-3 text-sm font-arabic font-medium tracking-wide ' +
  'transition-all duration-300 ease-signature group ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black';

const variants: Record<Variant, string> = {
  primary:
    'border border-gold/60 text-white hover:border-gold hover:bg-gold/5 ' +
    'hover:shadow-[0_0_24px_-6px_rgba(212,175,55,0.5)]',
  ghost:
    'border border-transparent text-gold hover:text-gold hover:bg-gold/5',
  gold:
    'bg-gold text-black border border-gold hover:bg-transparent hover:text-gold',
};

const Arrow = () => (
  <ArrowLeft
    aria-hidden
    className="h-4 w-4 transition-transform duration-300 ease-signature group-hover:-translate-x-1"
    strokeWidth={1.5}
  />
);

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | LinkButtonProps>(
  ({ variant = 'primary', withArrow = true, className, children, ...props }, ref) => {
    const classes = cn(base, variants[variant], className);
    if ('href' in props && props.href) {
      const { href, ...rest } = props as LinkButtonProps;
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...rest}
        >
          <span>{children}</span>
          {withArrow && <Arrow />}
        </Link>
      );
    }
    const { ...rest } = props as ButtonProps;
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...rest}>
        <span>{children}</span>
        {withArrow && <Arrow />}
      </button>
    );
  }
);

Button.displayName = 'Button';
