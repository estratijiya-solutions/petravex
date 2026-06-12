'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useContent } from '@/lib/content';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/ui/LogoMark';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MobileMenu } from './MobileMenu';

const navItems = [
  { href: '/', key: 'home' as const },
  { href: '/story', key: 'story' as const },
  { href: '/group', key: 'group' as const },
  { href: '/products', key: 'products' as const },
  { href: '/suppliers', key: 'suppliers' as const },
  { href: '/careers', key: 'careers' as const },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const content = useContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ease-signature',
          scrolled
            ? 'bg-black/80 backdrop-blur-md border-b border-gray-soft'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <LogoMark
              size={36}
              priority
              className="transition-transform duration-500 ease-signature group-hover:scale-105"
            />
            <span className="font-display rtl:font-arabic text-base md:text-lg font-bold text-white tracking-[0.18em] rtl:tracking-wide">
              {content.hero.wordmark}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm text-white/80 hover:text-gold transition-colors duration-300 ease-signature relative group"
              >
                <span>{content.nav[item.key]}</span>
                <span className="absolute -bottom-1 right-0 left-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 origin-start transition-transform duration-300 ease-signature" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium border border-gold/60 text-white hover:border-gold hover:bg-gold/5 transition-all duration-300 ease-signature"
            >
              {content.nav.contact}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:text-gold transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
