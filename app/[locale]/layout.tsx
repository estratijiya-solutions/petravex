import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Montserrat, Almarai } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isRtl, type Locale } from '@/i18n';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { BackToTop } from '@/components/ui/BackToTop';
import '../globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Per-locale metadata. The page reaches both English- and Arabic-
// speaking audiences; we serve each with their own canonical title +
// description and the correct OG locale tag.
const META: Record<Locale, Metadata> = {
  en: {
    metadataBase: new URL('https://petravex.com'),
    title: {
      default: 'Petravex — An integrated building-materials group',
      template: '%s — Petravex',
    },
    description:
      'Petravex: from stone, we build the future. Multiple companies, one purpose across the UAE.',
    openGraph: {
      title: 'Petravex — An integrated building-materials group',
      description: 'From stone, we build the future. Multiple companies, one purpose.',
      locale: 'en_AE',
      type: 'website',
    },
  },
  ar: {
    metadataBase: new URL('https://petravex.com'),
    title: {
      default: 'بترافكس — مجموعة متكاملة لمواد البناء',
      template: '%s — بترافكس',
    },
    description: 'بترافكس: من الحجر، نبني المستقبل. شركات متعددة بهدف واحد عبر الإمارات.',
    openGraph: {
      title: 'بترافكس — مجموعة متكاملة لمواد البناء',
      description: 'من الحجر، نبني المستقبل. شركات متعددة بهدف واحد.',
      locale: 'ar_AE',
      type: 'website',
    },
  },
};

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  return META[locale as Locale] ?? META.en;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  const rtl = isRtl(locale);
  // Per-locale body font: English uses Montserrat (font-body), Arabic
  // uses Almarai (font-arabic). Tailwind `rtl:` variants on individual
  // components override this when the design calls for a serif (e.g.,
  // the hero wordmark uses Cormorant Garamond in English).
  const bodyFont = rtl ? 'font-arabic' : 'font-body';

  return (
    <html
      lang={locale}
      dir={rtl ? 'rtl' : 'ltr'}
      className={`${cormorant.variable} ${montserrat.variable} ${almarai.variable}`}
    >
      <body className={`bg-black text-white/85 ${bodyFont} antialiased`}>
        <GrainOverlay />
        <ScrollProgressBar />
        <CustomCursor />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        <BackToTop />
      </body>
    </html>
  );
}
