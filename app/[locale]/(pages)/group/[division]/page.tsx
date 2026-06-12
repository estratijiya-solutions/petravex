import { notFound } from 'next/navigation';
import { useContent } from '@/lib/content';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

const slugMap = {
  trading: 'trading',
  contracting: 'contracting',
  decor: 'decor',
  'fit-out': 'fit-out',
  'import-export': 'import-export',
  transport: 'transport',
  cement: 'cement',
} as const;

export function generateStaticParams() {
  return Object.keys(slugMap).map((division) => ({ division }));
}

export default function DivisionPage({ params }: { params: { division: string } }) {
  if (!(params.division in slugMap)) notFound();
  const content = useContent();
  const item = content.divisions.items.find((d) => d.key === params.division);
  if (!item) notFound();
  return (
    <PlaceholderPage
      eyebrow={content.nav.group}
      title={item.name}
      description={`${item.location} — ${item.name}.`}
    />
  );
}
