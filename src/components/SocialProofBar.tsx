'use client';

import { Star } from 'lucide-react';

interface SocialProofBarProps {
  content?: Record<string, string>;
}

export default function SocialProofBar({ content }: SocialProofBarProps) {
  const ratingText = content?.rating_text || '4.9 Rating by 12,000+ Customers';
  const pressLogosStr = content?.press_logos || 'VOGUE,ELLE,Harper\'s,InStyle';
  const pressLogos = pressLogosStr.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <section className="py-12 bg-surface-container-lowest border-y border-border-subtle">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-desktop)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-[var(--spacing-gutter)]">
          <div className="flex items-center gap-2">
            <div className="flex text-status-urgency">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
              <Star size={20} fill="currentColor" className="opacity-50" />
            </div>
            <span className="text-sm font-medium text-on-surface ml-2">
              {ratingText}
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-10 opacity-40 grayscale">
            {pressLogos.map((logo) => (
              <span key={logo} className="text-xl font-bold italic">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
