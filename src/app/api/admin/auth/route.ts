import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json() as { password?: string };
  const secret = process.env.ADMIN_SECRET;

  if (!secret || password !== secret) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('admin_token');
  return res;
}
