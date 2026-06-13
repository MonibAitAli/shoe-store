'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: number;
  order_no: number;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  total: number;
  status: string;
  created_at: string;
}

const statusOptions = ['unconfirmed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id: number, status: string) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  const handleDelete = async (id: number, status: string) => {
    if (status !== 'cancelled' && status !== 'delivered') return;
    if (!confirm(`Delete this ${status} order? This cannot be undone.`)) return;

    await fetch('/api/admin/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'unconfirmed': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Orders</h1>
        <span className="text-sm text-muted">{orders.length} total</span>
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-container">
            <tr>
              <th className="text-left p-3 font-medium text-muted">Order #</th>
              <th className="text-left p-3 font-medium text-muted">Customer</th>
              <th className="text-left p-3 font-medium text-muted">Phone</th>
              <th className="text-left p-3 font-medium text-muted">City</th>
              <th className="text-left p-3 font-medium text-muted">Total</th>
              <th className="text-left p-3 font-medium text-muted">Status</th>
              <th className="text-left p-3 font-medium text-muted">Date</th>
              <th className="text-left p-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-border-subtle hover:bg-surface-container/50">
                <td className="p-3 font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="text-secondary hover:underline">
                    #{order.order_no}
                  </Link>
                </td>
                <td className="p-3">{order.customer_name}</td>
                <td className="p-3 text-muted">{order.customer_phone}</td>
                <td className="p-3 text-muted">{order.customer_city}</td>
                <td className="p-3 font-bold">{formatPrice(order.total)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-muted">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-border-subtle rounded-lg px-2 py-1.5 text-xs bg-surface-container-lowest"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {(order.status === 'cancelled' || order.status === 'delivered') && (
                      <button
                        onClick={() => handleDelete(order.id, order.status)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title={`Delete ${order.status} order`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted text-sm">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
