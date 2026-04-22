import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ConfiguracionView } from '@/components/dashboard/ConfiguracionView';

export default async function ConfiguracionPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as { email?: string | null };

  const proveedor = await prisma.proveedor.findFirst({
    where: { user: { email: user.email ?? '' } },
    include: { disponibilidad: { orderBy: { diaSemana: 'asc' } } },
  });
  if (!proveedor) return null;

  return (
    <ConfiguracionView
      proveedorId={proveedor.id}
      perfil={{
        nombre: proveedor.nombre,
        descripcion: proveedor.descripcion,
        direccion: proveedor.direccion ?? '',
        neighborhood: proveedor.neighborhood,
        whatsapp: proveedor.whatsapp ?? '',
        hours: proveedor.hours,
        precioDesde: proveedor.precioDesde,
        tags: proveedor.tags,
        fotoPerfil: proveedor.fotoPerfil ?? undefined,
        modoContacto: proveedor.modoContacto,
      }}
      disponibilidad={proveedor.disponibilidad.map(d => ({
        id: d.id, diaSemana: d.diaSemana,
        horaInicio: d.horaInicio, horaFin: d.horaFin,
        intervaloMinutos: d.intervaloMinutos,
      }))}
    />
  );
}
