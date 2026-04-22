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

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'La imagen no puede superar 5 MB' }, { status: 400 });
  }

  // Validate by magic bytes — client-provided Content-Type is not trustworthy
  const headerBytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = headerBytes[0] === 0xFF && headerBytes[1] === 0xD8 && headerBytes[2] === 0xFF;
  const isPng  = headerBytes[0] === 0x89 && headerBytes[1] === 0x50 && headerBytes[2] === 0x4E && headerBytes[3] === 0x47;
  const isGif  = headerBytes[0] === 0x47 && headerBytes[1] === 0x49 && headerBytes[2] === 0x46;
  const isWebp = headerBytes[0] === 0x52 && headerBytes[1] === 0x49 && headerBytes[2] === 0x46 && headerBytes[3] === 0x46
              && headerBytes[8] === 0x57 && headerBytes[9] === 0x45 && headerBytes[10] === 0x42 && headerBytes[11] === 0x50;
  if (!isJpeg && !isPng && !isGif && !isWebp) {
    return NextResponse.json({ error: 'Formato no válido. Usá JPG, PNG, GIF o WEBP.' }, { status: 400 });
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
