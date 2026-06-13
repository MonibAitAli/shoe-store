'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FeatureSectionProps {
  settings: Record<string, string>;
  content?: Record<string, string>;
}

export default function FeatureSection({ settings, content }: FeatureSectionProps) {
  const [imageUrl, setImageUrl] = useState(settings.feature_image_url || '');

  useEffect(() => {
    setImageUrl(settings.feature_image_url || '');
  }, [settings.feature_image_url]);

  return (
    <section className="py-[var(--spacing-section-gap-lg)] bg-surface" id="features">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-desktop)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="rounded-lg overflow-hidden hover-scale shadow-sm">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Shoe detail"
                width={600}
                height={600}
                className="w-full h-[400px] md:h-[600px] object-cover"
              />
            ) : (
              <div className="w-full h-[400px] md:h-[600px] bg-surface-container flex items-center justify-center text-muted">
                <span className="text-sm">Feature Image</span>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <span className="font-semibold uppercase tracking-widest text-secondary text-sm">
              {content?.label || 'Materials'}
            </span>
            <h2 className="text-[40px] font-semibold leading-[1.2] text-primary">
              {content?.title || 'Rich Tones, Refined Craft'}
            </h2>
            <p className="text-[18px] leading-relaxed text-text-muted">
              {content?.description || 'Inspired by timeless European design.'}
            </p>

            <div className="pt-6 border-t border-border-subtle flex gap-10">
              <div>
                <p className="text-[24px] font-semibold text-primary">{content?.stat_1_value || 'Premium'}</p>
                <p className="text-sm text-text-muted uppercase font-medium">{content?.stat_1_label || 'Quality Materials'}</p>
              </div>
              <div>
                <p className="text-[24px] font-semibold text-primary">{content?.stat_2_value || 'All-Day'}</p>
                <p className="text-sm text-text-muted uppercase font-medium">{content?.stat_2_label || 'Comfort Fit'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
