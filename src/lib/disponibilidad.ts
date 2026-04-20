import { prisma } from './prisma';
import type { SlotDisponible } from '@/types';

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export async function getSlotsDisponibles(
  proveedorId: string,
  fecha: Date
): Promise<SlotDisponible[]> {
  const diaSemana = fecha.getDay(); // 0=dom, 6=sab

  const disponibilidad = await prisma.disponibilidad.findFirst({
    where: { proveedorId, diaSemana },
  });

  if (!disponibilidad) return [];

  const fechaStr = fecha.toISOString().split('T')[0];

  const [turnosOcupados, bloqueos] = await Promise.all([
    prisma.turno.findMany({
      where: {
        proveedorId,
        fecha: new Date(fechaStr + 'T00:00:00.000Z'),
        estado: { not: 'CANCELADO' },
      },
      select: { horaInicio: true, horaFin: true },
    }),
    prisma.bloqueoHorario.findMany({
      where: {
        proveedorId,
        fecha: new Date(fechaStr + 'T00:00:00.000Z'),
      },
      select: { horaInicio: true, horaFin: true },
    }),
  ]);

  const ocupados = [...turnosOcupados, ...bloqueos].map(t => ({
    inicio: timeToMinutes(t.horaInicio),
    fin: timeToMinutes(t.horaFin),
  }));

  const inicio = timeToMinutes(disponibilidad.horaInicio);
  const fin = timeToMinutes(disponibilidad.horaFin);
  const intervalo = disponibilidad.intervaloMinutos;

  const slots: SlotDisponible[] = [];

  for (let t = inicio; t + intervalo <= fin; t += intervalo) {
    const slotFin = t + intervalo;
    const bloqueado = ocupados.some(o => t < o.fin && slotFin > o.inicio);
    slots.push({
      horaInicio: minutesToTime(t),
      horaFin: minutesToTime(slotFin),
      disponible: !bloqueado,
    });
  }

  return slots;
}
