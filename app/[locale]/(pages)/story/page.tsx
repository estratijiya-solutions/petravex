import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { useContent } from '@/lib/content';

export default function StoryPage() {
  const content = useContent();
  const p = content.placeholders.story;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
