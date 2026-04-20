import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AgendaView } from '@/components/dashboard/AgendaView';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as { email?: string | null };

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  const proveedor = await prisma.proveedor.findFirst({
    where: { user: { email: user.email ?? '' } },
    include: {
      turnos: {
        where: { fecha: { gte: startOfWeek, lte: endOfWeek } },
        include: { cliente: { select: { name: true } } },
        orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }],
      },
      resenas: { select: { rating: true } },
    },
  });

  if (!proveedor) return null;

  const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
  const clientesNuevos = await prisma.turno.findMany({
    where: { proveedorId: proveedor.id, createdAt: { gte: startOfMonth }, estado: { not: 'CANCELADO' } },
    select: { clienteId: true }, distinct: ['clienteId'],
  });

  const avgRating = proveedor.resenas.length > 0
    ? proveedor.resenas.reduce((s, r) => s + r.rating, 0) / proveedor.resenas.length : 4.8;

  const turnosHoy = proveedor.turnos.filter(t => {
    const f = new Date(t.fecha); return f >= today && f < tomorrow;
  });

  return (
    <AgendaView
      turnosHoy={turnosHoy.map((t, i) => ({
        id: t.id,
        time: t.horaInicio,
        client: t.cliente.name ?? 'Cliente',
        service: t.servicio ?? 'Consulta',
        status: t.estado,
        avatarSeed: i % 6,
      }))}
      turnosSemana={proveedor.turnos.map((t, i) => ({
        id: t.id,
        fecha: t.fecha.toISOString(),
        dayIdx: (() => { const d = new Date(t.fecha).getDay(); return d === 0 ? 6 : d - 1; })(),
        time: t.horaInicio,
        client: t.cliente.name ?? 'Cliente',
        service: t.servicio ?? 'Consulta',
        status: t.estado,
        avatarSeed: i % 6,
      }))}
      weekSchedule={proveedor.turnos.map((t, i) => {
        const d = new Date(t.fecha).getDay(); const dayIdx = d === 0 ? 6 : d - 1;
        return { day: dayIdx, start: parseInt(t.horaInicio.split(':')[0] ?? '9'), end: parseInt(t.horaFin.split(':')[0] ?? '10'), client: t.cliente.name ?? 'Cliente', color: i % 2 === 0 ? '#D9634A' : '#0F6E4E' };
      })}
      stats={{ hoy: turnosHoy.length, semana: proveedor.turnos.filter(t => t.estado !== 'CANCELADO').length, clientes: clientesNuevos.length, rating: Math.round(avgRating * 10) / 10, reviews: proveedor.resenas.length }}
    />
  );
}
