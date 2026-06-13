'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const [whatsappNumber, setWhatsappNumber] = useState('+212639942052');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${whatsappNumber.replace(/[^0-9+]/g, '')}&text=${encodeURIComponent('السلام عليكم')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center justify-center group"
      style={{ width: 56, height: 56 }}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-200" />
    </a>
  );
}
