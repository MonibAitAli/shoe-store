import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await prisma.siteContent.findMany({
      where: { active: true },
    });
    // Group by section
    const grouped: Record<string, Record<string, string>> = {};
    content.forEach((c) => {
      if (!grouped[c.section]) grouped[c.section] = {};
      grouped[c.section][c.key] = c.value;
    });
    return NextResponse.json(grouped);
  } catch {
    return NextResponse.json({});
  }
}
