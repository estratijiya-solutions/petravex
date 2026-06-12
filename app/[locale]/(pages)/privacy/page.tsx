import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { useContent } from '@/lib/content';

export default function PrivacyPage() {
  const content = useContent();
  const p = content.placeholders.privacy;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
