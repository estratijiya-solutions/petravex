import { SectionHeader } from './SectionHeader';
import { Button } from './Button';
import { PatternBg } from './PatternBg';

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PlaceholderPage({ eyebrow, title, description }: Props) {
  return (
    <section className="relative overflow-hidden">
      <PatternBg variant="arches" opacity={0.04} />
      <div className="relative mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={description} align="center" />
        <div className="mt-16 flex justify-center">
          <Button href="/">العودة إلى الرئيسية</Button>
        </div>
      </div>
    </section>
  );
}
