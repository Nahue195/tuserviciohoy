import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardMobileNav } from '@/components/dashboard/DashboardMobileNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login');

  const user = session.user as { email?: string | null };

  const proveedor = await prisma.proveedor.findFirst({
    where: { user: { email: user.email ?? '' } },
    include: { user: { select: { name: true } } },
  });

  if (!proveedor) {
    const userName = (session.user as { name?: string | null }).name;
    return (
      <div className="bg-[#0D0D0D] min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-[480px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10 justify-center">
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
              <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col leading-[1.1]">
              <span className="font-sans font-bold text-[11px] text-white">Tu</span>
              <span className="font-sans font-bold text-[15px] tracking-[-0.2px]">
                <span className="text-[#E8673A]">Servicio</span><span className="text-white">Hoy</span>
              </span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-[#161616] border border-white/[0.06] rounded-3xl p-8">
            <div className="mb-6">
              <div className="font-sans font-bold text-[26px] text-white tracking-[-0.5px] leading-[1.2]">
                {userName ? `Hola, ${userName.split(' ')[0]} 👋` : 'Bienvenido 👋'}
              </div>
              <p className="font-sans text-[15px] text-white/50 mt-2 m-0 leading-relaxed">
                Ya tenés tu cuenta lista. El siguiente paso es registrar tu negocio para empezar a recibir turnos online.
              </p>
            </div>

            {/* Benefits */}
            <div className="flex flex-col gap-3 mb-7">
              {[
                { icon: '📅', title: 'Agenda online 24/7', desc: 'Tus clientes reservan solos, sin llamadas' },
                { icon: '🔔', title: 'Notificaciones automáticas', desc: 'Email al instante cuando llega un turno nuevo' },
                { icon: '📊', title: 'Panel de control', desc: 'Estadísticas, clientes y configuración en un solo lugar' },
              ].map(b => (
                <div key={b.title} className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.05]">
                  <span className="text-xl shrink-0">{b.icon}</span>
                  <div>
                    <div className="font-sans font-semibold text-[13px] text-white">{b.title}</div>
                    <div className="font-sans text-[12px] text-white/40 mt-0.5">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/registrar-negocio"
              className="block w-full py-4 bg-[#E8673A] text-white font-sans font-bold text-[15px] rounded-xl text-center no-underline hover:opacity-90 transition-opacity"
            >
              Registrar mi negocio →
            </a>
          </div>

          <div className="text-center mt-5">
            <a href="/" className="font-sans text-[13px] text-white/30 no-underline hover:text-white/55 transition-colors">
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <DashboardSidebar proveedorNombre={proveedor.nombre} personName={proveedor.user.name ?? 'Proveedor'} plan={proveedor.plan}/>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40" style={{ background: '#0A0A0A', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <svg width="18" height="23" viewBox="0 0 28 36" fill="none">
              <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
              <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-sans font-bold text-[14px]">
              <span className="text-[#E8673A]">Servicio</span><span className="text-white">Hoy</span>
            </span>
          </div>
          <span className="font-sans text-[13px] font-medium truncate max-w-[160px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {proveedor.nombre}
          </span>
        </div>

        <main className="flex-1 px-4 md:px-8 py-5 md:py-7 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardMobileNav/>
    </div>
  );
}
