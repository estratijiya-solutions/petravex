import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { useContent } from '@/lib/content';

export default function ProjectsPage() {
  const content = useContent();
  const p = content.placeholders.projects;
  return <PlaceholderPage eyebrow={p.eyebrow} title={p.title} description={p.description} />;
}
