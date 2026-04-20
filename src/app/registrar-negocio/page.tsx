import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RegistrarNegocioForm } from '@/components/dashboard/RegistrarNegocioForm';

export default async function RegistrarNegocioPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login?callbackUrl=/registrar-negocio');

  const user = session.user as { email?: string | null };
  const existing = await prisma.proveedor.findFirst({ where: { user: { email: user.email ?? '' } } });
  if (existing) redirect('/dashboard');

  const categorias = await prisma.categoria.findMany({ orderBy: { nombre: 'asc' } });

  return <RegistrarNegocioForm categorias={categorias.map(c => ({ id: c.id, nombre: c.nombre, icono: c.icono }))} />;
}
