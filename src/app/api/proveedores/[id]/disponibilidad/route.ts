import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const user = session.user as { email?: string | null };
  const proveedor = await prisma.proveedor.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!proveedor || proveedor.user.email !== user.email) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const body = await req.json() as { disponibilidad: { diaSemana: number; horaInicio: string; horaFin: string; intervaloMinutos: number }[] };

  await prisma.disponibilidad.deleteMany({ where: { proveedorId: params.id } });

  if (body.disponibilidad.length > 0) {
    await prisma.disponibilidad.createMany({
      data: body.disponibilidad.map(d => ({
        proveedorId: params.id,
        diaSemana: d.diaSemana,
        horaInicio: d.horaInicio,
        horaFin: d.horaFin,
        intervaloMinutos: d.intervaloMinutos,
      })),
    });
  }

  return NextResponse.json({ ok: true });
}
