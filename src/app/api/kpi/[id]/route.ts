import { prisma } from '@/lib/db';
import { KPISchema } from '@/utils/kpiSchema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const kpi = await prisma.kPI.findUnique({
      where: { id: params.id },
    });

    if (!kpi) {
      return NextResponse.json({ error: 'KPI not found' }, { status: 404 });
    }

    return NextResponse.json(kpi);
  } catch (error) {
    console.error('Error fetching KPI:', error);
    return NextResponse.json({ error: 'Failed to fetch KPI' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();
    const body = KPISchema.parse(json);

    // Check if KPI exists before updating
    const existingKPI = await prisma.kPI.findUnique({
      where: { id: params.id },
    });

    if (!existingKPI) {
      return NextResponse.json({ error: 'KPI not found' }, { status: 404 });
    }

    const kpi = await prisma.kPI.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(kpi);
  } catch (error) {
    console.error('Error updating KPI:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'KPI not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to update KPI' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if KPI exists before deleting
    const existingKPI = await prisma.kPI.findUnique({
      where: { id: params.id },
    });

    if (!existingKPI) {
      return NextResponse.json({ error: 'KPI not found' }, { status: 404 });
    }

    await prisma.kPI.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting KPI:', error);

    // Handle Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'KPI not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to delete KPI' },
      { status: 500 }
    );
  }
}
