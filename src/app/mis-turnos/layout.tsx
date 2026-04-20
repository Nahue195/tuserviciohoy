import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis turnos | TuServicioHoy',
  description: 'Consultá, confirmá o cancelá tus turnos reservados en TuServicioHoy.',
};

export default function MisTurnosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
