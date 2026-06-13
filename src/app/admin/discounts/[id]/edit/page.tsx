'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditDiscountPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    type: 'coupon',
    discountType: 'percentage',
    value: '',
    applyTo: 'all',
    code: '',
    usageLimit: '',
    active: true,
    scheduleStart: '',
    scheduleEnd: '',
  });

  useEffect(() => {
    params.then((p) => {
      fetch(`/api/admin/discounts/${p.id}`)
        .then((r) => r.json())
        .then((data) => {
          setForm({
            name: data.name || '',
            type: data.type || 'coupon',
            discountType: data.discount_type || 'percentage',
            value: data.value?.toString() || '',
            applyTo: data.apply_to || 'all',
            code: data.code || '',
            usageLimit: data.usage_limit?.toString() || '',
            active: data.active !== false,
            scheduleStart: data.schedule_start
              ? new Date(data.schedule_start).toISOString().slice(0, 16)
              : '',
            scheduleEnd: data.schedule_end
              ? new Date(data.schedule_end).toISOString().slice(0, 16)
              : '',
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const res = await fetch(`/api/admin/discounts/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin/discounts');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update discount');
      }
    } catch {
      alert('Failed to update discount');
    }
    setSaving(false);
  };

  if (loading) return <div className="text-muted">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/discounts" className="p-2 hover:bg-surface-container rounded-xl transition-colors text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-primary">Edit Discount</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
            >
              <option value="coupon">Coupon</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Discount Type</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (MAD)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Value *</label>
          <input
            name="value"
            type="number"
            value={form.value}
            onChange={handleChange}
            required
            className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
          />
        </div>

        {form.type === 'coupon' && (
          <>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Coupon Code *</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Usage Limit</label>
              <input
                name="usageLimit"
                type="number"
                value={form.usageLimit}
                onChange={handleChange}
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
              />
            </div>
          </>
        )}

        {form.type === 'automatic' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Schedule Start</label>
              <input
                name="scheduleStart"
                type="datetime-local"
                value={form.scheduleStart}
                onChange={handleChange}
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Schedule End</label>
              <input
                name="scheduleEnd"
                type="datetime-local"
                value={form.scheduleEnd}
                onChange={handleChange}
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            name="active"
            type="checkbox"
            checked={form.active}
            onChange={handleChange}
            className="w-4 h-4 rounded border-border-subtle text-secondary focus:ring-secondary"
          />
          <label className="text-sm font-medium text-on-surface">Active</label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-secondary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent-hover transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
