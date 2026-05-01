'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { content } from '@/lib/content.ar';
import { LogoMark } from '@/components/ui/LogoMark';

const navItems = [
  { href: '/', key: 'home' as const },
  { href: '/story', key: 'story' as const },
  { href: '/group', key: 'group' as const },
  { href: '/products', key: 'products' as const },
  { href: '/suppliers', key: 'suppliers' as const },
  { href: '/careers', key: 'careers' as const },
  { href: '/contact', key: 'contact' as const },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-y-0 right-0 w-full max-w-sm bg-black border-l border-gray-soft px-8 py-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-12">
              <Link href="/" onClick={onClose} className="flex items-center gap-3">
                <LogoMark size={32} />
                <span className="font-arabic text-base font-bold text-white">بترافكس</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-white hover:text-gold transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <ul className="flex flex-col gap-1 flex-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block py-4 font-arabic text-2xl text-white/85 hover:text-gold transition-colors duration-300 border-b border-gray-soft"
                  >
                    {content.nav[item.key]}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto pt-8 text-sm text-gray-light font-arabic">
              <p className="font-tech">{content.footer.contact.email}</p>
              <p className="font-tech mt-1">{content.footer.contact.phone}</p>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
