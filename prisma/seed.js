const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Settings
  const defaults = [
    { key: 'whatsapp_number', value: '+212639942052' },
    { key: 'product_name', value: "Elegant Women's Shoe" },
    { key: 'product_price', value: '599.00' },
    { key: 'product_description', value: 'A beautifully crafted women\'s shoe with rich brown, gold, and reddish tones.' },
    { key: 'hero_image_url', value: '' },
    { key: 'feature_image_url', value: '' },
    { key: 'sole_image_url', value: '' },
  ];

  for (const setting of defaults) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Site Content
  const content = [
    // Hero
    { section: 'hero', key: 'subtext', value: 'Rich brown, gold & reddish tones. Designed for comfort. Crafted for every step.' },
    { section: 'hero', key: 'button_text', value: 'Shop Now' },
    // Social Proof
    { section: 'social_proof', key: 'rating_text', value: '4.9 Rating by 12,000+ Customers' },
    { section: 'social_proof', key: 'press_logos', value: 'VOGUE,ELLE,Harper\'s,InStyle' },
    // Feature
    { section: 'feature', key: 'label', value: 'Materials' },
    { section: 'feature', key: 'title', value: 'Rich Tones, Refined Craft' },
    { section: 'feature', key: 'description', value: 'Inspired by timeless European design, this women\'s shoe features rich brown leather with gold and reddish accents. Every detail is considered — from the curved silhouette to the comfortable inner sole. Designed for women who move through the world with intention.' },
    { section: 'feature', key: 'stat_1_value', value: 'Premium' },
    { section: 'feature', key: 'stat_1_label', value: 'Quality Materials' },
    { section: 'feature', key: 'stat_2_value', value: 'All-Day' },
    { section: 'feature', key: 'stat_2_label', value: 'Comfort Fit' },
    // Story
    { section: 'story', key: 'headline', value: 'The 3bdoshoe Story' },
    { section: 'story', key: 'quote', value: 'We believe every woman deserves a shoe that transitions seamlessly from morning meetings to evening plans. 3bdoshoe was born from the idea that luxury design shouldn\'t come with a luxury price tag. Every pair is carefully selected for its blend of style, comfort, and the kind of detail that turns heads.' },
    { section: 'story', key: 'author', value: '3bdoshoe Team' },
    { section: 'story', key: 'disclaimer', value: 'This product is inspired by Zara\'s design and is sold independently by 3bdoshoe. Zara is a registered trademark of Inditex. This store is not affiliated with or endorsed by Zara.' },
    // CTA
    { section: 'cta', key: 'headline', value: 'Step into elegance.' },
    { section: 'cta', key: 'subtext', value: 'Free Shipping & 30-Day Comfort Guarantee.' },
    { section: 'cta', key: 'button_text', value: 'Buy Now' },
    // Footer
    { section: 'footer', key: 'brand', value: '3bdoshoe' },
    { section: 'footer', key: 'copyright', value: '© 2025 3bdoshoe. Designed for elegance.' },
    { section: 'footer', key: 'links', value: 'Privacy,Terms,About,Contact' },
  ];

  for (const item of content) {
    await prisma.siteContent.upsert({
      where: { section_key: { section: item.section, key: item.key } },
      update: {},
      create: item,
    });
  }

  // Reviews
  const reviews = [
    { name: 'Sara M.', location: 'Riyadh', text: 'I\'ve worn these every single day for two months. The brown and gold tones match everything in my wardrobe. So comfortable!', rating: 5 },
    { name: 'Nour K.', location: 'Casablanca', text: 'The quality is amazing for the price. They look much more expensive than they are. I\'ve gotten so many compliments.', rating: 5 },
    { name: 'Lina R.', location: 'Dubai', text: 'Perfect for both casual and dressed-up looks. The reddish tones are gorgeous in person. Highly recommend!', rating: 5 },
  ];

  for (let i = 0; i < reviews.length; i++) {
    await prisma.review.create({
      data: { ...reviews[i], order_pos: i },
    });
  }

  console.log('Seeded settings, site content, and reviews');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
