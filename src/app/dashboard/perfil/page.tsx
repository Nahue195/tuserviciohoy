import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PerfilView } from '@/components/dashboard/PerfilView';

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as { email?: string | null };

  const proveedor = await prisma.proveedor.findFirst({
    where: { user: { email: user.email ?? '' } },
    select: { id: true, nombre: true, descripcion: true, direccion: true, hours: true, since: true, neighborhood: true, whatsapp: true, activo: true },
  });
  if (!proveedor) return null;

  return <PerfilView proveedor={proveedor}/>;
}
