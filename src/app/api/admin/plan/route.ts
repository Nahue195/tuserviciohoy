import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const Schema = z.object({
  proveedorId: z.string(),
  plan: z.enum(['FREE', 'PRO']),
  meses: z.number().int().min(1).max(12).optional().default(1),
});

function adminAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${secret}`;
}

export async function PATCH(req: NextRequest) {
  if (!adminAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = Schema.parse(await req.json());

    const planVence = body.plan === 'PRO'
      ? new Date(Date.now() + body.meses * 30 * 24 * 60 * 60 * 1000)
      : null;

    const proveedor = await prisma.proveedor.update({
      where: { id: body.proveedorId },
      data: { plan: body.plan, planVence },
      select: { id: true, nombre: true, plan: true, planVence: true },
    });

    return NextResponse.json(proveedor);
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'Error al actualizar plan' }, { status: 500 });
  }
}

// Listar todos los proveedores con su plan (útil para administrar)
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
