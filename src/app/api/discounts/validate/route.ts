import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code, cartTotal, items } = await request.json();
    if (!code) return NextResponse.json({ error: 'invalidCoupon' }, { status: 400 });

    const discount = await prisma.discount.findUnique({ where: { code: code.toUpperCase() } });
    if (!discount) return NextResponse.json({ error: 'invalidCoupon' }, { status: 404 });
    if (!discount.active) return NextResponse.json({ error: 'invalidCoupon' }, { status: 400 });
    if (discount.usage_limit && discount.usage_limit > 0 && discount.used_count >= discount.usage_limit) {
      return NextResponse.json({ error: 'couponUsageExceeded' }, { status: 400 });
    }

    let applicableTotal = cartTotal;
    if (discount.apply_to === 'product') {
      applicableTotal = items
        .filter((item: { id: string }) => item.id === String(discount.apply_to_id))
        .reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    }

    let discountAmount = 0;
    if (discount.discount_type === 'percentage') {
      discountAmount = applicableTotal * (discount.value / 100);
    } else {
      discountAmount = Math.min(discount.value, applicableTotal);
    }

    return NextResponse.json({
      id: discount.id,
      code: discount.code,
      type: discount.discount_type,
      value: discount.value,
      discountAmount,
      applicableTotal,
      name: discount.name,
    });
  } catch {
    return NextResponse.json({ error: 'invalidCoupon' }, { status: 500 });
  }
}
