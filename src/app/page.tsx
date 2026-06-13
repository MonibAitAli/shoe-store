import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SocialProofBar from '@/components/SocialProofBar';
import FeatureSection from '@/components/FeatureSection';
import StorySection from '@/components/StorySection';
import ReviewsSection from '@/components/ReviewsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

async function getSiteData() {
  try {
    // Settings
    const settingsRows = await prisma.setting.findMany();
    const settings: Record<string, string> = {};
    settingsRows.forEach((s) => { settings[s.key] = s.value; });

    // Site Content (grouped by section)
    const contentRows = await prisma.siteContent.findMany({
      where: { active: true },
    });
    const content: Record<string, Record<string, string>> = {};
    contentRows.forEach((c) => {
      if (!content[c.section]) content[c.section] = {};
      content[c.section][c.key] = c.value;
    });

    // Reviews
    const reviews = await prisma.review.findMany({
      where: { active: true },
      orderBy: { order_pos: 'asc' },
    });

    return { settings, content, reviews };
  } catch {
    return { settings: {}, content: {}, reviews: [] };
  }
}

export default async function HomePage() {
  const { settings, content, reviews } = await getSiteData();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection settings={settings} content={content.hero} />
        <SocialProofBar content={content.social_proof} />
        <FeatureSection settings={settings} content={content.feature} />
        <div id="details">
          <StorySection content={content.story} />
        </div>
        <ReviewsSection reviews={reviews} />
        <CTASection settings={settings} content={content.cta} />
      </main>
      <Footer content={content.footer} />
      <WhatsAppFloat />
    </div>
  );
}
