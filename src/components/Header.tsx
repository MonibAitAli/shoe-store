'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentY > lastScrollY.current && currentY > 100) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-md border-b border-border-subtle shadow-sm'
          : 'bg-transparent'
      } ${navVisible ? 'nav-visible' : 'nav-hidden'}`}
      style={{ height: '80px' }}
    >
      <div className="flex justify-between items-center max-w-[var(--spacing-container-max)] mx-auto h-full px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <Link href="/" className="font-bold text-lg tracking-tighter uppercase text-primary">
          3bdoshoe
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <a href="#shop" className="text-primary border-b-2 border-primary pb-1 font-semibold uppercase tracking-wider text-sm transition-colors">
            Shop
          </a>
          <a href="#story" className="text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider text-sm">
            Story
          </a>
          <a href="#features" className="text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider text-sm">
            Features
          </a>
        </nav>

        <button
          className="md:hidden text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-border-subtle">
          <nav className="flex flex-col p-6 gap-4">
            <a href="#shop" className="text-primary font-semibold uppercase tracking-wider text-sm" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </a>
            <a href="#story" className="text-on-surface-variant font-semibold uppercase tracking-wider text-sm" onClick={() => setMobileMenuOpen(false)}>
              Story
            </a>
            <a href="#features" className="text-on-surface-variant font-semibold uppercase tracking-wider text-sm" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
