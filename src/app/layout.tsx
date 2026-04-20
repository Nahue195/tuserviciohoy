import type { Metadata } from 'next';
import { Fraunces } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Providers } from './providers';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  title: 'TuServicioHoy — Servicios locales, turnos online',
  description: 'Reservá turnos con profesionales de tu pueblo. Peluquería, médicos, abogados y más — en segundos, sin llamadas.',
  keywords: ['turnos', 'servicios locales', 'reservas online', 'peluquería', 'médico'],
  openGraph: {
    title: 'TuServicioHoy',
    description: 'Todo lo que necesitás, a la vuelta de tu barrio.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="m-0 p-0 bg-cream font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
