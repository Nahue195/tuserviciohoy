import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { Resend } from 'resend';
import { prisma } from './prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    EmailProvider({
      from: process.env.EMAIL_FROM ?? 'TuServicioHoy <onboarding@resend.dev>',
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        await resend.emails.send({
          from: provider.from,
          to: identifier,
          subject: 'Tu link de acceso — TuServicioHoy',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
              <h2 style="color:#C4532A;margin-bottom:8px">TuServicioHoy</h2>
              <p style="color:#2A2420;font-size:16px">Hacé clic en el botón para ingresar:</p>
              <a href="${url}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#C4532A;color:#fff;text-decoration:none;border-radius:8px;font-size:16px">
                Ingresar a mi cuenta
              </a>
              <p style="color:#888;font-size:13px">Si no pediste este link, ignorá este email.</p>
            </div>
          `,
        });
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      if (token.id) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string }, select: { role: true } });
        token.role = dbUser?.role ?? 'CLIENTE';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify',
  },
};
