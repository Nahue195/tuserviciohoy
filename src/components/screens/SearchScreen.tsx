'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { TshIcon } from '@/components/ui/TshIcon';
import { TshProviderCard } from '@/components/ui/TshProviderCard';
import type { CategoriaData, ProveedorCard } from '@/types';

interface SearchScreenProps {
  query?: string;
  categorias: CategoriaData[];
  proveedores: ProveedorCard[];
  total: number;
  city: string;
}

/* ─── Mobile ─────────────────────────────────────────────────────────── */
export function SearchScreenMobile({ query = '', categorias, proveedores, total, city }: SearchScreenProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [activeCat, setActiveCat] = useState('');

  const filtered = proveedores.filter(p => {
    if (activeCat && p.categoria.slug !== activeCat) return false;
    if (activeFilter === 'hoy' && !p.availableToday) return false;
    return true;
  });

  return (
    <div className="bg-[#F5EDDE] min-h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-[#F5EDDE] border-b border-[#E5D9C2] px-4 pt-3 pb-3">
        <div className="flex items-center gap-2.5 mb-3">
          <button onClick={() => router.push('/')} className="w-9 h-9 rounded-full border border-[#E5D9C2] bg-[#FFFBF3] flex items-center justify-center cursor-pointer shrink-0">
            <TshIcon name="chevronL" size={16} color="#2A2420"/>
          </button>
          <div className="flex-1 flex items-center gap-2.5 bg-[#FFFBF3] rounded-xl border border-[#E5D9C2] px-3.5 py-2.5">
            <TshIcon name="search" size={15} color="#8B7D6B"/>
            <input
              defaultValue={query}
              onKeyDown={e => e.key === 'Enter' && router.push(`/buscar?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`)}
              placeholder="¿Qué buscás?"
              className="flex-1 border-none outline-none bg-transparent font-sans text-[14px] text-[#1A1208] font-medium placeholder:text-[#8B7D6B]"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 hide-scrollbar">
          <button
            onClick={() => setActiveCat('')}
            className={`px-3 py-1.5 rounded-full font-sans text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${!activeCat ? 'bg-[#1A1208] text-[#F5EDDE] border-[#1A1208]' : 'bg-[#FFFBF3] text-[#5C5048] border-[#E5D9C2]'}`}
          >
            Todos
          </button>
          {categorias.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCat(activeCat === c.slug ? '' : c.slug)}
              className={`px-3 py-1.5 rounded-full font-sans text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer border transition-colors`}
              style={activeCat === c.slug
                ? { background: c.color, color: '#fff', borderColor: c.color }
                : { background: '#FFFBF3', color: '#5C5048', borderColor: '#E5D9C2' }
              }
            >
              {c.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="font-sans text-[13px] text-[#5C5048]">
          <span className="font-bold text-[#1A1208]">{filtered.length}</span> resultados en {city}
        </div>
        <button
          onClick={() => setActiveFilter(activeFilter === 'hoy' ? 'todos' : 'hoy')}
          className={`px-3 py-1.5 rounded-full font-sans text-[12px] font-semibold cursor-pointer border transition-colors ${activeFilter === 'hoy' ? 'bg-[#0F6E4E] text-white border-[#0F6E4E]' : 'bg-[#FFFBF3] text-[#5C5048] border-[#E5D9C2]'}`}
        >
          ● Disponible hoy
        </button>
      </div>

      <div className="px-4 pb-10 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-14 text-[#8B7D6B] font-sans text-[14px]">Sin resultados para esta búsqueda</div>
        )}
        {filtered.map(p => (
          <TshProviderCard key={p.id} provider={p} onClick={() => router.push(`/proveedor/${p.id}`)}/>
        ))}
      </div>
    </div>
  );
}

