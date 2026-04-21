'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TshIcon } from './TshIcon';
import { TshButton } from './TshButton';

interface TshNavBarProps {
  city: string;
  variant?: 'mobile' | 'desktop';
  darkBg?: boolean;
}

export function TshNavBar({ city, variant = 'desktop', darkBg = false }: TshNavBarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = session?.user as { name?: string; image?: string; role?: string } | undefined;

  if (variant === 'mobile') {
    return (
      <div className="px-5 pt-2">
        <div className="flex justify-between items-center mb-3.5">
          <div/>
          {status === 'loading' ? (
            <div className="w-10 h-10 rounded-full bg-[#EFE5D0]"/>
          ) : session ? (
            <div className="relative">
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full bg-terra border-2 border-[#E5D9C2] flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {user?.image ? (
                  <img src={user.image} alt="" className="w-full h-full object-cover"/>
                ) : (
                  <span className="font-sans text-base font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() ?? '?'}
                  </span>
                )}
              </div>
              {menuOpen && (
                <div className="absolute right-0 top-12 bg-paper border border-[#EFE5D0] rounded-xl shadow-[0_8px_24px_rgba(60,40,20,0.12)] min-w-[160px] z-50">
                  <div className="px-4 py-2.5 font-sans text-[13px] text-[#8B7D6B] border-b border-[#EFE5D0]">{user?.name ?? 'Mi cuenta'}</div>
                  <div onClick={() => { setMenuOpen(false); router.push('/dashboard'); }} className="px-4 py-3 font-sans text-sm text-ink cursor-pointer hover:bg-[#F5EDDE]">Mi panel</div>
                  <div onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-3 font-sans text-sm text-terra cursor-pointer hover:bg-[#FFF5F0]">Cerrar sesión</div>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => router.push('/auth/login')}
              className="w-10 h-10 rounded-full bg-paper border border-[#E5D9C2] flex items-center justify-center cursor-pointer"
            >
              <TshIcon name="user" size={18} color="#2A2420"/>
            </div>
          )}
        </div>
      </div>
    );
  }

  const t = darkBg
    ? { border: 'border-white/[0.08]', navText: 'text-white/50', navHover: 'hover:text-white', logoText: 'text-white', cityBorder: 'border-white/[0.12]', cityText: 'text-white/50', cityHover: 'hover:border-white/30' }
    : { border: 'border-[#EADFC5]', navText: 'text-[#5C5048]', navHover: 'hover:text-terra', logoText: 'text-ink', cityBorder: 'border-[#E5D9C2]', cityText: 'text-[#5C5048]', cityHover: 'hover:border-terra' };

  return (
    <div className={`flex justify-between items-center px-14 py-[22px] border-b ${t.border}`}>
      <div className="flex items-center gap-10">
        <div onClick={() => router.push('/')} className="inline-flex items-center gap-2.5 cursor-pointer">
          <svg width="26" height="33" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
            <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex flex-col leading-[1.1]">
            <span className={`font-sans font-bold text-[12px] ${t.logoText}`}>Tu</span>
            <span className="font-sans font-bold text-[17px] tracking-[-0.3px]"><span className="text-terra">Servicio</span><span className={t.logoText}>Hoy</span></span>
          </div>
        </div>
        <nav className={`flex gap-7 font-sans text-sm font-medium ${t.navText}`}>
          <span onClick={() => router.push('/buscar')} className={`cursor-pointer ${t.navHover} transition-colors`}>Explorar</span>
          <span onClick={() => router.push('/buscar')} className={`cursor-pointer ${t.navHover} transition-colors`}>Categorías</span>
          <span className={`cursor-pointer ${t.navHover} transition-colors`}>Cómo funciona</span>
          <span className={`cursor-pointer ${t.navHover} transition-colors`}>Para comercios</span>
        </nav>
      </div>
      <div className="flex gap-3 items-center">
        {status === 'loading' ? (
          <div className={`w-[90px] h-9 rounded-full ${darkBg ? 'bg-white/10' : 'bg-[#EFE5D0]'}`}/>
        ) : session ? (
          <div className="relative">
            <div onClick={() => setMenuOpen(!menuOpen)} className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border cursor-pointer transition-colors ${darkBg ? 'border-white/[0.12] bg-white/[0.06] hover:border-white/25' : 'border-[#E5D9C2] bg-paper hover:border-terra'}`}>
              <div className="w-7 h-7 rounded-full bg-terra flex items-center justify-center overflow-hidden shrink-0">
                {user?.image ? (
                  <img src={user.image} alt="" className="w-full h-full object-cover"/>
                ) : (
                  <span className="font-sans text-[13px] font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() ?? '?'}
                  </span>
                )}
              </div>
              <span className={`font-sans text-sm font-medium ${darkBg ? 'text-white/70' : 'text-ink'}`}>
                {user?.name?.split(' ')[0] ?? 'Mi cuenta'}
              </span>
              <TshIcon name="chevronD" size={12} color={darkBg ? 'rgba(255,255,255,0.3)' : '#8B7D6B'}/>
            </div>
            {menuOpen && (
              <div className="absolute right-0 top-12 bg-paper border border-[#EFE5D0] rounded-xl shadow-[0_8px_24px_rgba(60,40,20,0.12)] min-w-[180px] z-50">
                <div className="px-4 py-2.5 font-sans text-[13px] text-[#8B7D6B] border-b border-[#EFE5D0]">{user?.name ?? 'Mi cuenta'}</div>
                <div onClick={() => { setMenuOpen(false); router.push('/dashboard'); }} className="px-4 py-3 font-sans text-sm text-ink cursor-pointer hover:bg-[#F5EDDE]">Mi panel</div>
                <div onClick={() => { setMenuOpen(false); router.push('/mis-turnos'); }} className="px-4 py-3 font-sans text-sm text-ink cursor-pointer border-t border-[#EFE5D0] hover:bg-[#F5EDDE]">Mis turnos</div>
                <div onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-3 font-sans text-sm text-terra cursor-pointer hover:bg-[#FFF5F0]">Cerrar sesión</div>
              </div>
            )}
          </div>
        ) : (
          <>
            {darkBg ? (
              <>
                <button onClick={() => router.push('/auth/login')} className="px-4 h-9 rounded-lg border border-white/[0.15] bg-transparent text-white/60 font-sans text-[13px] font-medium cursor-pointer hover:border-white/30 hover:text-white/90 transition-colors">Ingresar</button>
                <button onClick={() => router.push('/dashboard')} className="px-4 h-9 rounded-lg bg-[#E8673A] border-none text-white font-sans text-[13px] font-bold cursor-pointer hover:opacity-90 transition-opacity">Sumá tu negocio</button>
              </>
            ) : (
              <>
                <TshButton variant="ghost" size="sm" onClick={() => router.push('/auth/login')}>Ingresar</TshButton>
                <TshButton variant="primary" size="sm" onClick={() => router.push('/dashboard')}>Sumá tu negocio</TshButton>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
