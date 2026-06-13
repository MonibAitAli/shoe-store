import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `${num.toFixed(2)} MAD`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function buildWhatsAppMessage(
  order: {
    orderNo: number;
    customerName: string;
    customerPhone: string;
    customerCity: string;
    customerAddress: string;
    notes?: string;
    total: number;
    discountAmount?: number | null;
    discountCode?: string | null;
  },
  items: { name: string; price: number; quantity: number }[]
): string {
  const sep = '-'.repeat(30);
  let msg = `New Order #${order.orderNo}\n`;
  msg += `${sep}\n`;
  msg += `Name: ${order.customerName}\n`;
  msg += `Phone: ${order.customerPhone}\n`;
  msg += `City: ${order.customerCity}\n`;
  msg += `Address: ${order.customerAddress}\n`;
  if (order.notes) msg += `Notes: ${order.notes}\n`;
  msg += `\nItems:\n`;
  items.forEach((item) => {
    msg += `  ${item.name} | ${item.quantity} × ${item.price.toFixed(2)} = ${(item.price * item.quantity).toFixed(2)} MAD\n`;
  });
  if (order.discountAmount) {
    msg += `\nDiscount: -${order.discountAmount.toFixed(2)} MAD`;
    if (order.discountCode) msg += ` (Code: ${order.discountCode})`;
    msg += '\n';
  }
  msg += `${sep}\n`;
  msg += `Total: ${order.total.toFixed(2)} MAD\n`;
  msg += `\nStatus: Pending confirmation`;
  return msg;
}
