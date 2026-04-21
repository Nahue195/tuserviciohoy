import { prisma } from '@/lib/prisma';
import { SearchScreenDesktop, SearchScreenMobile } from '@/components/screens/SearchScreen';
import type { CategoriaData, ProveedorCard } from '@/types';
import type { Metadata } from 'next';

const CITY = process.env.NEXT_PUBLIC_CITY_NAME ?? 'Trenque Lauquen';

export const metadata: Metadata = {
  title: `Buscar servicios en ${CITY} | TuServicioHoy`,
  description: `Encontrá y reservá turnos con los mejores profesionales y servicios locales en ${CITY}. Peluquería, plomería, electricistas, masajes y mucho más.`,
  openGraph: {
    title: `Buscar servicios en ${CITY} | TuServicioHoy`,
    description: `Encontrá y reservá turnos con los mejores profesionales en ${CITY}.`,
    siteName: 'TuServicioHoy',
    locale: 'es_AR',
    type: 'website',
  },
};

interface SearchPageProps {
  searchParams: { q?: string; categoria?: string; filtro?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q ?? '';
  const categoriaSlug = searchParams.categoria;

  const [categorias, rawProveedores] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.proveedor.findMany({
      where: {
        activo: true,
        ...(categoriaSlug ? { categoria: { slug: categoriaSlug } } : {}),
        ...(q ? {
          OR: [
            { nombre: { contains: q, mode: 'insensitive' } },
            { descripcion: { contains: q, mode: 'insensitive' } },
          ],
        } : {}),
      },
      include: {
        categoria: true,
        user: { select: { name: true } },
        resenas: { select: { rating: true } },
      },
      orderBy: [{ plan: 'desc' }, { createdAt: 'asc' }],
    }),
  ]);

  const cats: CategoriaData[] = categorias.map(c => ({
    id: c.id, nombre: c.nombre, slug: c.slug,
    icono: c.icono, color: c.color, tint: c.tint,
  }));

  const proveedores: ProveedorCard[] = rawProveedores.map((p, i) => {
    const avgRating = p.resenas.length > 0 ? p.resenas.reduce((s, r) => s + r.rating, 0) / p.resenas.length : 4.8;
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
      nextSlot: 'Disponible',
      availableToday: p.activo,
      coverSeed: i % 6,
      avatarSeed: i % 6,
      description: p.descripcion,
      tags: p.tags,
      hours: p.hours,
      since: p.since,
      lat: p.lat ?? undefined,
      lng: p.lng ?? undefined,
      isPro: p.plan === 'PRO',
      fotoPerfil: p.fotoPerfil,
    };
  });

  const props = { query: q, categorias: cats, proveedores, total: proveedores.length, city: CITY };

  return (
    <>
      <div id="search-desktop" style={{ display: 'none' }}>
        <SearchScreenDesktop {...props}/>
      </div>
      <div id="search-mobile">
        <SearchScreenMobile {...props}/>
      </div>
      <style>{`
        @media (min-width: 768px) {
          #search-mobile { display: none !important; }
          #search-desktop { display: block !important; }
        }
      `}</style>
    </>
  );
}
