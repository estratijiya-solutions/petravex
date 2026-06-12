import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { useContent } from '@/lib/content';

export default function ProductsPage() {
  const content = useContent();
  const p = content.placeholders.products;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