/* ─── Desktop ─────────────────────────────────────────────────────────── */
export function SearchScreenDesktop({ query = '', categorias, proveedores, total, city }: SearchScreenProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as { name?: string; image?: string } | undefined;
  const [menuOpen, setMenuOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [availOnly, setAvailOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxDist, setMaxDist] = useState(10);

  const filtered = proveedores.filter(p => {
    if (availOnly && !p.availableToday) return false;
    if (selectedCats.size > 0 && !selectedCats.has(p.categoria.slug)) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    if (p.distanceKm > maxDist) return false;
    return true;
  });

  const toggleCat = (slug: string) => {
    const next = new Set(selectedCats);
    if (next.has(slug)) next.delete(slug); else next.add(slug);
    setSelectedCats(next);
  };

  const clearFilters = () => { setSelectedCats(new Set()); setAvailOnly(false); setMinRating(0); setMaxDist(10); };
  const hasFilters = selectedCats.size > 0 || availOnly || minRating > 0 || maxDist < 10;

  return (
    <div className="min-h-full bg-[#F5EDDE]">

      {/* Top bar */}
      <div className="bg-[#0F0D0B] border-b border-white/[0.08] px-10 py-4 flex items-center gap-5">
        {/* Logo */}
        <div onClick={() => router.push('/')} className="inline-flex items-center gap-2 cursor-pointer shrink-0">
          <svg width="22" height="28" viewBox="0 0 28 36" fill="none">
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
            <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex flex-col leading-[1.1]">
            <span className="font-sans font-bold text-[10px] text-white">Tu</span>
            <span className="font-sans font-bold text-[14px] tracking-[-0.2px]"><span className="text-[#E8673A]">Servicio</span><span className="text-white">Hoy</span></span>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-[600px] flex items-center gap-2 bg-white/[0.07] border border-white/[0.1] rounded-xl p-1.5">
          <div className="flex items-center gap-2 px-3 flex-1">
            <TshIcon name="search" size={15} color="rgba(245,237,222,0.4)"/>
            <input
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && router.push(`/buscar?q=${encodeURIComponent(localQuery)}`)}
              placeholder="Buscar servicios, profesionales…"
              className="flex-1 border-none outline-none bg-transparent font-sans text-[14px] text-[#F5EDDE] placeholder:text-[#F5EDDE]/30 py-2"
            />
          </div>
          <div className="w-px h-5 bg-white/10"/>
          <div className="flex items-center gap-2 px-3 w-[150px]">
            <TshIcon name="pin" size={13} color="rgba(245,237,222,0.35)"/>
            <span className="font-sans text-[13px] text-[#F5EDDE]/50 truncate">{city}</span>
          </div>
          <button
            onClick={() => router.push(`/buscar?q=${encodeURIComponent(localQuery)}`)}
            className="px-5 h-9 rounded-lg bg-[#E8673A] border-none cursor-pointer text-white font-sans text-[13px] font-bold hover:opacity-90 transition-opacity shrink-0"
          >
            Buscar
          </button>
        </div>

        {/* Nav right */}
        <div className="ml-auto flex gap-2 items-center relative">
          {status === 'loading' ? (
            <div className="w-20 h-9 rounded-full bg-white/10"/>
          ) : session ? (
            <>
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] hover:border-white/25 cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#E8673A] flex items-center justify-center overflow-hidden shrink-0">
                  {user?.image ? (
                    <img src={user.image} alt="" className="w-full h-full object-cover"/>
                  ) : (
                    <span className="font-sans text-[13px] font-bold text-white">{user?.name?.[0]?.toUpperCase() ?? '?'}</span>
                  )}
                </div>
                <span className="font-sans text-sm font-medium text-white/70">{user?.name?.split(' ')[0] ?? 'Mi cuenta'}</span>
                <TshIcon name="chevronD" size={12} color="rgba(255,255,255,0.3)"/>
              </div>
              {menuOpen && (
                <div className="absolute right-0 top-12 bg-[#1A1208] border border-white/[0.08] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] min-w-[180px] z-50">
                  <div className="px-4 py-2.5 font-sans text-[13px] text-white/40 border-b border-white/[0.06]">{user?.name}</div>
                  <div onClick={() => { setMenuOpen(false); router.push('/dashboard'); }} className="px-4 py-3 font-sans text-sm text-white/80 cursor-pointer hover:bg-white/[0.05]">Mi panel</div>
                  <div onClick={() => { setMenuOpen(false); router.push('/mis-turnos'); }} className="px-4 py-3 font-sans text-sm text-white/80 cursor-pointer border-t border-white/[0.06] hover:bg-white/[0.05]">Mis turnos</div>
                  <div onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-3 font-sans text-sm text-[#E8673A] cursor-pointer hover:bg-white/[0.05]">Cerrar sesión</div>
                </div>
              )}
            </>
          ) : (
            <>
              <button onClick={() => router.push('/auth/login')} className="px-4 h-9 rounded-lg border border-white/[0.15] bg-transparent text-white/60 font-sans text-[13px] font-medium cursor-pointer hover:border-white/30 hover:text-white/90 transition-colors">Ingresar</button>
              <button onClick={() => router.push('/dashboard')} className="px-4 h-9 rounded-lg bg-[#E8673A] border-none text-white font-sans text-[13px] font-bold cursor-pointer hover:opacity-90 transition-opacity">Sumá tu negocio</button>
            </>
          )}
        </div>
      </div>

      {/* Category strip */}
      <div className="bg-[#FFFBF3] border-b border-[#EFE5D0] px-10 py-3 flex items-center gap-2.5 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setSelectedCats(new Set())}
          className={`px-4 py-2 rounded-full font-sans text-[12px] font-bold whitespace-nowrap shrink-0 cursor-pointer border transition-all ${selectedCats.size === 0 ? 'bg-[#1A1208] text-[#F5EDDE] border-[#1A1208]' : 'bg-transparent text-[#5C5048] border-[#E5D9C2] hover:border-[#1A1208]'}`}
        >
          Todos
        </button>
        {categorias.map(c => {
          const active = selectedCats.has(c.slug);
          return (
            <button
              key={c.id}
              onClick={() => toggleCat(c.slug)}
              className="px-4 py-2 rounded-full font-sans text-[12px] font-bold whitespace-nowrap shrink-0 cursor-pointer border transition-all flex items-center gap-2"
              style={active
                ? { background: c.color, color: '#fff', borderColor: c.color }
                : { background: 'transparent', color: '#5C5048', borderColor: '#E5D9C2' }
              }
            >
              <TshIcon name={c.icono} size={13} color={active ? '#fff' : c.color}/>
              {c.nombre}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex gap-0 px-10 py-6">

        {/* Filters sidebar */}
        <aside className="w-[220px] shrink-0 mr-6">
          <div className="bg-[#FFFBF3] border border-[#EFE5D0] rounded-2xl p-5 sticky top-6">
            <div className="flex justify-between items-center mb-5">
              <span className="font-sans font-bold text-[14px] text-[#1A1208]">Filtros</span>
              {hasFilters && (
                <button onClick={clearFilters} className="font-sans text-[11px] text-[#E8673A] font-semibold cursor-pointer bg-transparent border-none p-0">Limpiar</button>
              )}
            </div>

            {/* Disponible hoy */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#EFE5D0]">
              <span className="font-sans text-[13px] font-semibold text-[#1A1208]">Disponible hoy</span>
              <button
                onClick={() => setAvailOnly(!availOnly)}
                className="w-10 h-[22px] rounded-full relative cursor-pointer border-none transition-colors duration-150"
                style={{ background: availOnly ? '#0F6E4E' : '#E5D9C2' }}
              >
                <div className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-150" style={{ left: availOnly ? 20 : 2 }}/>
              </button>
            </div>

            {/* Rating */}
            <div className="mb-4 pb-4 border-b border-[#EFE5D0]">
              <div className="font-sans text-[13px] font-semibold text-[#1A1208] mb-3">Calificación</div>
              <div className="flex gap-1.5 flex-wrap">
                {[0, 3, 4, 4.5].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className="px-2.5 py-1.5 rounded-lg font-sans text-[11px] font-bold cursor-pointer border transition-all"
                    style={minRating === r
                      ? { background: '#1A1208', color: '#F5EDDE', borderColor: '#1A1208' }
                      : { background: 'transparent', color: '#5C5048', borderColor: '#E5D9C2' }
                    }
                  >
                    {r === 0 ? 'Todos' : `${r}+★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-sans text-[13px] font-semibold text-[#1A1208]">Distancia</span>
                <span className="font-sans text-[12px] text-[#E8673A] font-bold">{maxDist} km</span>
              </div>
              <input
                type="range" min={1} max={10} value={maxDist}
                onChange={e => setMaxDist(+e.target.value)}
                className="w-full accent-[#E8673A]"
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="font-sans font-bold text-[24px] text-[#1A1208] tracking-[-0.5px] m-0">
                {query ? `"${query}"` : selectedCats.size > 0 ? [...selectedCats].map(s => categorias.find(c => c.slug === s)?.nombre).join(', ') : 'Todos los servicios'}
              </h1>
              <p className="font-sans text-[13px] text-[#8B7D6B] mt-1 m-0">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} en {city}
              </p>
            </div>
            {hasFilters && (
              <div className="flex flex-wrap gap-1.5">
                {availOnly && (
                  <span className="px-2.5 py-1 rounded-full font-sans text-[11px] font-semibold bg-[#E3EFE8] text-[#0F6E4E] flex items-center gap-1">
                    Disponible hoy
                    <button onClick={() => setAvailOnly(false)} className="bg-transparent border-none cursor-pointer text-[#0F6E4E] p-0 leading-none text-base">×</button>
                  </span>
                )}
                {[...selectedCats].map(slug => {
                  const cat = categorias.find(c => c.slug === slug);
                  return cat ? (
                    <span key={slug} className="px-2.5 py-1 rounded-full font-sans text-[11px] font-semibold flex items-center gap-1" style={{ background: cat.tint, color: cat.color }}>
                      {cat.nombre}
                      <button onClick={() => toggleCat(slug)} className="bg-transparent border-none cursor-pointer p-0 leading-none text-base" style={{ color: cat.color }}>×</button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-[#FFFBF3] border border-[#EFE5D0] rounded-2xl p-16 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <div className="font-sans font-semibold text-[17px] text-[#1A1208] mb-2">Sin resultados</div>
              <div className="font-sans text-[13px] text-[#8B7D6B] mb-5">Probá con otros filtros o términos de búsqueda</div>
              <button onClick={clearFilters} className="px-5 h-9 rounded-xl bg-[#E8673A] text-white font-sans text-[13px] font-bold border-none cursor-pointer hover:opacity-90 transition-opacity">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(p => (
                <TshProviderCard key={p.id} provider={p} variant="featured" onClick={() => router.push(`/proveedor/${p.id}`)}/>
              ))}
            </div>
          )}
        </main>

        {/* Map sidebar */}
        <aside className="w-[280px] shrink-0 ml-6 sticky top-6 h-[calc(100vh-120px)]">
          <div className="relative h-full rounded-2xl overflow-hidden border border-[#EFE5D0]">
            {/* Stylized map */}
            <div className="absolute inset-0 bg-[#E8E0D0]"/>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 600" preserveAspectRatio="none">
              <rect x="15" y="30" width="90" height="75" rx="5" fill="#D4C4A8"/>
              <rect x="120" y="15" width="110" height="90" rx="5" fill="#D4C4A8"/>
              <rect x="15" y="125" width="130" height="110" rx="5" fill="#D4C4A8"/>
              <rect x="165" y="125" width="90" height="55" rx="5" fill="#D4C4A8"/>
              <rect x="165" y="195" width="90" height="75" rx="5" fill="#D4C4A8"/>
              <rect x="15" y="255" width="75" height="95" rx="5" fill="#D4C4A8"/>
              <rect x="110" y="255" width="145" height="95" rx="5" fill="#D4C4A8"/>
              <rect x="15" y="370" width="130" height="95" rx="5" fill="#D4C4A8"/>
              <rect x="160" y="370" width="90" height="115" rx="5" fill="#D4C4A8"/>
              <rect x="15" y="485" width="95" height="95" rx="5" fill="#D4C4A8"/>
              <rect x="130" y="505" width="130" height="75" rx="5" fill="#D4C4A8"/>
              <path d="M 0 120 L 280 120" stroke="#E8E0D0" strokeWidth="9"/>
              <path d="M 0 250 L 280 250" stroke="#E8E0D0" strokeWidth="9"/>
              <path d="M 0 365 L 280 365" stroke="#E8E0D0" strokeWidth="9"/>
              <path d="M 0 480 L 280 480" stroke="#E8E0D0" strokeWidth="9"/>
              <path d="M 110 0 L 110 600" stroke="#E8E0D0" strokeWidth="9"/>
              <path d="M 0 530 Q 70 510 140 540 T 280 550" stroke="#B8D4D0" strokeWidth="20" fill="none" opacity="0.5"/>
            </svg>
            {/* Pins */}
            {filtered.slice(0, 6).map((p, i) => {
              const pins = [{ x: 50, y: 165 }, { x: 185, y: 95 }, { x: 75, y: 310 }, { x: 210, y: 235 }, { x: 145, y: 415 }, { x: 55, y: 445 }];
              const pin = pins[i] ?? { x: 100, y: 300 };
              const isFirst = i === 0;
              return (
                <div key={p.id} className="absolute flex flex-col items-center" style={{ left: `${(pin.x / 280) * 100}%`, top: `${(pin.y / 600) * 100}%`, transform: 'translate(-50%, -100%)', zIndex: isFirst ? 10 : 1 }}>
                  {isFirst && (
                    <div className="bg-[#FFFBF3] rounded-lg px-2.5 py-1.5 shadow-[0_4px_16px_rgba(60,40,20,0.2)] font-sans text-[10px] font-bold text-[#1A1208] whitespace-nowrap mb-1 border border-[#EFE5D0]">
                      {p.nombre.slice(0, 20)}
                    </div>
                  )}
                  <div className="px-2 py-1 rounded-full font-sans text-[10px] font-bold text-white shadow-[0_3px_10px_rgba(0,0,0,0.2)]" style={{ background: isFirst ? '#E8673A' : p.categoria.color }}>
                    ${Math.round(p.priceFrom / 1000)}k
                  </div>
                  <div className="w-px h-2" style={{ background: isFirst ? '#E8673A' : p.categoria.color }}/>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: isFirst ? '#E8673A' : p.categoria.color }}/>
                </div>
              );
            })}
            {/* Map footer */}
            <div className="absolute bottom-3 left-3 right-3 bg-[rgba(255,251,243,0.96)] backdrop-blur-sm rounded-xl px-3.5 py-2.5 flex items-center gap-2 border border-[#E5D9C2]">
              <TshIcon name="pin" size={13} color="#E8673A"/>
              <span className="font-sans text-[11px] text-[#1A1208] font-semibold">{city}</span>
              <span className="ml-auto font-sans text-[10px] text-[#8B7D6B]">{Math.min(6, filtered.length)} de {filtered.length}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
