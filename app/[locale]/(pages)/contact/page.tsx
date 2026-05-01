import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { content } from '@/lib/content.ar';

export const metadata = { title: 'تواصل' };

export default function ContactPage() {
  const c = content.footer.contact;
  return (
    <>
      <PlaceholderPage
        eyebrow="تواصل"
        title="نسمعك"
        description="للمشتريات والشراكات والاستفسارات العامة. نموذج التواصل التفاعلي قيد التحضير."
      />
      <section className="mx-auto max-w-3xl px-6 md:px-10 pb-24 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="rounded-lg border border-gray-soft bg-black-soft p-6">
            <div className="font-arabic text-xs uppercase tracking-caption text-gold mb-2">البريد</div>
            <a href={`mailto:${c.email}`} className="font-tech text-white hover:text-gold transition-colors">
              {c.email}
            </a>
          </div>
          <div className="rounded-lg border border-gray-soft bg-black-soft p-6">
            <div className="font-arabic text-xs uppercase tracking-caption text-gold mb-2">الهاتف</div>
            <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="font-tech text-white hover:text-gold transition-colors">
              {c.phone}
            </a>
          </div>
          <div className="rounded-lg border border-gray-soft bg-black-soft p-6">
            <div className="font-arabic text-xs uppercase tracking-caption text-gold mb-2">الموقع</div>
            <span className="font-tech text-white">{c.website}</span>
          </div>
        </div>
      </section>
    </>
  );
}
