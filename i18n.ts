import { getRequestConfig } from 'next-intl/server';

/**
 * Locale config. English is PRIMARY (default, no URL prefix).
 * Arabic is secondary (lives at /ar). Order matters: `defaultLocale`
 * must be first in `locales` for `as-needed` middleware behaviour.
 */
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];

/** RTL locales — used by the layout to set `dir` and pick the right font. */
export const rtlLocales: readonly Locale[] = ['ar'];

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
