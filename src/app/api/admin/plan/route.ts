import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function adminAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('authorization') === `Bearer ${secret}`;
}

export async function PATCH(req: NextRequest) {
  if (!adminAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json() as { proveedorId?: string; plan?: string; meses?: number };
    const { proveedorId, plan, meses = 1 } = body;

    if (!proveedorId || !plan || !['FREE', 'PRO'].includes(plan)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const planVence = plan === 'PRO'
      ? new Date(Date.now() + meses * 30 * 24 * 60 * 60 * 1000)
      : null;

    const proveedor = await prisma.proveedor.update({
      where: { id: proveedorId },
      data: { plan: plan as 'FREE' | 'PRO', planVence },
      select: { id: true, nombre: true, plan: true, planVence: true },
    });

    return NextResponse.json(proveedor);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar plan' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!adminAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const proveedores = await prisma.proveedor.findMany({
    select: { id: true, nombre: true, plan: true, planVence: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(proveedores);
}
