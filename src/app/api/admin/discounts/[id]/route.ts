import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const discount = await prisma.discount.findUnique({ where: { id: parseInt(id) } });
    if (!discount) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(discount);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch discount' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const discount = await prisma.discount.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        discount_type: discountType,
        value: parseFloat(value),
        apply_to: applyTo,
        apply_to_id: applyToId ? parseInt(applyToId) : null,
        code: code ? code.toUpperCase() : null,
        usage_limit: type === 'automatic' ? null : usageLimit ? parseInt(usageLimit) : null,
        active: active !== undefined ? active : true,
        schedule_start: type === 'coupon' ? null : scheduleStart ? new Date(scheduleStart) : null,
        schedule_end: type === 'coupon' ? null : scheduleEnd ? new Date(scheduleEnd) : null,
      },
    });

    return NextResponse.json(discount);
  } catch {
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.discount.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
  }
}
