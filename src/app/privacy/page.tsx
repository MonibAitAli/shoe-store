export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">Privacy Policy</h1>
      <p className="text-sm text-muted mb-10">Last updated: June 13, 2025</p>

      <div className="space-y-8 text-[16px] leading-relaxed text-on-surface">
        <section>
          <h2 className="text-xl font-bold text-primary mb-3">1. Information We Collect</h2>
          <p className="text-on-surface-variant">We collect the information you provide when placing an order, including your name, phone number, city, and delivery address. We also receive your message content when you contact us via WhatsApp.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
            <li>Processing and delivering your orders</li>
            <li>Communicating with you about your order via WhatsApp</li>
            <li>Improving our products and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-3">3. Data Storage</h2>
          <p className="text-on-surface-variant">Your order information is stored securely in our database. We do not share, sell, or distribute your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-3">4. WhatsApp Communications</h2>
          <p className="text-on-surface-variant">Order confirmations and communications are sent via WhatsApp, which is governed by WhatsApp&apos;s own Privacy Policy. We do not control WhatsApp&apos;s data practices.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-3">5. Your Rights</h2>
          <p className="text-on-surface-variant">You have the right to request access to, correction of, or deletion of your personal data at any time by contacting us via WhatsApp.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-3">6. Contact</h2>
          <p className="text-on-surface-variant">If you have any questions about this Privacy Policy, please contact us via the WhatsApp button on our website.</p>
        </section>
      </div>
    </div>
  );
}
