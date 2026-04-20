'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TshIcon } from '@/components/ui/TshIcon';
import { TshProviderCard } from '@/components/ui/TshProviderCard';
import { TshNavBar } from '@/components/ui/TshNavBar';
import type { CategoriaData, ProveedorCard } from '@/types';

interface HomeScreenProps {
  city: string;
  categorias: CategoriaData[];
  proveedores: ProveedorCard[];
}

const POPULAR = ['Peluquería', 'Odontólogo', 'Electricista', 'Veterinario', 'Psicólogo'];

const STEPS_CLIENTE = [
  { n: '1', title: 'Buscá tu servicio', desc: 'Encontrá peluqueros, médicos, abogados y más de tu ciudad en segundos.' },
  { n: '2', title: 'Elegí horario', desc: 'Ves la disponibilidad en tiempo real y reservás el turno que más te conviene.' },
  { n: '3', title: '¡Listo!', desc: 'Recibís la confirmación al instante. Sin llamadas, sin esperas.' },
];

const STEPS_NEGOCIO = [
  { n: '1', title: 'Creá tu perfil', desc: 'Registrá tu negocio en 5 minutos. Es gratis y sin tarjeta.' },
  { n: '2', title: 'Configurá tu agenda', desc: 'Cargás tus horarios, servicios y precios. Listo para recibir turnos.' },
  { n: '3', title: 'Recibís clientes', desc: 'Tus clientes reservan solos. Vos recibís notificaciones al instante.' },
];

const TESTIMONIOS = [
  {
    nombre: 'Mariana G.',
    rol: 'Peluquería Mariana · Trenque Lauquen',
    texto: 'Antes perdía horas al teléfono coordinando turnos. Ahora mis clientas reservan solas y yo me dedico a trabajar.',
    stars: 5,
  },
  {
    nombre: 'Roberto C.',
    rol: 'Kinesiólogo · 9 de Julio',
    texto: 'En el primer mes tuve 38 turnos nuevos de personas que nunca me habían llamado. La plataforma se paga sola.',
    stars: 5,
  },
  {
    nombre: 'Sofía M.',
    rol: 'Psicóloga · Pehuajó',
    texto: 'Lo que más me gustó es que puedo ver mi agenda completa desde el celular. Muy fácil de usar.',
    stars: 5,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#E8673A">
          <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z"/>
        </svg>
      ))}
    </div>
  );
}

