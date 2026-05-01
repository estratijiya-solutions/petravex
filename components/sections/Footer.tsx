import Link from 'next/link';
import { content } from '@/lib/content.ar';
import { PatternBg } from '@/components/ui/PatternBg';
import { LogoMark } from '@/components/ui/LogoMark';

export function Footer() {
  const f = content.footer;
  return (
    <footer className="relative bg-black border-t border-gray-soft overflow-hidden">
      <PatternBg variant="chevrons" opacity={0.04} />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <LogoMark size={44} />
              <span className="font-arabic text-xl font-bold text-white">بترافكس</span>
            </Link>
            <p className="font-arabic text-base text-gray-light max-w-md leading-relaxed">
              {f.description}
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <FooterColumn
              title={f.locations.title}
              items={f.locations.items.map((name) => ({ name, href: undefined }))}
            />
            <FooterColumn title={f.group.title} items={f.group.items} />
            <FooterColumn title={f.links.title} items={f.links.items} />
            <div>
              <h3 className="font-arabic text-xs tracking-caption text-gold uppercase mb-4">
                {f.contact.title}
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                <li>
                  <a
                    href={`mailto:${f.contact.email}`}
                    className="font-tech text-white/80 hover:text-gold transition-colors"
                  >
                    {f.contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${f.contact.phone.replace(/\s/g, '')}`}
                    className="font-tech text-white/80 hover:text-gold transition-colors"
                  >
                    {f.contact.phone}
                  </a>
                </li>
                <li>
                  <span className="font-tech text-white/80">{f.contact.website}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="h-px bg-gold/30 w-full mb-8" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-gray-light font-arabic">
          <p>{f.copyright}</p>
          <Link href="/privacy" className="hover:text-gold transition-colors">
            {f.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}

type ColItem = { name: string; href?: string };

function FooterColumn({ title, items }: { title: string; items: readonly ColItem[] }) {
  return (
    <div>
      <h3 className="font-arabic text-xs tracking-caption text-gold uppercase mb-4">{title}</h3>
      <ul className="flex flex-col gap-2 text-sm font-arabic">
        {items.map((item, i) => (
          <li key={`${item.name}-${i}`}>
            {item.href ? (
              <Link
                href={item.href}
                className="text-white/80 hover:text-gold transition-colors duration-300 ease-signature"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-white/80">{item.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
