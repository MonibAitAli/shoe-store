'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  settings: Record<string, string>;
  content: Record<string, string>;
}

function isBase64(src: string) {
  return src.startsWith('data:');
}

export default function HeroSection({ settings, content }: HeroSectionProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(settings.hero_image || settings.hero_image_url || '');

  useEffect(() => {
    setImageUrl(settings.hero_image || settings.hero_image_url || '');
  }, [settings.hero_image, settings.hero_image_url]);

  const handleShopNow = () => {
    router.push('/checkout');
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" id="shop">
      <div className="absolute inset-0 z-0">
        {imageUrl ? (
          isBase64(imageUrl) ? (
            <img
              src={imageUrl}
              alt={settings.product_name || '3bdoshoe'}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={settings.product_name || '3bdoshoe'}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-container via-surface-container-low to-surface" />
        )}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      <div className="relative z-10 text-center max-w-4xl px-4 md:px-[var(--spacing-margin-desktop)]">
        <h1 className="text-[40px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.02em] text-primary mb-6 animate-fade-in-up">
          {settings.product_name || 'Elegant Women\'s Shoe'}
        </h1>
        <p className="text-[18px] leading-[1.6] text-on-surface-variant mb-10 max-w-xl mx-auto">
          {content?.subtext || 'Crafted for comfort. Designed for every step.'}
        </p>
        <button
          onClick={handleShopNow}
          className="inline-block bg-secondary hover:bg-accent-hover text-white font-semibold uppercase tracking-wider px-12 py-5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-secondary/20 text-sm cursor-pointer"
        >
          {content?.button_text || 'Shop Now'} — {settings.product_price ? `${settings.product_price} MAD` : ''}
        </button>
      </div>
    </section>
  );
}
