import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '3bdoshoe — Crafted for Every Step',
  description: 'A beautifully crafted women\'s shoe with rich brown, gold, and reddish tones. Designed for comfort and style.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
