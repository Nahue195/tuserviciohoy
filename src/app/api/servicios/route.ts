import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const Schema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  duracion: z.number().int().min(5),
  precio: z.number().int().min(0),
});

async function getProveedor(email: string) {
  return prisma.proveedor.findFirst({ where: { user: { email } } });
}

export async function GET(req: NextRequest) {
  const proveedorId = new URL(req.url).searchParams.get('proveedorId');

  // Public access: return active services for a given provider
  if (proveedorId) {
    const servicios = await prisma.servicio.findMany({
      where: { proveedorId, activo: true },
      orderBy: [{ orden: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, nombre: true, descripcion: true, duracion: true, precio: true },
    });
    return NextResponse.json(servicios);
  }

  // Authenticated: return all services for the logged-in provider
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const user = session.user as { email?: string | null };
  const proveedor = await getProveedor(user.email ?? '');
  if (!proveedor) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const servicios = await prisma.servicio.findMany({
    where: { proveedorId: proveedor.id },
    orderBy: [{ orden: 'asc' }, { createdAt: 'asc' }],
  });
  return NextResponse.json(servicios);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const user = session.user as { email?: string | null };
  const proveedor = await getProveedor(user.email ?? '');
  if (!proveedor) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  try {
    const body = Schema.parse(await req.json());
    const count = await prisma.servicio.count({ where: { proveedorId: proveedor.id } });
    const servicio = await prisma.servicio.create({
      data: { ...body, proveedorId: proveedor.id, orden: count },
    });
    return NextResponse.json(servicio, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'Error al crear' }, { status: 500 });
  }
}
