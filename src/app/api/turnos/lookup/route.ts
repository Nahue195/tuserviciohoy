import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email')?.toLowerCase().trim();
  const codigo = searchParams.get('codigo')?.trim();

  if (!email && !codigo) {
    return NextResponse.json({ error: 'Necesitás email o código' }, { status: 400 });
  }

  const include = {
    proveedor: {
      select: {
        nombre: true,
        neighborhood: true,
        direccion: true,
        categoria: { select: { nombre: true, color: true } },
      },
    },
    resena: { select: { id: true, rating: true } },
  };

  if (codigo) {
    const turno = await prisma.turno.findUnique({ where: { codigo }, include });
    return NextResponse.json(turno ? [turno] : []);
  }

  // lookup by email
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) return NextResponse.json([]);

  const turnos = await prisma.turno.findMany({
    where: { clienteId: user.id },
    include,
    orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
  });
  return NextResponse.json(turnos);
}
