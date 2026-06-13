'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    location: '',
    text: '',
    rating: '5',
    active: true,
    order_pos: '',
  });

  useEffect(() => {
    params.then((p) => {
      fetch(`/api/admin/reviews/${p.id}`)
        .then((r) => r.json())
        .then((data) => {
          setForm({
            name: data.name || '',
            location: data.location || '',
            text: data.text || '',
            rating: data.rating?.toString() || '5',
            active: data.active !== false,
            order_pos: data.order_pos?.toString() || '',
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const p = await params;
      const res = await fetch(`/api/admin/reviews/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          rating: parseInt(form.rating),
          order_pos: form.order_pos ? parseInt(form.order_pos) : undefined,
        }),
      });
      if (res.ok) {
        router.push('/admin/reviews');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update review');
      }
    } catch {
      alert('Failed to update review');
    }
    setSaving(false);
  };

  if (loading) return <div className="text-muted">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/reviews" className="p-2 hover:bg-surface-container rounded-xl transition-colors text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-primary">Edit Review</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest" />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest" />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Review Text *</label>
          <textarea name="text" value={form.text} onChange={handleChange} required rows={4} className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Rating</label>
            <select name="rating" value={form.rating} onChange={handleChange} className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest">
              <option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Display Order</label>
            <input name="order_pos" type="number" value={form.order_pos} onChange={handleChange} className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input name="active" type="checkbox" checked={form.active} onChange={handleChange} className="w-4 h-4 rounded border-border-subtle text-secondary focus:ring-secondary" />
          <label className="text-sm font-medium text-on-surface">Active (show on storefront)</label>
        </div>
        <button type="submit" disabled={saving} className="bg-secondary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent-hover transition flex items-center gap-2 disabled:opacity-50">
          <Save size={18} />{saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
