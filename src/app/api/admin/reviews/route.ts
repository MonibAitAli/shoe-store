import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: [{ order_pos: 'asc' }],
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, text, rating, active, order_pos } = body;
    if (!name || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const maxOrder = await prisma.review.aggregate({ _max: { order_pos: true } });
    const review = await prisma.review.create({
      data: {
        name,
        location: location || '',
        text,
        rating: rating || 5,
        active: active !== undefined ? active : true,
        order_pos: order_pos ?? (maxOrder._max.order_pos ?? 0) + 1,
      },
    });
    return NextResponse.json(review);
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
