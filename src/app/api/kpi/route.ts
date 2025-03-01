import { prisma } from '@/lib/db';
import { KPISchema } from '@/utils/kpiSchema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const body = KPISchema.parse(json);

    const kpi = await prisma.kPI.create({
      data: body,
    });

    return NextResponse.json(kpi);
  } catch (error) {
    console.error('KPI API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  const kpis = await prisma.kPI.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(kpis);
}
