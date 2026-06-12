import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { useContent } from '@/lib/content';

export default function SustainabilityPage() {
  const content = useContent();
  const p = content.placeholders.sustainability;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
