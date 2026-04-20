import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSlotsDisponibles } from '@/lib/disponibilidad';
import { sendConfirmacionCliente, sendNuevoTurnoProveedor } from '@/lib/email';
import { z } from 'zod';

const CreateTurnoSchema = z.object({
  proveedorId: z.string(),
  fecha: z.string(),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/),
  servicio: z.string().optional(),
  precio: z.number().optional(),
  notas: z.string().optional(),
  clienteNombre: z.string().optional(),
  clienteTelefono: z.string().optional(),
  clienteEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json() as unknown;
    const data = CreateTurnoSchema.parse(body);

    const fecha = new Date(data.fecha + 'T00:00:00');
    const slots = await getSlotsDisponibles(data.proveedorId, fecha);
    const slotDisp = slots.find(s => s.horaInicio === data.horaInicio);

    if (!slotDisp?.disponible) {
      return NextResponse.json({ error: 'El horario no está disponible' }, { status: 409 });
    }

    // Verificar límite de plan FREE (20 turnos/mes)
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: data.proveedorId },
      select: { plan: true },
    });
    if (proveedor?.plan === 'FREE') {
      const firstOfMonth = new Date(); firstOfMonth.setDate(1); firstOfMonth.setHours(0, 0, 0, 0);
      const turnosMes = await prisma.turno.count({
        where: { proveedorId: data.proveedorId, createdAt: { gte: firstOfMonth }, estado: { not: 'CANCELADO' } },
      });
      if (turnosMes >= 20) {
        return NextResponse.json({ error: 'Este profesional alcanzó su límite mensual de turnos. Intentá contactarlo directamente.' }, { status: 429 });
      }
    }

    let clienteId: string;
    let clienteEmail: string | null = null;
    let clienteNombre: string = data.clienteNombre ?? 'Cliente';

    if (session?.user) {
      const user = session.user as { email?: string | null; name?: string | null };
      const dbUser = await prisma.user.findUnique({ where: { email: user.email ?? '' } });
      clienteId = dbUser?.id ?? '';
      clienteEmail = dbUser?.email ?? null;
      clienteNombre = dbUser?.name ?? clienteNombre;
    } else {
      const guestEmail = data.clienteEmail ?? `anonimo-${Date.now()}@tuserviciohoy.com`;
      // Reuse existing user if email already exists, otherwise create guest
      const existing = data.clienteEmail
        ? await prisma.user.findUnique({ where: { email: guestEmail } })
        : null;
      if (existing) {
        clienteId = existing.id;
        clienteEmail = existing.email;
        clienteNombre = existing.name ?? clienteNombre;
      } else {
        const guestUser = await prisma.user.create({
          data: { name: clienteNombre, email: guestEmail, phone: data.clienteTelefono },
        });
        clienteId = guestUser.id;
        clienteEmail = data.clienteEmail ?? null;
      }
    }

    if (!clienteId) return NextResponse.json({ error: 'Usuario no válido' }, { status: 400 });

    const turno = await prisma.turno.create({
      data: {
        proveedorId: data.proveedorId,
        clienteId,
        fecha: new Date(data.fecha + 'T00:00:00.000Z'),
        horaInicio: data.horaInicio,
        horaFin: slotDisp.horaFin,
        estado: 'PENDIENTE',
        servicio: data.servicio,
        precio: data.precio,
        notas: data.notas,
      },
      include: {
        proveedor: {
          select: {
            nombre: true,
            direccion: true,
            user: { select: { email: true } },
          },
        },
      },
    });

    // Send emails in background (don't block response)
    const emailPromises: Promise<void>[] = [];

    if (clienteEmail) {
      emailPromises.push(
        sendConfirmacionCliente({
          to: clienteEmail,
          clienteNombre,
          proveedorNombre: turno.proveedor.nombre,
          proveedorDireccion: turno.proveedor.direccion,
          fecha: data.fecha,
          hora: data.horaInicio,
          servicio: data.servicio,
          codigo: turno.codigo,
        }).catch(e => console.error('[Email] Error enviando confirmación cliente:', e))
      );
    }

    if (turno.proveedor.user?.email) {
      emailPromises.push(
        sendNuevoTurnoProveedor({
          to: turno.proveedor.user.email,
          proveedorNombre: turno.proveedor.nombre,
          clienteNombre,
          clienteTelefono: data.clienteTelefono,
          fecha: data.fecha,
          hora: data.horaInicio,
          servicio: data.servicio,
          notas: data.notas,
          codigo: turno.codigo,
        }).catch(e => console.error('[Email] Error enviando notificación proveedor:', e))
      );
    }

    Promise.all(emailPromises);

    return NextResponse.json(turno, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: 'Error al crear el turno' }, { status: 500 });
  }
}
