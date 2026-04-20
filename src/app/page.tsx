import { prisma } from '@/lib/prisma';
import { HomeScreenDesktop, HomeScreenMobile } from '@/components/screens/HomeScreen';
import type { CategoriaData, ProveedorCard } from '@/types';

const CITY = process.env.NEXT_PUBLIC_CITY_NAME ?? 'Trenque Lauquen';

export const revalidate = 60;

export default async function HomePage() {
  const [categorias, rawProveedores] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.proveedor.findMany({
      where: { activo: true },
      include: {
        categoria: true,
        user: { select: { name: true } },
        turnos: {
          where: { fecha: { gte: new Date() }, estado: { not: 'CANCELADO' } },
          orderBy: { horaInicio: 'asc' },
          take: 1,
        },
        resenas: { select: { rating: true } },
      },
      orderBy: [{ plan: 'desc' }, { createdAt: 'asc' }],
      take: 20,
    }),
  ]);

  const cats: CategoriaData[] = categorias.map(c => ({
    id: c.id, nombre: c.nombre, slug: c.slug,
    icono: c.icono, color: c.color, tint: c.tint,
  }));

  const proveedores: ProveedorCard[] = rawProveedores.map((p, i) => {
    const avgRating = p.resenas.length > 0 ? p.resenas.reduce((s, r) => s + r.rating, 0) / p.resenas.length : 4.8;
    const nextTurno = p.turnos[0];
    const nextSlot = nextTurno ? `Hoy ${nextTurno.horaInicio}` : 'Disponible';
    return {
      id: p.id,
      nombre: p.nombre,
      person: p.user.name ?? p.nombre,
      categoria: { id: p.categoria.id, nombre: p.categoria.nombre, slug: p.categoria.slug, icono: p.categoria.icono, color: p.categoria.color, tint: p.categoria.tint },
      rating: Math.round(avgRating * 10) / 10,
      reviews: p.resenas.length,
      priceFrom: p.precioDesde,
      neighborhood: p.neighborhood,
      distanceKm: p.distanceKm,
      nextSlot,
      availableToday: p.activo,
      coverSeed: i % 6,
      avatarSeed: i % 6,
      description: p.descripcion,
      tags: p.tags,
      hours: p.hours,
      since: p.since,
      isPro: p.plan === 'PRO',
    };
  });

  return (
    <>
      <div className="md-hidden" style={{ display: 'none' }}>
        {/* Mobile rendered via CSS media query below */}
      </div>
      <div id="home-desktop" style={{ display: 'none' }}>
        <HomeScreenDesktop city={CITY} categorias={cats} proveedores={proveedores}/>
      </div>
      <div id="home-mobile">
        <HomeScreenMobile city={CITY} categorias={cats} proveedores={proveedores}/>
      </div>
      <style>{`
        @media (min-width: 768px) {
          #home-mobile { display: none !important; }
          #home-desktop { display: block !important; }
        }
      `}</style>
    </>
  );
}
