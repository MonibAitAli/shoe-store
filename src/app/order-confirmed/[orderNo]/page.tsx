'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MessageCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmedPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNo, setOrderNo] = useState<string>('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    params.then((p) => setOrderNo(p.orderNo));
  }, [params]);

  const phone = searchParams.get('phone') || '';
  const msg = searchParams.get('msg') || '';

  const cleanPhone = (p: string) => p.replace(/[^0-9+]/g, '');

  const handleWhatsAppRedirect = useCallback(() => {
    if (phone && msg) {
      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone(phone)}&text=${encodeURIComponent(msg)}`, '_blank');
    }
  }, [phone, msg]);

  // Auto-redirect after countdown
  useEffect(() => {
    if (!phone || !msg) return;
    if (countdown <= 0) {
      handleWhatsAppRedirect();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, phone, msg, handleWhatsAppRedirect]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-primary">Order Confirmed!</h1>

        <p className="text-muted">
          Your order <span className="font-bold text-primary">#{orderNo}</span> has been placed successfully.
        </p>

        <div className="bg-surface-container rounded-xl p-4 text-left space-y-2 text-sm">
          <p className="text-on-surface">
            <span className="font-medium">Next step:</span> Confirm your order via WhatsApp so we can start processing.
          </p>
          {phone && msg && (
            <p className="text-muted text-xs">
              Opening WhatsApp in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          )}
        </div>

        {phone && msg ? (
          <button
            onClick={handleWhatsAppRedirect}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <MessageCircle size={22} />
            Confirm on WhatsApp
          </button>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
            Could not open WhatsApp automatically. Please contact us at the number in our WhatsApp floating button.
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-secondary hover:text-accent-hover transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} />
          Back to Store
        </Link>
      </div>
    </div>
  );
}
