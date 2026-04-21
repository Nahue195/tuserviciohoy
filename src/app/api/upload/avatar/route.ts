import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const user = session.user as { email?: string | null };

  const proveedor = await prisma.proveedor.findFirst({
    where: { user: { email: user.email ?? '' } },
    select: { id: true },
  });
  if (!proveedor) return NextResponse.json({ error: 'Proveedor no encontrado' }, { status: 404 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Error al leer el archivo' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 });

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'La imagen no puede superar 5 MB' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${proveedor.id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from('provider-photos')
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    console.error('Supabase upload error:', uploadError);
    return NextResponse.json({ error: 'Error al subir imagen. Verificá que el bucket "provider-photos" existe en Supabase.' }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from('provider-photos').getPublicUrl(path);

  await prisma.proveedor.update({
    where: { id: proveedor.id },
    data: { fotoPerfil: publicUrl },
  });

  return NextResponse.json({ url: publicUrl });
}
