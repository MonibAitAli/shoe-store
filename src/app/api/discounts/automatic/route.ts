import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { cartTotal, items } = await request.json();
    const now = new Date();

    const automaticDiscounts = await prisma.discount.findMany({
      where: { type: 'automatic', active: true },
      orderBy: { value: 'desc' },
    });

    if (!automaticDiscounts || automaticDiscounts.length === 0) {
      return NextResponse.json({ discount: null });
    }

    const applicable = automaticDiscounts.filter((d) => {
      if (d.schedule_start && now < d.schedule_start) return false;
      if (d.schedule_end && now > d.schedule_end) return false;
      if (d.apply_to === 'product') {
        return items.some((item: { id: string }) => item.id === String(d.apply_to_id));
      }
      return true;
    });

    if (applicable.length === 0) {
      return NextResponse.json({ discount: null });
    }

    const best = applicable[0];
    let applicableTotal = cartTotal;
    if (best.apply_to === 'product') {
      applicableTotal = items
        .filter((item: { id: string }) => item.id === String(best.apply_to_id))
        .reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    }

    let discountAmount = 0;
    if (best.discount_type === 'percentage') {
      discountAmount = applicableTotal * (best.value / 100);
    } else {
      discountAmount = Math.min(best.value, applicableTotal);
    }

    return NextResponse.json({
      discount: {
        id: best.id,
        name: best.name,
        code: null,
        discountType: best.discount_type,
        value: best.value,
        discountAmount,
        scheduleStart: best.schedule_start,
        scheduleEnd: best.schedule_end,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to check automatic discounts' }, { status: 500 });
  }
}
