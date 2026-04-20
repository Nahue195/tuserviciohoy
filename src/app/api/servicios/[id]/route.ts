import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const Schema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  duracion: z.number().int().min(5).optional(),
  precio: z.number().int().min(0).optional(),
  activo: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const user = session.user as { email?: string | null };

  const servicio = await prisma.servicio.findUnique({
    where: { id: params.id },
    include: { proveedor: { include: { user: { select: { email: true } } } } },
  });
  if (!servicio || servicio.proveedor.user.email !== user.email) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  try {
    const body = Schema.parse(await req.json());
    const updated = await prisma.servicio.update({ where: { id: params.id }, data: body });
    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const user = session.user as { email?: string | null };

  const servicio = await prisma.servicio.findUnique({
    where: { id: params.id },
    include: { proveedor: { include: { user: { select: { email: true } } } } },
  });
  if (!servicio || servicio.proveedor.user.email !== user.email) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  await prisma.servicio.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
