'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, ArrowLeft, Shield, Plus, Minus, Tag, X } from 'lucide-react';
import { formatPrice, buildWhatsAppMessage } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<null | { id: number; code: string; discountAmount: number; type: string; value: number }>(null);
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerCity: '',
    customerAddress: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setProductName(data.product_name || 'Elegant Women\'s Shoe');
        setPrice(parseFloat(data.product_price || '0'));
      })
      .catch(() => {});
  }, []);

  const total = price * quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponValidating(true);
    setCouponError('');
    setCouponResult(null);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), cartTotal: total }),
      });
      const data = await res.json();
      if (data.error) {
        setCouponError(data.error === 'couponUsageExceeded' ? 'This coupon has reached its usage limit' : 'Invalid coupon code');
      } else {
        setCouponResult(data);
      }
    } catch {
      setCouponError('Failed to validate coupon');
    }
    setCouponValidating(false);
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponResult(null);
    setCouponError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone || !form.customerCity || !form.customerAddress) return;

    setSubmitting(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    const finalTotal = couponResult ? total - couponResult.discountAmount : total;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: [{ id: 'product-1', name: productName, price, quantity }],
          total,
          discountId: couponResult?.id ?? null,
          discountCode: couponResult?.code ?? null,
          discountAmount: couponResult?.discountAmount ?? null,
          finalTotal,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        alert(errData?.error || `Server error (${res.status})`);
        setSubmitting(false);
        return;
      }

      const order = await res.json();

      if (order.error) {
        alert(order.error);
        setSubmitting(false);
        return;
      }

      const settingsRes = await fetch('/api/settings');
      const settingsData = await settingsRes.json();
      const whatsappNumber = settingsData.whatsapp_number || '+212639942052';

      const msg = buildWhatsAppMessage(
        {
          orderNo: order.orderNo,
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerCity: form.customerCity,
          customerAddress: form.customerAddress,
          notes: form.notes,
          total: order.total,
          discountAmount: couponResult?.discountAmount ?? null,
          discountCode: couponResult?.code ?? null,
        },
        [{ name: productName, price, quantity }]
      );

      router.push(`/order-confirmed/${order.orderNo}?phone=${encodeURIComponent(whatsappNumber)}&msg=${encodeURIComponent(msg)}`);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === 'AbortError') {
        alert('Request timed out. Please check your connection and try again.');
      } else {
        alert('Error creating order. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="p-2 hover:bg-surface-container rounded-xl transition-colors text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-secondary">1</span>
              </div>
              <h2 className="font-bold text-lg text-primary">Delivery Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="w-full border border-border-subtle rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Phone *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                  className="w-full border border-border-subtle rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
                  dir="ltr"
                  placeholder="+212 6XX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">City *</label>
              <input
                type="text"
                name="customerCity"
                value={form.customerCity}
                onChange={handleChange}
                required
                className="w-full border border-border-subtle rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Address *</label>
              <textarea
                name="customerAddress"
                value={form.customerAddress}
                onChange={handleChange}
                required
                rows={2}
                className="w-full border border-border-subtle rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest resize-none"
                placeholder="Full address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">
                Order Notes <span className="text-muted">(Optional)</span>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                className="w-full border border-border-subtle rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2.5 text-lg disabled:opacity-50 cursor-pointer"
          >
            <MessageCircle size={22} />
            {submitting ? 'Processing...' : 'Confirm via WhatsApp'}
          </button>

          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <Shield size={14} />
            <span>Your data is protected and secure</span>
          </div>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                <span className="text-sm font-bold text-on-surface">2</span>
              </div>
              <h2 className="font-bold text-lg text-primary">Order Summary</h2>
            </div>

            {/* Product */}
            <div className="space-y-3 mb-5">
              <div className="flex gap-3 p-3 bg-surface-container rounded-xl items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary">{productName}</p>
                  <p className="text-sm text-muted">{formatPrice(price)}</p>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest border border-border-subtle rounded-full px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:bg-surface-container rounded-full transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:bg-surface-container rounded-full transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="border-t border-border-subtle pt-4">
              {couponResult ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">{couponResult.code}</span>
                    <span className="text-xs text-green-600">
                      ({couponResult.type === 'percentage' ? `${couponResult.value}%` : formatPrice(couponResult.value)} off)
                    </span>
                  </div>
                  <button type="button" onClick={handleRemoveCoupon} className="p-1 hover:bg-green-100 rounded-full transition-colors text-green-600" aria-label="Remove coupon">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                    placeholder="Coupon code"
                    disabled={couponValidating}
                    className="flex-1 border border-border-subtle rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-surface-container-lowest uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponValidating || !couponCode.trim()}
                    className="px-4 py-2.5 bg-surface-container border border-border-subtle rounded-xl text-sm font-medium hover:bg-surface-container-low transition disabled:opacity-50"
                  >
                    {couponValidating ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
            </div>

            {/* Totals */}
            <div className="border-t border-border-subtle pt-4 space-y-2">
              {couponResult && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({couponResult.code})</span>
                  <span className="font-medium">-{formatPrice(couponResult.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(price)} × {quantity}</span>
              </div>
              <div className="flex justify-between items-center border-t border-border-subtle pt-3">
                <span className="font-bold text-primary">Total</span>
                <span className="font-bold text-secondary text-2xl">{formatPrice(couponResult ? total - couponResult.discountAmount : total)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-5 p-3 bg-surface-container rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Cash on Delivery</p>
                <p className="text-xs text-muted">Pay when you receive your order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
