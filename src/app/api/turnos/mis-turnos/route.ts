import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const user = session.user as { email?: string | null };

  try {
    const turnos = await prisma.turno.findMany({
      where: { cliente: { email: user.email ?? '' } },
      include: {
        proveedor: {
          select: { nombre: true, neighborhood: true, direccion: true, categoria: { select: { nombre: true, color: true } } },
        },
        resena: { select: { id: true, rating: true } },
      },
      orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
    });

    return NextResponse.json(turnos);
  } catch {
    return NextResponse.json({ error: 'Error al obtener turnos' }, { status: 500 });
  }
}
