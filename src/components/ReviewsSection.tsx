import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section-gap-lg)] bg-surface-container-lowest">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-desktop)]">
        <h2 className="text-[40px] font-semibold leading-[1.2] text-center mb-16 text-primary">
          Real Stories of Comfort
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className={`p-10 border border-border-subtle hover:border-secondary transition-colors duration-300 ${
                i === 1 && reviews.length === 3 ? 'bg-surface-container' : ''
              }`}
            >
              <div className="flex text-status-urgency mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={18} fill={j < review.rating ? 'currentColor' : 'none'} stroke="currentColor" />
                ))}
              </div>
              <p className="text-[16px] leading-[1.6] text-primary mb-8">
                &quot;{review.text}&quot;
              </p>
              <p className="font-semibold uppercase tracking-wider text-sm text-on-surface-variant">
                {review.name} | {review.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
