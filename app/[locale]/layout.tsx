import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Montserrat, Almarai } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
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

export const metadata: Metadata = {
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
};

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

  return (
    <html
      lang={locale}
      dir="rtl"
      className={`${cormorant.variable} ${montserrat.variable} ${almarai.variable}`}
    >
      <body className="bg-black text-white/85 font-arabic antialiased">
        <GrainOverlay />
        <ScrollProgressBar />
        <CustomCursor />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        <BackToTop />
      </body>
    </html>
  );
}
