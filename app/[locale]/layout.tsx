import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Montserrat, Almarai } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isRtl, type Locale } from '@/i18n';
import {
  SITE_URL,
  SITE_NAME,
  OG_IMAGE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  GOOGLE_SITE_VERIFICATION,
  localeUrl,
} from '@/lib/seo';
import { GA4 } from '@/components/analytics/GA4';
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
//
// This is the DEFAULT layer only: every route supplies its own title,
// description, canonical and hreflang through `pageMetadata()` in
// `lib/seo.ts`. What stays here is what is genuinely site-wide — the
// metadataBase, the title template, the share image and the Search
// Console verification tag.
const SHARED: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Emitted only once Taif pastes the real token into `lib/seo.ts`.
  // While the constant is empty, no verification tag is rendered at all.
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
};

const META: Record<Locale, Metadata> = {
  en: {
    ...SHARED,
    title: {
      default: 'Petravex — An integrated building-materials group',
      template: '%s — Petravex',
    },
    description:
      'Petravex: from stone, we build the future. Multiple companies, one purpose across the UAE.',
    openGraph: {
      title: 'Petravex — An integrated building-materials group',
      description: 'From stone, we build the future. Multiple companies, one purpose.',
      siteName: SITE_NAME,
      url: localeUrl('en', ''),
      locale: 'en_AE',
      type: 'website',
      images: [{ url: OG_IMAGE, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Petravex — An integrated building-materials group',
      description: 'From stone, we build the future. Multiple companies, one purpose.',
      images: [OG_IMAGE],
    },
  },
  ar: {
    ...SHARED,
    title: {
      default: 'بترافكس — مجموعة متكاملة لمواد البناء',
      template: '%s — بترافكس',
    },
    description: 'بترافكس: من الحجر، نبني المستقبل. شركات متعددة بهدف واحد عبر الإمارات.',
    openGraph: {
      title: 'بترافكس — مجموعة متكاملة لمواد البناء',
      description: 'من الحجر، نبني المستقبل. شركات متعددة بهدف واحد.',
      siteName: SITE_NAME,
      url: localeUrl('ar', ''),
      locale: 'ar_AE',
      type: 'website',
      images: [{ url: OG_IMAGE, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'بترافكس — مجموعة متكاملة لمواد البناء',
      description: 'من الحجر، نبني المستقبل. شركات متعددة بهدف واحد.',
      images: [OG_IMAGE],
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return META[locale as Locale] ?? META.en;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
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
        {/* Renders nothing at all until a real GA4 Measurement ID is set
            in `lib/seo.ts`. No markup, no layout box, no request. */}
        <GA4 />
      </body>
    </html>
  );
}
