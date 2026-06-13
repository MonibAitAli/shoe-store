import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerCity,
      customerAddress,
      notes,
      items,
      total,
      discountId,
      discountCode,
      discountAmount,
      finalTotal,
    } = body;

    if (!customerName || !customerPhone || !customerCity || !customerAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lastOrder = await prisma.order.findFirst({ orderBy: { order_no: 'desc' } });
    const orderNo = (lastOrder?.order_no || 1000) + 1;
    const orderTotal = finalTotal ?? total;

    const order = await prisma.order.create({
      data: {
        order_no: orderNo,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_city: customerCity,
        customer_address: customerAddress,
        notes: notes || '',
        items: JSON.stringify(items),
        total: orderTotal,
        discount_id: discountId || null,
        discount_code: discountCode || null,
        discount_amount: discountAmount || null,
        status: 'unconfirmed',
      },
    });

    if (discountId) {
      const discount = await prisma.discount.findUnique({ where: { id: discountId } });
      if (discount && discount.type === 'coupon') {
        await prisma.discount.update({
          where: { id: discountId },
          data: { used_count: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({
      id: order.id,
      orderNo: order.order_no,
      total: order.total,
      discountAmount: order.discount_amount,
      discountCode: order.discount_code,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
