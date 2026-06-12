'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, defaultLocale, type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

// Both labels are 2 Latin characters so the pill width stays consistent.
// "ع" alone was wider than the surrounding glyph box because Almarai
// renders it large, breaking the toggle's symmetry — user feedback was
// that the box looked wrong on the Arabic side.
const LABEL: Record<Locale, string> = {
  en: 'EN',
  ar: 'AR',
};

/**
 * Two-state language toggle (EN ↔ ع). Sits in the header navigation.
 * Computes the target URL by swapping the locale segment of the current
 * pathname:
 *   • `/` (English, default — no prefix)  → `/ar`
 *   • `/ar`                                → `/`
 *   • `/products` (English)               → `/ar/products`
 *   • `/ar/products`                       → `/products`
 *
 * Default locale (English) lives at the unprefixed root per
 * middleware's `localePrefix: 'as-needed'` policy.
 */
export function LocaleSwitcher() {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname() || '/';

  return (
    // `dir="ltr"` keeps "EN | AR" in a fixed Latin reading order regardless
    // of the surrounding page direction. Without this, the RTL page flipped
    // the visual order so AR landed on the left, and the active gold pill's
    // square outer corner poked past the parent's rounded-full boundary.
    // `overflow-hidden` belt-and-braces: clips any sub-pixel bleed of the
    // active pill's background to the parent's pill shape.
    <div
      dir="ltr"
      className="inline-flex items-center gap-0 overflow-hidden rounded-full border border-gray-soft bg-black-soft/60 backdrop-blur-sm"
    >
      {locales.map((loc) => {
        const target = swapLocale(pathname, currentLocale, loc);
        const active = loc === currentLocale;
        return (
          <Link
            key={loc}
            href={target}
            aria-current={active ? 'page' : undefined}
            aria-label={`Switch to ${loc === 'en' ? 'English' : 'العربية'}`}
            className={cn(
              // `font-body` forces Latin glyphs even when surrounding RTL
              // context would otherwise pick up Almarai for the AR label.
              'inline-flex h-7 w-10 items-center justify-center font-body text-[11px] font-semibold tracking-[0.12em] transition-colors duration-300 ease-signature',
              active ? 'bg-gold text-black' : 'text-gray-light hover:text-gold',
            )}
          >
            {LABEL[loc]}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Swap the locale segment of a path. Treats the default locale as the
 * "no-prefix" case (e.g. English at `/`, not `/en`).
 */
function swapLocale(pathname: string, from: Locale, to: Locale): string {
  // Strip current locale prefix if any (only non-default locales carry a prefix)
  let rest = pathname;
  if (from !== defaultLocale) {
    const prefix = `/${from}`;
    if (rest === prefix) rest = '/';
    else if (rest.startsWith(`${prefix}/`)) rest = rest.slice(prefix.length);
  }
  // Add new locale prefix unless it's the default
  if (to === defaultLocale) return rest;
  return rest === '/' ? `/${to}` : `/${to}${rest}`;
}
