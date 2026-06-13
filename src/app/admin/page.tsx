'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, ShoppingCart, Package, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: number;
  order_no: number;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const unconfirmed = orders.filter((o) => o.status === 'unconfirmed').length;
  const recentOrders = orders.slice(0, 5);

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
      <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart size={20} className="text-secondary" />
            <span className="text-sm font-medium text-muted">Total Orders</span>
          </div>
          <p className="text-3xl font-bold text-primary">{totalOrders}</p>
        </div>
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-green-600" />
            <span className="text-sm font-medium text-muted">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={20} className="text-status-urgency" />
            <span className="text-sm font-medium text-muted">Unconfirmed</span>
          </div>
          <p className="text-3xl font-bold text-primary">{unconfirmed}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <h2 className="font-bold text-lg text-primary flex items-center gap-2">
            <Package size={18} />
            Recent Orders
          </h2>
          <Link href="/admin/orders" className="text-sm text-secondary hover:text-accent-hover font-medium">
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">No orders yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left p-3 font-medium text-muted">Order #</th>
                <th className="text-left p-3 font-medium text-muted">Customer</th>
                <th className="text-left p-3 font-medium text-muted">Total</th>
                <th className="text-left p-3 font-medium text-muted">Status</th>
                <th className="text-left p-3 font-medium text-muted">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-border-subtle hover:bg-surface-container/50">
                  <td className="p-3 font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="text-secondary hover:underline">
                      #{order.order_no}
                    </Link>
                  </td>
                  <td className="p-3">{order.customer_name}</td>
                  <td className="p-3 font-bold">{formatPrice(order.total)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted">
                    {new Date(order.created_at).toLocaleDateString()}
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
