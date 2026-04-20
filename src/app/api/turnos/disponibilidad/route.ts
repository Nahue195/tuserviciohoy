import { NextRequest, NextResponse } from 'next/server';
import { getSlotsDisponibles } from '@/lib/disponibilidad';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const proveedorId = searchParams.get('proveedorId');
  const fechaStr = searchParams.get('fecha');

  if (!proveedorId || !fechaStr) {
    return NextResponse.json({ error: 'proveedorId y fecha son requeridos' }, { status: 400 });
  }

  const fecha = new Date(fechaStr + 'T00:00:00');
  if (isNaN(fecha.getTime())) {
    return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });
  }

  try {
    const slots = await getSlotsDisponibles(proveedorId, fecha);
    return NextResponse.json(slots, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Error al calcular disponibilidad' }, { status: 500 });
  }
}