/* ─── MOBILE ──────────────────────────────────────────────────────────────── */
export function HomeScreenMobile({ city, categorias, proveedores }: HomeScreenProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-full" style={{ background: '#0F0D0B' }}>
      <TshNavBar city={city} variant="mobile"/>

      {/* Hero */}
      <div className="px-5 pt-6 pb-10 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-40px] w-[240px] h-[240px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(232,103,58,0.15), transparent 70%)' }}/>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] inline-block"/>
            <span className="font-sans text-[11px] text-white/50 font-medium">{proveedores.length}+ profesionales disponibles</span>
          </div>
          <h1 className="font-serif font-normal text-[40px] leading-[1.0] tracking-[-1.5px] text-[#F5EDDE] m-0">
            Todo lo que<br/>necesitás,{' '}
            <span className="italic text-[#E8673A]">a la vuelta</span><br/>de tu barrio.
          </h1>
          <p className="font-sans text-[14px] leading-[1.55] mt-3 mb-6" style={{ color: 'rgba(245,237,222,0.45)', maxWidth: 280 }}>
            Reservá turnos con profesionales de tu pueblo en segundos. Sin llamadas.
          </p>

          <div className="flex items-center gap-2.5 rounded-2xl border px-4 py-3.5" style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <TshIcon name="search" size={17} color="rgba(245,237,222,0.4)"/>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && router.push(`/buscar?q=${encodeURIComponent(query)}`)}
              placeholder="¿Qué servicio necesitás?"
              className="flex-1 border-none outline-none bg-transparent font-sans text-[15px] text-[#F5EDDE] placeholder:text-[#F5EDDE]/30 min-w-0"
            />
            <button
              onClick={() => router.push(`/buscar?q=${encodeURIComponent(query)}`)}
              className="w-9 h-9 rounded-xl border-none cursor-pointer flex items-center justify-center shrink-0"
              style={{ background: '#E8673A' }}
            >
              <TshIcon name="arrowR" size={15} color="#fff"/>
            </button>
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5 hide-scrollbar">
            {POPULAR.map(t => (
              <button key={t} onClick={() => router.push(`/buscar?q=${encodeURIComponent(t)}`)}
                className="px-3 py-1.5 rounded-full font-sans text-[12px] font-medium whitespace-nowrap shrink-0 cursor-pointer border border-white/[0.12] bg-transparent hover:border-[#E8673A]/50 hover:text-[#E8673A] transition-colors"
                style={{ color: 'rgba(245,237,222,0.5)' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cream section */}
      <div className="rounded-t-[28px]" style={{ background: '#F5EDDE' }}>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-px mx-5 mt-7 mb-7 rounded-2xl overflow-hidden border border-[#EFE5D0]">
          {[
            { n: `${proveedores.length}+`, label: 'profesionales' },
            { n: '100%', label: 'gratis para empezar' },
            { n: '24/7', label: 'reservas online' },
          ].map(s => (
            <div key={s.label} className="bg-paper px-3 py-4 text-center">
              <div className="font-sans font-bold text-[22px] tracking-[-0.5px] text-ink">{s.n}</div>
              <div className="font-sans text-[10px] text-[#8B7D6B] mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="px-5 mb-8">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="font-sans font-bold text-[20px] text-ink m-0 tracking-[-0.4px]">Categorías</h2>
            <span onClick={() => router.push('/buscar')} className="font-sans text-[12px] text-terra font-semibold cursor-pointer">Ver todas</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {categorias.slice(0, 6).map(c => (
              <div key={c.id} onClick={() => router.push(`/buscar?categoria=${c.slug}`)}
                className="flex items-center gap-3 p-3.5 rounded-[16px] cursor-pointer hover:scale-[1.01] transition-transform"
                style={{ background: c.tint }}>
                <div className="w-9 h-9 rounded-[10px] bg-white/60 flex items-center justify-center shrink-0">
                  <TshIcon name={c.icono} size={18} color={c.color}/>
                </div>
                <div>
                  <div className="font-sans font-semibold text-[13px] leading-[1.1]" style={{ color: c.color }}>{c.nombre}</div>
                  <div className="font-sans text-[11px] opacity-60 mt-0.5" style={{ color: c.color }}>profesionales</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Providers */}
        <div className="px-5 mb-8">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="font-sans font-bold text-[20px] text-ink m-0 tracking-[-0.4px]">Cerca tuyo</h2>
            <span onClick={() => router.push('/buscar')} className="font-sans text-[12px] text-terra font-semibold cursor-pointer">Ver todos</span>
          </div>
          <div className="flex flex-col gap-3">
            {proveedores.slice(0, 3).map(p => (
              <TshProviderCard key={p.id} provider={p} onClick={() => router.push(`/proveedor/${p.id}`)}/>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="px-5 mb-8">
          <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[1px] font-bold mb-1">¿Cómo funciona?</div>
          <h2 className="font-sans font-bold text-[20px] text-ink m-0 tracking-[-0.4px] mb-5">Reservá en 3 pasos</h2>
          <div className="flex flex-col gap-4">
            {STEPS_CLIENTE.map(s => (
              <div key={s.n} className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-sans font-bold text-[15px] shrink-0 mt-0.5"
                  style={{ background: '#E8673A', color: 'white' }}>{s.n}</div>
                <div>
                  <div className="font-sans font-semibold text-[14px] text-ink">{s.title}</div>
                  <div className="font-sans text-[13px] text-[#8B7D6B] leading-[1.5] mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonios */}
        <div className="px-5 mb-8">
          <div className="font-sans font-bold text-[20px] text-ink tracking-[-0.4px] mb-4">Lo que dicen los profesionales</div>
          <div className="flex flex-col gap-3">
            {TESTIMONIOS.map(t => (
              <div key={t.nombre} className="bg-paper border border-[#EFE5D0] rounded-2xl p-4">
                <Stars n={t.stars}/>
                <p className="font-sans text-[13px] text-ink leading-[1.6] mt-2 mb-3">&quot;{t.texto}&quot;</p>
                <div className="font-sans text-[11px] font-semibold text-ink">{t.nombre}</div>
                <div className="font-sans text-[11px] text-[#8B7D6B]">{t.rol}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Provider CTA */}
        <div className="px-5 pb-8">
          <div className="rounded-[22px] p-6 relative overflow-hidden" style={{ background: '#1A1208' }}>
            <div className="absolute -top-8 -right-8 w-[140px] h-[140px] rounded-full pointer-events-none" style={{ background: 'rgba(232,103,58,0.2)' }}/>
            <div className="relative">
              <div className="font-sans text-[10px] text-[#E8673A] uppercase tracking-[1.2px] font-bold mb-2">Para tu negocio</div>
              <div className="font-serif text-[24px] text-[#F5EDDE] leading-[1.1] tracking-[-0.4px] mb-3">
                Sumá tu negocio <span className="italic text-[#E8673A]">gratis</span> y llenate de turnos.
              </div>
              <div className="flex flex-col gap-2 mb-5">
                {['Sin llamadas ni mensajes perdidos', 'Tus clientes reservan solos, las 24 hs', 'Gratis para siempre en el plan Starter'].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shrink-0"/>
                    <span className="font-sans text-[13px]" style={{ color: 'rgba(245,237,222,0.6)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.push('/dashboard')}
                  className="flex-1 py-3 rounded-xl font-sans text-[13px] font-bold border-none cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: '#E8673A', color: 'white' }}>
                  Empezar gratis →
                </button>
                <button onClick={() => router.push('/precios')}
                  className="px-4 py-3 rounded-xl font-sans text-[13px] font-semibold cursor-pointer border border-white/10 hover:border-white/25 transition-colors"
                  style={{ background: 'transparent', color: 'rgba(245,237,222,0.5)' }}>
                  Ver planes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer mobile */}
        <div className="px-5 pb-8 border-t border-[#EFE5D0] pt-5">
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="20" viewBox="0 0 28 36" fill="none">
              <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
              <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-sans font-bold text-[14px]"><span className="text-terra">Servicio</span><span className="text-ink">Hoy</span></span>
          </div>
          <div className="font-sans text-[12px] text-[#8B7D6B] mb-4">Hecho en Argentina, para pueblos argentinos.</div>
          <div className="flex gap-4">
            {['Términos', 'Privacidad', 'Ayuda'].map(t => (
              <span key={t} className="font-sans text-[12px] text-[#8B7D6B] cursor-pointer hover:text-ink transition-colors">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DESKTOP ─────────────────────────────────────────────────────────────── */
export function HomeScreenDesktop({ city, categorias, proveedores }: HomeScreenProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="min-h-full" style={{ background: '#0F0D0B' }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: '#0F0D0B' }}>
        <div className="absolute top-[-180px] right-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at 40% 40%, rgba(232,103,58,0.12), transparent 65%)' }}/>
        <div className="absolute bottom-[-80px] left-[8%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.05), transparent 70%)' }}/>
        <div className="relative">
          <TshNavBar city={city} variant="desktop" darkBg/>
        </div>
        <div className="relative px-14 pt-16 pb-24">
          <div className="max-w-[900px]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.05] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"/>
              <span className="font-sans text-[12px] font-medium" style={{ color: 'rgba(245,237,222,0.55)' }}>{proveedores.length}+ profesionales locales disponibles hoy en {city}</span>
            </div>
            <h1 className="font-serif font-normal leading-[0.93] tracking-[-3.5px] text-[#F5EDDE] m-0 mb-6"
              style={{ fontSize: 'clamp(64px, 6.5vw, 96px)' }}>
              Todo lo que<br/>
              necesitás,{' '}
              <span className="italic text-[#E8673A]">a la vuelta</span><br/>
              de tu barrio.
            </h1>
            <p className="font-sans text-[18px] leading-[1.55] max-w-[520px] m-0 mb-10"
              style={{ color: 'rgba(245,237,222,0.45)' }}>
              Reservá turnos con peluqueros, médicos, abogados y oficios de tu pueblo. Sin llamadas, en 30 segundos.
            </p>

            {/* Search */}
            <div className="max-w-[680px]">
              <div className={`flex items-center gap-2 rounded-[22px] p-2 transition-all duration-200 ${
                focused ? 'shadow-[0_0_0_4px_rgba(232,103,58,0.1)]' : ''
              }`} style={{
                background: focused ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)',
                border: `1px solid ${focused ? 'rgba(232,103,58,0.4)' : 'rgba(255,255,255,0.1)'}`,
              }}>
                <div className="flex items-center gap-2.5 px-3 flex-[1.4]">
                  <TshIcon name="search" size={17} color="rgba(245,237,222,0.4)"/>
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={e => e.key === 'Enter' && router.push(`/buscar?q=${encodeURIComponent(query)}`)}
                    placeholder="¿Qué servicio necesitás?"
                    className="flex-1 border-none outline-none bg-transparent font-sans text-[15px] text-[#F5EDDE] placeholder:text-[#F5EDDE]/30 py-3.5 min-w-0"
                  />
                </div>
                <div className="w-px h-7 bg-white/10"/>
                <div className="flex items-center gap-2.5 px-3 flex-1">
                  <TshIcon name="pin" size={15} color="rgba(245,237,222,0.35)"/>
                  <input defaultValue={city}
                    className="flex-1 border-none outline-none bg-transparent font-sans text-[15px] py-3.5 min-w-0"
                    style={{ color: 'rgba(245,237,222,0.6)' }}/>
                </div>
                <button onClick={() => router.push(`/buscar?q=${encodeURIComponent(query)}`)}
                  className="px-6 h-[52px] rounded-[16px] border-none cursor-pointer font-sans text-[14px] font-bold inline-flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
                  style={{ background: '#E8673A', color: 'white' }}>
                  Buscar <TshIcon name="arrowR" size={15} color="#fff"/>
                </button>
              </div>
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="font-sans text-[12px] font-medium" style={{ color: 'rgba(245,237,222,0.3)' }}>Popular:</span>
                {POPULAR.map(t => (
                  <button key={t} onClick={() => router.push(`/buscar?q=${encodeURIComponent(t)}`)}
                    className="px-3 py-1 rounded-full border border-white/[0.1] bg-transparent font-sans text-[12px] font-medium cursor-pointer hover:border-[#E8673A]/50 hover:text-[#E8673A] transition-colors"
                    style={{ color: 'rgba(245,237,222,0.45)' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="border-y" style={{ background: '#1A1208', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="px-14 py-5 flex items-center gap-0 divide-x divide-white/[0.06]">
          {[
            { n: `${proveedores.length}+`, label: 'profesionales activos' },
            { n: '100%', label: 'gratis para empezar' },
            { n: '24/7', label: 'reservas online' },
            { n: '< 30s', label: 'para reservar un turno' },
          ].map((s, i) => (
            <div key={s.label} className={`flex items-center gap-3 ${i > 0 ? 'pl-10 ml-10' : ''}`}>
              <span className="font-sans font-bold text-[22px] tracking-[-0.5px]" style={{ color: '#E8673A' }}>{s.n}</span>
              <span className="font-sans text-[13px]" style={{ color: 'rgba(245,237,222,0.35)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cream sections ── */}
      <div style={{ background: '#F5EDDE' }}>

        {/* Categories */}
        <div className="px-14 pt-16 pb-14">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[1.2px] font-bold mb-2">Explorá por rubro</div>
              <h2 className="font-sans font-bold text-[36px] text-ink m-0 tracking-[-0.8px]">Encontrá el profesional que necesitás</h2>
            </div>
            <span onClick={() => router.push('/buscar')} className="font-sans text-[13px] text-terra font-semibold cursor-pointer inline-flex items-center gap-1.5 hover:opacity-75 transition-opacity">
              Ver todos <TshIcon name="arrowR" size={13} color="#E8673A"/>
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3.5">
            {categorias.map(c => (
              <div key={c.id} onClick={() => router.push(`/buscar?categoria=${c.slug}`)}
                className="group flex items-center gap-4 p-5 rounded-[20px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(42,36,32,0.1)]"
                style={{ background: c.tint }}>
                <div className="w-12 h-12 rounded-[13px] bg-white/60 flex items-center justify-center shrink-0">
                  <TshIcon name={c.icono} size={24} color={c.color}/>
                </div>
                <div>
                  <div className="font-sans font-bold text-[15px] leading-[1.1] tracking-[-0.2px]" style={{ color: c.color }}>{c.nombre}</div>
                  <div className="font-sans text-[11px] opacity-55 mt-1" style={{ color: c.color }}>profesionales</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Providers */}
        <div className="px-14 pt-4 pb-16 border-t border-[#EFE5D0]">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[1.2px] font-bold mb-2">Disponibles hoy</div>
              <h2 className="font-sans font-bold text-[36px] text-ink m-0 tracking-[-0.8px]">
                Profesionales en <span className="text-terra">{city}</span>
              </h2>
            </div>
            <button onClick={() => router.push('/buscar')}
              className="px-5 h-10 rounded-xl border border-[#E5D9C2] bg-transparent font-sans text-[13px] font-semibold cursor-pointer hover:border-terra hover:text-terra transition-colors"
              style={{ color: '#5C5048' }}>
              Ver todos →
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {proveedores.slice(0, 4).map(p => (
              <TshProviderCard key={p.id} provider={p} variant="featured" onClick={() => router.push(`/proveedor/${p.id}`)}/>
            ))}
          </div>
        </div>

        {/* How it works — clientes */}
        <div className="px-14 py-16 border-t border-[#EFE5D0]" style={{ background: '#FFFBF3' }}>
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[1.2px] font-bold mb-2">Para clientes</div>
              <h2 className="font-sans font-bold text-[36px] text-ink m-0 tracking-[-0.8px]">Reservá en 3 pasos</h2>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {STEPS_CLIENTE.map((s, i) => (
                <div key={s.n} className="relative">
                  {i < 2 && (
                    <div className="absolute top-[22px] left-[calc(50%+28px)] right-0 h-px" style={{ background: '#EFE5D0' }}/>
                  )}
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-sans font-bold text-[16px] mb-4 mx-auto" style={{ background: '#E8673A', color: 'white' }}>{s.n}</div>
                  <h3 className="font-sans font-bold text-[17px] text-ink text-center mb-2 tracking-[-0.2px]">{s.title}</h3>
                  <p className="font-sans text-[14px] text-[#8B7D6B] text-center leading-[1.6] m-0">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button onClick={() => router.push('/buscar')}
                className="px-7 h-12 rounded-xl border-none font-sans text-[14px] font-bold cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: '#E8673A', color: 'white' }}>
                Buscar un profesional →
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="px-14 py-16 border-t border-[#EFE5D0]">
          <div className="text-center mb-12">
            <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[1.2px] font-bold mb-2">Testimonios</div>
            <h2 className="font-sans font-bold text-[36px] text-ink m-0 tracking-[-0.8px]">Lo que dicen los profesionales</h2>
          </div>
          <div className="grid grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {TESTIMONIOS.map(t => (
              <div key={t.nombre} className="bg-paper border border-[#EFE5D0] rounded-2xl p-6 flex flex-col">
                <Stars n={t.stars}/>
                <p className="font-sans text-[14px] text-ink leading-[1.65] mt-4 mb-5 flex-1">&quot;{t.texto}&quot;</p>
                <div>
                  <div className="font-sans text-[13px] font-semibold text-ink">{t.nombre}</div>
                  <div className="font-sans text-[12px] text-[#8B7D6B] mt-0.5">{t.rol}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── For business ── */}
      <div className="relative overflow-hidden px-14 py-20" style={{ background: '#0F0D0B' }}>
        <div className="absolute -top-[120px] right-[60px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(232,103,58,0.12), transparent 70%)' }}/>
        <div className="absolute -bottom-[80px] left-[300px] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.06), transparent 70%)' }}/>

        <div className="relative flex items-center justify-between gap-16 max-w-[1100px] mx-auto">
          {/* Left */}
          <div className="max-w-[520px]">
            <div className="font-sans text-[11px] text-[#E8673A] uppercase tracking-[1.2px] font-bold mb-5">Para tu negocio</div>
            <h2 className="font-serif font-normal text-[#F5EDDE] leading-[0.98] tracking-[-2px] m-0 mb-6"
              style={{ fontSize: 'clamp(40px, 4vw, 58px)' }}>
              Sumá tu negocio <span className="italic text-[#E8673A]">gratis</span> y llenate de turnos.
            </h2>
            <p className="font-sans text-[16px] leading-[1.6] mb-8 m-0" style={{ color: 'rgba(245,237,222,0.45)' }}>
              Tu agenda online, tus clientes reservando solos, tu tiempo para lo que importa.
            </p>

            {/* Steps negocio */}
            <div className="flex flex-col gap-5 mb-10">
              {STEPS_NEGOCIO.map(s => (
                <div key={s.n} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-[13px] shrink-0 mt-0.5"
                    style={{ background: 'rgba(232,103,58,0.15)', color: '#E8673A', border: '1px solid rgba(232,103,58,0.25)' }}>{s.n}</div>
                  <div>
                    <div className="font-sans font-semibold text-[14px]" style={{ color: '#F5EDDE' }}>{s.title}</div>
                    <div className="font-sans text-[13px] leading-[1.5] mt-0.5" style={{ color: 'rgba(245,237,222,0.4)' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => router.push('/dashboard')}
                className="px-7 h-12 rounded-xl border-none font-sans text-[14px] font-bold cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: '#E8673A', color: 'white' }}>
                Crear mi perfil gratis →
              </button>
              <button onClick={() => router.push('/precios')}
                className="px-6 h-12 rounded-xl font-sans text-[14px] font-semibold cursor-pointer border hover:border-white/25 transition-colors"
                style={{ background: 'transparent', color: 'rgba(245,237,222,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}>
                Ver planes
              </button>
            </div>
          </div>

          {/* Right — dashboard widget */}
          <div className="shrink-0 flex flex-col gap-3 w-[300px]">
            {/* Main card */}
            <div className="rounded-2xl p-5 rotate-[0.8deg] shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Esta semana</div>
              <div className="font-sans font-bold text-[48px] tracking-[-2px] leading-none" style={{ color: '#E8673A' }}>+47</div>
              <div className="font-sans text-[13px] mt-1 mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>turnos nuevos</div>
              <div className="flex gap-[3px] items-end h-[56px] mb-2">
                {[40, 60, 45, 72, 55, 88, 30].map((h, i) => (
                  <div key={i} className="flex-1 rounded-[3px]"
                    style={{ height: `${h}%`, background: i === 5 ? '#E8673A' : 'rgba(255,255,255,0.08)' }}/>
                ))}
              </div>
              <div className="flex justify-between font-sans text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {['L','M','M','J','V','S','D'].map((d, i) => <span key={i}>{d}</span>)}
              </div>
            </div>

            {/* Notification card */}
            <div className="rounded-xl px-4 py-3.5 flex items-center gap-3 -rotate-[0.5deg]"
              style={{ background: '#1E1A15', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(52,211,153,0.15)' }}>
                <span style={{ fontSize: 16 }}>🔔</span>
              </div>
              <div>
                <div className="font-sans text-[12px] font-semibold" style={{ color: '#F5EDDE' }}>Nuevo turno</div>
                <div className="font-sans text-[11px]" style={{ color: 'rgba(245,237,222,0.35)' }}>Lucía R. · Mañana 10:30</div>
              </div>
              <div className="ml-auto font-sans text-[10px]" style={{ color: 'rgba(245,237,222,0.2)' }}>ahora</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pricing teaser ── */}
      <div className="px-14 py-16 border-t" style={{ background: '#F5EDDE', borderColor: '#EFE5D0' }}>
        <div className="max-w-[800px] mx-auto text-center">
          <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[1.2px] font-bold mb-2">Planes</div>
          <h2 className="font-sans font-bold text-[36px] text-ink m-0 tracking-[-0.8px] mb-3">Empezá gratis, crecé cuando quieras</h2>
          <p className="font-sans text-[16px] text-[#8B7D6B] leading-[1.6] mb-10 m-0 max-w-[480px] mx-auto">
            El plan Starter es gratuito para siempre. Cuando necesitás más, el plan Pro tiene todo lo que necesitás para escalar.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-[540px] mx-auto mb-8">
            {[
              { plan: 'Starter', precio: 'Gratis', features: ['Hasta 20 turnos/mes', 'Perfil público', 'Gestión de servicios'] },
              { plan: 'Pro', precio: '$14.900/mes', features: ['Turnos ilimitados', 'Badge verificado ✓', 'Publicidad en redes'] },
            ].map(({ plan, precio, features }) => (
              <div key={plan} onClick={() => router.push('/precios')}
                className="bg-paper border border-[#EFE5D0] rounded-2xl p-5 text-left cursor-pointer hover:border-terra/30 hover:shadow-[0_4px_20px_rgba(42,36,32,0.08)] transition-all">
                <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[0.8px] font-bold mb-1">{plan}</div>
                <div className="font-sans font-bold text-[20px] text-ink tracking-[-0.4px] mb-3">{precio}</div>
                {features.map(f => (
                  <div key={f} className="flex items-center gap-2 mb-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-terra flex items-center justify-center shrink-0">
                      <svg width="7" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span className="font-sans text-[12px] text-ink">{f}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/precios')}
            className="px-7 h-11 rounded-xl border border-[#E5D9C2] bg-transparent font-sans text-[14px] font-semibold cursor-pointer hover:border-terra hover:text-terra transition-colors"
            style={{ color: '#5C5048' }}>
            Ver planes completos →
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ background: '#0F0D0B', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-14 py-12 grid grid-cols-4 gap-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="20" height="26" viewBox="0 0 28 36" fill="none">
                <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
                <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-sans font-bold text-[15px]"><span className="text-[#E8673A]">Servicio</span><span className="text-white">Hoy</span></span>
            </div>
            <p className="font-sans text-[13px] leading-[1.6] m-0" style={{ color: 'rgba(245,237,222,0.3)' }}>
              Conectamos a vecinos con profesionales locales. Hecho en Argentina, para pueblos argentinos.
            </p>
          </div>
          {/* Links */}
          {[
            { title: 'Para clientes', links: ['Buscar servicios', 'Mis turnos', 'Cómo funciona'] },
            { title: 'Para negocios', links: ['Registrar negocio', 'Ver planes', 'Dashboard'] },
            { title: 'TuServicioHoy', links: ['Términos de uso', 'Privacidad', 'Ayuda y soporte'] },
          ].map(col => (
            <div key={col.title}>
              <div className="font-sans text-[11px] uppercase tracking-[0.8px] font-bold mb-4" style={{ color: 'rgba(245,237,222,0.25)' }}>{col.title}</div>
              <div className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <span key={l} className="font-sans text-[13px] cursor-pointer hover:text-[#E8673A] transition-colors" style={{ color: 'rgba(245,237,222,0.45)' }}>{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-14 py-5 flex justify-between items-center font-sans text-[12px]" style={{ color: 'rgba(245,237,222,0.2)' }}>
          <span>© 2026 TuServicioHoy · Todos los derechos reservados</span>
          <span>{city}, Buenos Aires, Argentina</span>
        </div>
      </div>

    </div>
  );
}
