import { Globe, Share2 } from 'lucide-react';

interface FooterProps {
  content?: Record<string, string>;
}

export default function Footer({ content }: FooterProps) {
  const brand = content?.brand || '3bdoshoe';
  const copyright = content?.copyright || '© 2025 3bdoshoe.';
  const linksStr = content?.links || 'Privacy,Terms,About,Contact';
  const links = linksStr.split(',').map((s) => s.trim()).filter(Boolean);

  const linkTargets: Record<string, string> = {
    Privacy: '/privacy',
    Terms: '/terms',
    About: '#story',
    Contact: '#features',
  };

  return (
    <footer className="bg-surface border-t border-border-subtle py-[var(--spacing-section-gap-sm)]">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-desktop)] gap-[var(--spacing-gutter)]">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-bold text-lg tracking-tighter uppercase text-primary">
            {brand}
          </span>
          <p className="text-[16px] leading-[1.6] text-text-muted">
            {copyright}
          </p>
        </div>

        <nav className="flex gap-10">
          {links.map((link) => (
            <a
              key={link}
              href={linkTargets[link] || '#'}
              className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex gap-6">
          <Globe size={20} className="text-text-muted cursor-pointer hover:text-primary transition-colors" />
          <Share2 size={20} className="text-text-muted cursor-pointer hover:text-primary transition-colors" />
        </div>
      </div>
    </footer>
  );
}
