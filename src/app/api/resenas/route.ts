import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const Schema = z.object({
  turnoId: z.string(),
  rating: z.number().int().min(1).max(5),
  comentario: z.string().max(500).optional(),
  clienteEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = Schema.parse(await req.json());

    const turno = await prisma.turno.findUnique({
      where: { id: body.turnoId },
      include: { cliente: { select: { email: true } } },
    });

    if (!turno) return NextResponse.json({ error: 'Turno no encontrado' }, { status: 404 });
    if (turno.estado !== 'COMPLETADO') return NextResponse.json({ error: 'Solo podés reseñar turnos completados' }, { status: 400 });

    // Verificar identidad del cliente (email o que sea el mismo)
    if (body.clienteEmail && turno.cliente.email !== body.clienteEmail) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Una sola reseña por turno
    const existe = await prisma.resena.findUnique({ where: { turnoId: body.turnoId } });
    if (existe) return NextResponse.json({ error: 'Ya dejaste una reseña para este turno' }, { status: 409 });

    const resena = await prisma.resena.create({
      data: {
        turnoId: body.turnoId,
        proveedorId: turno.proveedorId,
        clienteId: turno.clienteId,
        rating: body.rating,
        comentario: body.comentario,
      },
    });

    return NextResponse.json(resena, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'Error al guardar la reseña' }, { status: 500 });
  }
}
