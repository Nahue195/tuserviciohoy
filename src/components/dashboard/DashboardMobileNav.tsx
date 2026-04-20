'use client';

import { usePathname, useRouter } from 'next/navigation';
import { TshIcon } from '@/components/ui/TshIcon';

const NAV = [
  { href: '/dashboard', label: 'Agenda', icon: 'calendar2' },
  { href: '/dashboard/clientes', label: 'Clientes', icon: 'user' },
  { href: '/dashboard/estadisticas', label: 'Stats', icon: 'chart' },
  { href: '/dashboard/configuracion', label: 'Config', icon: 'settings' },
];

export function DashboardMobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex border-t" style={{ background: '#0A0A0A', borderColor: 'rgba(255,255,255,0.06)' }}>
      {NAV.map(item => {
        const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="flex-1 flex flex-col items-center gap-1 py-3 border-none cursor-pointer transition-colors"
            style={{ background: 'transparent', color: active ? '#E8673A' : 'rgba(255,255,255,0.3)' }}
          >
            <TshIcon name={item.icon} size={20} color="currentColor"/>
            <span className="font-sans text-[10px] font-semibold tracking-[0.2px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
