import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { useContent } from '@/lib/content';

export default function CareersPage() {
  const content = useContent();
  const p = content.placeholders.careers;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
