'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  order_no: number;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  notes: string;
  items: string;
  total: number;
  discount_code: string | null;
  discount_amount: number | null;
  status: string;
  created_at: string;
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      fetch(`/api/admin/orders/${p.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.items) {
            data.items_parsed = JSON.parse(data.items) as OrderItem[];
          }
          setOrder(data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [params]);

  const handleStatusChange = async (status: string) => {
    if (!order) return;
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, status }),
    });
    setOrder({ ...order, status });
  };

  if (loading) return <div className="text-muted">Loading...</div>;
  if (!order) return <div className="text-muted">Order not found</div>;

  let items: OrderItem[] = [];
  try {
    items = JSON.parse(order.items);
  } catch {}

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="p-2 hover:bg-surface-container rounded-xl transition-colors text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-primary">Order #{order.order_no}</h1>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          order.status === 'unconfirmed' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg text-primary">Customer Information</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-muted font-medium">Name:</span> {order.customer_name}</div>
            <div><span className="text-muted font-medium">Phone:</span> {order.customer_phone}</div>
            <div><span className="text-muted font-medium">City:</span> {order.customer_city}</div>
            <div><span className="text-muted font-medium">Address:</span> {order.customer_address}</div>
            {order.notes && <div><span className="text-muted font-medium">Notes:</span> {order.notes}</div>}
            <div><span className="text-muted font-medium">Date:</span> {new Date(order.created_at).toLocaleString()}</div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg text-primary">Order Items</h2>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-surface-container rounded-lg">
                <div>
                  <p className="font-medium text-sm text-primary">{item.name}</p>
                  <p className="text-xs text-muted">{item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border-subtle pt-3 space-y-1">
            <div className="flex justify-between text-sm text-muted">
              <span>Subtotal</span>
              <span>{formatPrice(Number(order.total) + Number(order.discount_amount || 0))}</span>
            </div>
            {order.discount_amount && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount {order.discount_code ? `(${order.discount_code})` : ''}</span>
                <span>-{formatPrice(Number(order.discount_amount))}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-primary">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="mt-6 bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
        <h2 className="font-bold text-lg text-primary mb-4">Update Status</h2>
        <div className="flex gap-2 flex-wrap">
          {['unconfirmed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                order.status === s
                  ? 'bg-secondary text-white'
                  : 'bg-surface-container text-muted hover:bg-surface-container-low border border-border-subtle'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* WhatsApp Link */}
      <div className="mt-6">
        <a
          href={`https://api.whatsapp.com/send?phone=${order.customer_phone}&text=Hello ${encodeURIComponent(order.customer_name)}, regarding your order #${order.order_no}...`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors font-medium text-sm"
        >
          <MessageCircle size={18} />
          Message Customer on WhatsApp
        </a>
      </div>
    </div>
  );
}
