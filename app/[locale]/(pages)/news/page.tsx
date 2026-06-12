import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { useContent } from '@/lib/content';

export default function NewsPage() {
  const content = useContent();
  const p = content.placeholders.news;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
