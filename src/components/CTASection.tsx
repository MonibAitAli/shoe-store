'use client';

import { useRouter } from 'next/navigation';

interface CTASectionProps {
  settings: Record<string, string>;
  content?: Record<string, string>;
}

export default function CTASection({ settings, content }: CTASectionProps) {
  const router = useRouter();

  const handleBuyNow = () => {
    router.push('/checkout');
  };

  return (
    <section className="py-[var(--spacing-section-gap-lg)] bg-primary-container text-white text-center">
      <div className="max-w-xl mx-auto px-4 md:px-[var(--spacing-margin-desktop)]">
        <h2 className="text-[40px] font-semibold leading-[1.2] mb-4">
          {content?.headline || 'Step into elegance.'}
        </h2>
        <p className="text-[18px] leading-[1.6] text-on-primary-container mb-12">
          {settings.product_price ? `${settings.product_price} MAD` : ''} — {content?.subtext || 'Free Shipping & 30-Day Comfort Guarantee.'}
        </p>
        <div className="space-y-4">
          <button
            onClick={handleBuyNow}
            className="w-full md:w-auto bg-white text-primary font-semibold uppercase tracking-wider px-16 py-6 rounded-full hover:bg-surface-container-low transition-all duration-300 shadow-xl text-sm cursor-pointer"
          >
            {content?.button_text || 'Buy Now'}
          </button>
          <p className="text-xs text-on-primary-container mt-6">
            {content?.subtext || 'Free Shipping & 30-Day Comfort Guarantee.'}
          </p>
        </div>
      </div>
    </section>
  );
}
