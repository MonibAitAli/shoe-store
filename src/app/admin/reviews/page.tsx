'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  active: boolean;
  order_pos: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const load = () => {
    fetch('/api/admin/reviews')
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {});
  };

  useEffect(load, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    load();
  };

  const handleToggleActive = async (id: number, active: boolean) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Reviews</h1>
        <Link
          href="/admin/reviews/new"
          className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-hover transition flex items-center gap-1"
        >
          <Plus size={18} />
          Add Review
        </Link>
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">No reviews yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left p-3 font-medium text-muted">#</th>
                <th className="text-left p-3 font-medium text-muted">Author</th>
                <th className="text-left p-3 font-medium text-muted">Location</th>
                <th className="text-left p-3 font-medium text-muted">Rating</th>
                <th className="text-left p-3 font-medium text-muted">Text</th>
                <th className="text-left p-3 font-medium text-muted">Status</th>
                <th className="text-left p-3 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className={`border-t border-border-subtle hover:bg-surface-container/50 ${!r.active ? 'opacity-50' : ''}`}>
                  <td className="p-3 text-muted">{r.order_pos}</td>
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3 text-muted">{r.location}</td>
                  <td className="p-3">
                    <div className="flex text-status-urgency">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < r.rating ? 'currentColor' : 'none'} stroke="currentColor" />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 max-w-xs truncate text-muted">{r.text}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleActive(r.id, r.active)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/reviews/${r.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
