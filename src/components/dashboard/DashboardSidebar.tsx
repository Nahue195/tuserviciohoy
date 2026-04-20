'use client';

import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { TshAvatar } from '@/components/ui/TshAvatar';
import { TshIcon } from '@/components/ui/TshIcon';

const NAV = [
  { href: '/dashboard', label: 'Agenda', icon: 'calendar2' },
  { href: '/dashboard/clientes', label: 'Clientes', icon: 'user' },
  { href: '/dashboard/servicios', label: 'Servicios y precios', icon: 'sparkle' },
  { href: '/dashboard/estadisticas', label: 'Estadísticas', icon: 'chart' },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: 'settings' },
  { href: '/dashboard/plan', label: 'Mi plan', icon: 'sparkle' },
];

interface Props { proveedorNombre: string; personName: string; plan?: string }

export function DashboardSidebar({ proveedorNombre, personName, plan = 'FREE' }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-56 shrink-0 bg-[#0A0A0A] border-r border-white/[0.05] flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.05]">
        <div onClick={() => router.push('/')} className="inline-flex items-center gap-2.5 cursor-pointer">
          <svg width="22" height="28" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
            <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex flex-col leading-[1.1]">
            <span className="font-sans font-bold text-[11px] text-white">Tu</span>
            <span className="font-sans font-bold text-[15px] tracking-[-0.2px]"><span className="text-[#E8673A]">Servicio</span><span className="text-white">Hoy</span></span>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-3 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
          <TshAvatar name={personName} seed={3} size={32}/>
          <div className="flex-1 min-w-0">
            <div className="font-sans text-[13px] font-semibold text-white truncate">{proveedorNombre}</div>
            <div className="font-sans text-[11px]" style={{ color: plan === 'PRO' ? '#E8673A' : 'rgba(255,255,255,0.35)' }}>
              {plan === 'PRO' ? '⚡ Plan Pro' : 'Plan Starter'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        {NAV.map(item => {
          const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
          return (
            <div
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer font-sans text-[13px] transition-all duration-100 ${
                active
                  ? 'bg-white/[0.08] text-white font-semibold'
                  : 'text-white/45 font-medium hover:bg-white/[0.04] hover:text-white/75'
              }`}
            >
              <TshIcon name={item.icon} size={15} color="currentColor"/>
              {item.label}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 flex flex-col gap-1">
        {/* Plan CTA */}
        {plan !== 'PRO' ? (
          <div className="mx-0 mb-2 p-3 rounded-xl bg-[#E8673A]/[0.08] border border-[#E8673A]/20">
            <div className="font-sans text-[12px] font-bold text-[#E8673A] mb-0.5">Mejorá a Pro</div>
            <div className="font-sans text-[11px] text-white/40 leading-[1.4] mb-2">Turnos ilimitados y publicidad en redes</div>
            <div onClick={() => router.push('/dashboard/plan')} className="font-sans text-[11px] font-bold text-[#E8673A] inline-flex items-center gap-1 cursor-pointer hover:opacity-75">
              Ver planes <TshIcon name="arrowR" size={10} color="#E8673A"/>
            </div>
          </div>
        ) : (
          <div className="mx-0 mb-2 p-3 rounded-xl bg-[#E8673A]/[0.06] border border-[#E8673A]/10">
            <div className="font-sans text-[12px] font-bold text-[#E8673A] mb-0.5">⚡ Plan Pro activo</div>
            <div onClick={() => router.push('/dashboard/plan')} className="font-sans text-[11px] text-white/30 cursor-pointer hover:text-white/50 transition-colors">
              Administrar plan →
            </div>
          </div>
        )}

        <div
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer font-sans text-[13px] text-white/30 font-medium hover:text-white/55 transition-colors"
        >
          <TshIcon name="close" size={14} color="currentColor"/>
          Cerrar sesión
        </div>
      </div>
    </aside>
  );
}
