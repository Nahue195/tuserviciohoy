import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreateProveedorSchema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().min(3),
  categoriaId: z.string().optional(),
  categoriaSlug: z.string().optional(),
  direccion: z.string().optional(),
  precioDesde: z.number().int().positive(),
  whatsapp: z.string().optional(),
  neighborhood: z.string().optional(),
  hours: z.string().optional(),
  tags: z.array(z.string()).optional(),
  since: z.number().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoriaSlug = searchParams.get('categoria');
  const disponibleHoy = searchParams.get('disponibleHoy') === 'true';
  const q = searchParams.get('q');

  try {
    const proveedores = await prisma.proveedor.findMany({
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
      orderBy: { createdAt: 'desc' },
    });

    const result = proveedores.map((p, i) => {
      const avgRating = p.resenas.length > 0 ? p.resenas.reduce((s, r) => s + r.rating, 0) / p.resenas.length : 4.8;
      return {
        id: p.id,
        nombre: p.nombre,
        person: p.user.name ?? p.nombre,
        categoria: p.categoria,
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
      };
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Error al obtener proveedores' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const user = session.user as { email?: string | null };

  try {
    const body = await req.json() as unknown;
    const data = CreateProveedorSchema.parse(body);

    let categoriaId = data.categoriaId;
    if (!categoriaId && data.categoriaSlug) {
      const cat = await prisma.categoria.findUnique({ where: { slug: data.categoriaSlug } });
      categoriaId = cat?.id;
    }
    if (!categoriaId) return NextResponse.json({ error: 'Categoría no válida' }, { status: 400 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email ?? '' } });
    if (!dbUser) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    const proveedor = await prisma.proveedor.create({
      data: {
        userId: dbUser.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        categoriaId,
        direccion: data.direccion,
        precioDesde: data.precioDesde,
        whatsapp: data.whatsapp,
        neighborhood: data.neighborhood ?? 'Centro',
        hours: data.hours ?? 'Lun a Vie · 9:00 — 18:00',
        tags: data.tags ?? [],
        since: data.since ?? new Date().getFullYear(),
      },
    });

    await prisma.user.update({ where: { id: dbUser.id }, data: { role: 'PROVEEDOR' } });

    return NextResponse.json(proveedor, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) { console.error('ZodError:', e.errors); return NextResponse.json({ error: e.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ') }, { status: 400 }); }
    console.error('Error POST proveedor:', e);
    return NextResponse.json({ error: 'Error al crear proveedor' }, { status: 500 });
  }
}
