import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({ orderBy: { created_at: 'desc' } });
    return NextResponse.json(discounts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      discountType,
      value,
      applyTo,
      applyToId,
      code,
      usageLimit,
      active,
      scheduleStart,
      scheduleEnd,
    } = body;

    if (!name || value === undefined || value === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (type === 'coupon' && !code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const discount = await prisma.discount.create({
      data: {
        name,
        type: type || 'coupon',
        discount_type: discountType || 'percentage',
        value: parseFloat(value),
        apply_to: applyTo || 'all',
        apply_to_id: applyToId ? parseInt(applyToId) : null,
        code: code ? code.toUpperCase() : null,
        usage_limit: type === 'automatic' ? null : usageLimit ? parseInt(usageLimit) : null,
        active: active !== undefined ? active : true,
        schedule_start: type === 'coupon' ? null : scheduleStart ? new Date(scheduleStart) : null,
        schedule_end: type === 'coupon' ? null : scheduleEnd ? new Date(scheduleEnd) : null,
      },
    });

    return NextResponse.json(discount);
  } catch (error) {
    console.error('Discount creation error:', error);
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}
