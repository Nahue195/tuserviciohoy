import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const sessionEmail = (session?.user as { email?: string | null } | undefined)?.email;

  try {
    const body = await req.json() as { estado?: string; guestEmail?: string };
    const estado = body.estado;

    if (!['CONFIRMADO', 'CANCELADO', 'COMPLETADO', 'PENDIENTE'].includes(estado ?? '')) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }

    const turno = await prisma.turno.findUnique({
      where: { id: params.id },
      include: {
        cliente: true,
        proveedor: { include: { user: true } },
      },
    });

    if (!turno) return NextResponse.json({ error: 'Turno no encontrado' }, { status: 404 });

    const isCliente = !!sessionEmail && turno.cliente.email === sessionEmail;
    const isProveedor = !!sessionEmail && turno.proveedor.user.email === sessionEmail;
    const isGuestCancel = estado === 'CANCELADO' && !!body.guestEmail && turno.cliente.email === body.guestEmail;

    if (!isCliente && !isProveedor && !isGuestCancel) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Clientes solo pueden cancelar
    if (isCliente && !isProveedor && estado !== 'CANCELADO') {
      return NextResponse.json({ error: 'Solo podés cancelar tu turno' }, { status: 403 });
    }

    const updated = await prisma.turno.update({
      where: { id: params.id },
      data: { estado: estado as 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO' | 'PENDIENTE' },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el turno' }, { status: 500 });
  }
}
