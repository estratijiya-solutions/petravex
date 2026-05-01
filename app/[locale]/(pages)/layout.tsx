import { unstable_setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/sections/Footer';

export default function PagesLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <>
      <Header />
      <main className="pt-24 md:pt-32 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
