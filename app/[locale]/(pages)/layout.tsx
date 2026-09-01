import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/sections/Footer';

export default async function PagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main className="pt-24 md:pt-32 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
