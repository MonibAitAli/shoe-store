'use client';

import { useEffect, useState } from 'react';
import { Save, MessageCircle, DollarSign, Image } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-primary mb-6">Store Settings</h1>

      <div className="space-y-6">
        {/* WhatsApp */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg text-primary flex items-center gap-2">
            <MessageCircle size={18} className="text-green-600" />
            WhatsApp
          </h2>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">WhatsApp Number (Orders)</label>
            <p className="text-xs text-muted mb-2">Used for order confirmations</p>
            <input
              type="text"
              value={settings.whatsapp_number || ''}
              onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
              placeholder="+212XXXXXXXXX"
              dir="ltr"
            />
          </div>
        </div>

        {/* Product */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg text-primary flex items-center gap-2">
            <DollarSign size={18} className="text-secondary" />
            Product
          </h2>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Product Name</label>
            <input
              type="text"
              value={settings.product_name || ''}
              onChange={(e) => handleChange('product_name', e.target.value)}
              className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Price (MAD)</label>
            <input
              type="text"
              value={settings.product_price || ''}
              onChange={(e) => handleChange('product_price', e.target.value)}
              className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
              placeholder="599.00"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Product Description</label>
            <textarea
              value={settings.product_description || ''}
              onChange={(e) => handleChange('product_description', e.target.value)}
              rows={3}
              className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest resize-none"
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg text-primary flex items-center gap-2">
            <Image size={18} className="text-muted" />
            Images
          </h2>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Hero Image URL</label>
            <input
              type="text"
              value={settings.hero_image_url || ''}
              onChange={(e) => handleChange('hero_image_url', e.target.value)}
              className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
              placeholder="https://example.com/hero.jpg"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Feature Image URL</label>
            <input
              type="text"
              value={settings.feature_image_url || ''}
              onChange={(e) => handleChange('feature_image_url', e.target.value)}
              className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
              placeholder="https://example.com/feature.jpg"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Sole/Detail Image URL</label>
            <input
              type="text"
              value={settings.sole_image_url || ''}
              onChange={(e) => handleChange('sole_image_url', e.target.value)}
              className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
              placeholder="https://example.com/sole.jpg"
              dir="ltr"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-secondary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent-hover transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && <p className="text-green-600 text-sm font-medium">Settings saved!</p>}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      </div>
    </div>
  );
}
