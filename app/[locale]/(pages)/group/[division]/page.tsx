import { notFound } from 'next/navigation';
import { content } from '@/lib/content.ar';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

const slugMap = {
  trading: 'trading',
  contracting: 'contracting',
  transport: 'transport',
  cement: 'cement',
} as const;

export function generateStaticParams() {
  return Object.keys(slugMap).map((division) => ({ division }));
}

export default function DivisionPage({ params }: { params: { division: string } }) {
  if (!(params.division in slugMap)) notFound();
  const item = content.divisions.items.find((d) => d.key === params.division);
  if (!item) notFound();
  return (
    <PlaceholderPage
      eyebrow="المجموعة"
      title={item.name}
      description={`${item.location} — ستجد هنا التفاصيل الكاملة لشركة ${item.name} ضمن مجموعة بترافكس.`}
    />
  );
}
