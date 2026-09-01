import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // English is the PRIMARY locale — every new visitor lands on English
  // unless they explicitly navigate to /ar. Don't auto-redirect based
  // on Accept-Language; the user's request is explicit on this.
  localeDetection: false,
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
