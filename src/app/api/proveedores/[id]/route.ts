import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const p = await prisma.proveedor.findUnique({
      where: { id: params.id },
      include: {
        categoria: true,
        user: { select: { name: true } },
        resenas: { select: { rating: true, comentario: true, createdAt: true, cliente: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 10 },
        disponibilidad: true,
      },
    });

    if (!p) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    const avgRating = p.resenas.length > 0 ? p.resenas.reduce((s, r) => s + r.rating, 0) / p.resenas.length : 4.8;

    return NextResponse.json({
      id: p.id,
      nombre: p.nombre,
      lat: p.lat,
      lng: p.lng,
      fotoPerfil: p.fotoPerfil,
      person: p.user.name ?? p.nombre,
      categoria: p.categoria,
      rating: Math.round(avgRating * 10) / 10,
      reviews: p.resenas.length,
      priceFrom: p.precioDesde,
      neighborhood: p.neighborhood,
      distanceKm: p.distanceKm,
      nextSlot: 'Disponible',
      availableToday: p.activo,
      coverSeed: 1,
      avatarSeed: 1,
      description: p.descripcion,
      tags: p.tags,
      hours: p.hours,
      since: p.since,
      isPro: p.plan === 'PRO',
      disponibilidad: p.disponibilidad,
      resenas: p.resenas.map(r => ({
        name: r.cliente.name ?? 'Usuario',
        rating: r.rating,
        text: r.comentario ?? '',
        date: r.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const user = session.user as { email?: string | null };

  try {
    const proveedor = await prisma.proveedor.findUnique({ where: { id: params.id }, include: { user: true } });
    if (!proveedor) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (proveedor.user.email !== user.email) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const body = await req.json() as Record<string, unknown>;

    const data: Record<string, unknown> = {
      ...(typeof body.nombre === 'string' ? { nombre: body.nombre } : {}),
      ...(typeof body.descripcion === 'string' ? { descripcion: body.descripcion } : {}),
      ...(typeof body.precioDesde === 'number' ? { precioDesde: body.precioDesde } : {}),
      ...(typeof body.activo === 'boolean' ? { activo: body.activo } : {}),
      ...(typeof body.direccion === 'string' ? { direccion: body.direccion } : {}),
      ...(typeof body.neighborhood === 'string' ? { neighborhood: body.neighborhood } : {}),
      ...(typeof body.hours === 'string' ? { hours: body.hours } : {}),
      ...(typeof body.whatsapp === 'string' ? { whatsapp: body.whatsapp } : {}),
      ...(typeof body.since === 'number' ? { since: body.since } : {}),
      ...(Array.isArray(body.tags) ? { tags: body.tags as string[] } : {}),
    };

    // Geocode address when it changes
    if (typeof body.direccion === 'string' && body.direccion.trim()) {
      try {
        const city = process.env.NEXT_PUBLIC_CITY_NAME ?? 'Trenque Lauquen';
        const q = encodeURIComponent(`${body.direccion}, ${city}, Argentina`);
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
          { headers: { 'User-Agent': 'TuServicioHoy/1.0' } }
        );
        const geoData = await geoRes.json() as { lat: string; lon: string }[];
        if (geoData[0]) {
          data.lat = parseFloat(geoData[0].lat);
          data.lng = parseFloat(geoData[0].lon);
        }
      } catch { /* geocoding failure is non-critical */ }
    }

    const updated = await prisma.proveedor.update({
      where: { id: params.id },
      data: data as Parameters<typeof prisma.proveedor.update>[0]['data'],
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}
