import { useLocale } from 'next-intl';
import { content as ar } from './content.ar';
import { content as en } from './content.en';

/**
 * Locale-aware content access. English is the primary locale; Arabic is
 * the secondary. Components call `useContent()` to get the right tree
 * based on the current request locale (next-intl).
 *
 * Both trees share the same `Content` type defined in `content.ar.ts`,
 * so misses are caught at compile time.
 */
const contents = { en, ar } as const;
export type Locale = keyof typeof contents;
export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'ar'];

/** Server-safe content getter — pass the locale explicitly. */
export function getContent(locale: string) {
  return contents[locale as Locale] ?? contents.en;
}

/**
 * Client + server component hook. `useLocale()` from next-intl works in
 * both contexts (server reads the request locale set by middleware,
 * client reads the NextIntlClientProvider context). Returns the content
 * tree for the current locale.
 */
export function useContent() {
  const locale = useLocale();
  return getContent(locale);
}
