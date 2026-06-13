'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

interface ContentItem {
  id: number;
  section: string;
  key: string;
  value: string;
  active: boolean;
}

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  social_proof: 'Social Proof Bar',
  feature: 'Features Section',
  story: 'Story Section',
  cta: 'CTA Section',
  footer: 'Footer',
};

const fieldLabels: Record<string, string> = {
  subtext: 'Subtext',
  button_text: 'Button Text',
  rating_text: 'Rating Display Text',
  press_logos: 'Press Logos (comma separated)',
  label: 'Section Label',
  title: 'Title',
  description: 'Description',
  stat_1_value: 'Stat 1 Value',
  stat_1_label: 'Stat 1 Label',
  stat_2_value: 'Stat 2 Value',
  stat_2_label: 'Stat 2 Label',
  headline: 'Headline',
  quote: 'Quote / Text',
  author: 'Author',
  disclaimer: 'Disclaimer',
  brand: 'Brand Name',
  copyright: 'Copyright Text',
  links: 'Footer Links (comma separated)',
};

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/site-content')
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        const initial: Record<string, string> = {};
        data.forEach((item: ContentItem) => {
          initial[`${item.section}.${item.key}`] = item.value;
        });
        setForm(initial);
      })
      .catch(() => {});
  }, []);

  const handleChange = (sectionKey: string, value: string) => {
    setForm((prev) => ({ ...prev, [sectionKey]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      alert('Failed to save');
    }
    setSaving(false);
  };

  const sections = Object.keys(sectionLabels);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Site Content</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-secondary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent-hover transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
          All content saved successfully!
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section) => {
          const sectionItems = content.filter((c) => c.section === section);
          if (sectionItems.length === 0) return null;

          return (
            <div key={section} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 space-y-4">
              <h2 className="font-bold text-lg text-primary border-b border-border-subtle pb-3">
                {sectionLabels[section]}
              </h2>
              {sectionItems.map((item) => {
                const formKey = `${item.section}.${item.key}`;
                const isQuote = item.key === 'quote';
                const isLongText = ['description', 'quote', 'copyright', 'disclaimer'].includes(item.key);

                return (
                  <div key={item.id}>
                    <label className="block text-sm font-medium text-on-surface mb-1">
                      {fieldLabels[item.key] || item.key}
                    </label>
                    {isLongText ? (
                      <textarea
                        value={form[formKey] || ''}
                        onChange={(e) => handleChange(formKey, e.target.value)}
                        rows={isQuote ? 4 : 3}
                        className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={form[formKey] || ''}
                        onChange={(e) => handleChange(formKey, e.target.value)}
                        className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
