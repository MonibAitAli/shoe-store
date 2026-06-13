import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await prisma.siteContent.findMany({
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    });
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      const [section, ...keyParts] = key.split('.');
      const contentKey = keyParts.join('.');
      if (section && contentKey) {
        await prisma.siteContent.upsert({
          where: { section_key: { section, key: contentKey } },
          update: { value: String(value) },
          create: { section, key: contentKey, value: String(value) },
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
