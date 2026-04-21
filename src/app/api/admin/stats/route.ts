import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function adminAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('authorization') === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!adminAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const [totalProveedores, proCount, totalUsers, totalTurnos, proveedores] = await Promise.all([
    prisma.proveedor.count(),
    prisma.proveedor.count({ where: { plan: 'PRO' } }),
    prisma.user.count(),
    prisma.turno.count(),
    prisma.proveedor.findMany({
      select: {
        id: true,
        nombre: true,
        plan: true,
        planVence: true,
        activo: true,
        createdAt: true,
        categoria: { select: { nombre: true, color: true } },
        _count: { select: { turnos: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalProveedores,
      proCount,
      freeCount: totalProveedores - proCount,
      totalUsers,
      totalTurnos,
    },
    proveedores,
  });
}
