import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json();
    if (!code) return NextResponse.json({ error: 'invalidCoupon' }, { status: 400 });

    const discount = await prisma.discount.findUnique({ where: { code: code.toUpperCase() } });
    if (!discount) return NextResponse.json({ error: 'invalidCoupon' }, { status: 404 });
    if (!discount.active) return NextResponse.json({ error: 'invalidCoupon' }, { status: 400 });
    if (discount.usage_limit && discount.usage_limit > 0 && discount.used_count >= discount.usage_limit) {
      return NextResponse.json({ error: 'couponUsageExceeded' }, { status: 400 });
    }

    let discountAmount = 0;
    if (discount.discount_type === 'percentage') {
      discountAmount = cartTotal * (discount.value / 100);
    } else {
      discountAmount = Math.min(discount.value, cartTotal);
    }

    return NextResponse.json({
      id: discount.id,
      code: discount.code,
      type: discount.discount_type,
      value: discount.value,
      discountAmount,
      name: discount.name,
    });
  } catch {
    return NextResponse.json({ error: 'invalidCoupon' }, { status: 500 });
  }
}
