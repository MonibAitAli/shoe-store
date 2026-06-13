interface StorySectionProps {
  content?: Record<string, string>;
}

export default function StorySection({ content }: StorySectionProps) {
  return (
    <section className="py-[var(--spacing-section-gap-lg)] bg-surface" id="story">
      <div className="max-w-3xl mx-auto px-[var(--spacing-margin-desktop)] text-center space-y-10">
        <h2 className="text-[40px] font-semibold leading-[1.2] text-primary">
          {content?.headline || 'The Story'}
        </h2>
        <div className="w-16 h-1 bg-secondary mx-auto" />
        <p className="text-[18px] leading-relaxed text-text-muted italic">
          &quot;{content?.quote || 'Our story.'}&quot;
        </p>
        <p className="font-semibold uppercase tracking-wider text-sm text-primary">
          — {content?.author || '3bdoshoe'}
        </p>
        {content?.disclaimer && (
          <p className="text-xs text-muted max-w-md mx-auto">
            {content.disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
