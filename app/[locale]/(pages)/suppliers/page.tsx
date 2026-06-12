import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { useContent } from '@/lib/content';

export default function SuppliersPage() {
  const content = useContent();
  const p = content.placeholders.suppliers;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
