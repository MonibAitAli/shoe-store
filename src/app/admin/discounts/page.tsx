'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Discount {
  id: number;
  name: string;
  type: string;
  discount_type: string;
  value: number;
  apply_to: string;
  code: string | null;
  usage_limit: number | null;
  used_count: number;
  active: boolean;
  schedule_start: string | null;
  schedule_end: string | null;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const load = () => {
    fetch('/api/admin/discounts')
      .then((r) => r.json())
      .then(setDiscounts)
      .catch(() => {});
  };

  useEffect(load, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this discount?')) return;
    await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' });
    load();
  };

  const isActive = (d: Discount) => {
    if (!d.active) return false;
    const now = new Date();
    if (d.schedule_start && now < new Date(d.schedule_start)) return false;
    if (d.schedule_end && now > new Date(d.schedule_end)) return false;
    return true;
  };

  const scheduleLabel = (d: Discount) => {
    if (!d.schedule_start && !d.schedule_end) return null;
    const parts: string[] = [];
    if (d.schedule_start) parts.push(new Date(d.schedule_start).toLocaleDateString());
    if (d.schedule_end) parts.push(new Date(d.schedule_end).toLocaleDateString());
    return parts.join(' → ');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Discounts</h1>
        <Link
          href="/admin/discounts/new"
          className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-hover transition flex items-center gap-1"
        >
          <Plus size={18} />
          Add Discount
        </Link>
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-container">
            <tr>
              <th className="text-left p-3 font-medium text-muted">Name</th>
              <th className="text-left p-3 font-medium text-muted">Type</th>
              <th className="text-left p-3 font-medium text-muted">Value</th>
              <th className="text-left p-3 font-medium text-muted">Applies To</th>
              <th className="text-left p-3 font-medium text-muted">Usage / Schedule</th>
              <th className="text-left p-3 font-medium text-muted">Status</th>
              <th className="text-left p-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-t border-border-subtle hover:bg-surface-container/50">
                <td className="p-3 font-medium">
                  {d.name}
                  {d.code && (
                    <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded font-medium">
                      {d.code}
                    </span>
                  )}
                </td>
                <td className="p-3 text-muted">{d.type === 'coupon' ? 'Coupon' : 'Automatic'}</td>
                <td className="p-3">{d.value}{d.discount_type === 'percentage' ? '%' : ' MAD'}</td>
                <td className="p-3 text-muted capitalize">{d.apply_to}</td>
                <td className="p-3">
                  {d.type === 'coupon' ? (
                    <>{d.used_count}{d.usage_limit && d.usage_limit > 0 ? `/${d.usage_limit}` : ''}</>
                  ) : (
                    scheduleLabel(d) || <span className="text-muted text-xs">No schedule</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive(d) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isActive(d) ? 'Active' : 'Inactive'}
                  </span>
                  {scheduleLabel(d) && (
                    <div className="text-xs text-muted mt-1">{scheduleLabel(d)}</div>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/discounts/${d.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => handleDelete(d.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted text-sm">No discounts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
