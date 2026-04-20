import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import ProveedorPageClient from './ProveedorPageClient';

const CITY = process.env.NEXT_PUBLIC_CITY_NAME ?? 'Trenque Lauquen';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tuserviciohoy.com';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await prisma.proveedor.findUnique({
    where: { id: params.id },
    select: { nombre: true, descripcion: true, neighborhood: true, categoria: { select: { nombre: true } } },
  });

  if (!p) return { title: 'Proveedor | TuServicioHoy' };

  const title = `${p.nombre} — ${p.categoria?.nombre ?? 'Servicios'} en ${p.neighborhood ?? CITY} | TuServicioHoy`;
  const description = p.descripcion
    ? p.descripcion.slice(0, 155)
    : `Reservá un turno con ${p.nombre}, proveedor de ${p.categoria?.nombre ?? 'servicios'} en ${CITY}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/proveedor/${params.id}`,
      siteName: 'TuServicioHoy',
      locale: 'es_AR',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default function ProveedorPage() {
  return <ProveedorPageClient />;
}
