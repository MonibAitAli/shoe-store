'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewDiscountPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin/discounts');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create discount');
      }
    } catch {
      alert('Failed to create discount');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/discounts" className="p-2 hover:bg-surface-container rounded-xl transition-colors text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-primary">New Discount</h1>
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
            placeholder="Summer Sale"
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
            placeholder={form.discountType === 'percentage' ? '20' : '50'}
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
                placeholder="SUMMER20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Usage Limit (0 = unlimited)</label>
              <input
                name="usageLimit"
                type="number"
                value={form.usageLimit}
                onChange={handleChange}
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
                placeholder="100"
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
          {saving ? 'Creating...' : 'Create Discount'}
        </button>
      </form>
    </div>
  );
}
