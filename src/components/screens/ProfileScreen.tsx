'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { TshIcon } from '@/components/ui/TshIcon';
import { TshNavBar } from '@/components/ui/TshNavBar';
import { TshAvatar } from '@/components/ui/TshAvatar';
import { TshStars } from '@/components/ui/TshStars';
import { TshPlaceholder } from '@/components/ui/TshPlaceholder';
import { fmtPrice, getNextDays } from '@/lib/utils';
import type { ProveedorCard, DayOption, SlotDisponible } from '@/types';

const TshMap = dynamic(() => import('@/components/ui/TshMap').then(m => ({ default: m.TshMap })), { ssr: false });

interface ReviewData {
  name: string;
  rating: number;
  date: string;
  text: string;
  seed: number;
}

interface ProfileScreenProps {
  proveedor: ProveedorCard;
  reviews: ReviewData[];
  onBook: (slot: string, day: DayOption) => void;
}

/* ─── Slot button ─────────────────────────────────────────────────────── */
function SlotButton({ slot, onBook, day, dark }: { slot: SlotDisponible; onBook: (s: string, d: DayOption) => void; day: DayOption; dark?: boolean }) {
  if (dark) {
    return (
      <button
        disabled={!slot.disponible}
        onClick={() => slot.disponible && onBook(slot.horaInicio, day)}
        className={`px-3.5 py-2 rounded-full font-sans text-[13px] font-semibold border transition-all duration-[140ms] ${
          slot.disponible
            ? 'bg-white/[0.07] border-white/[0.12] text-[#F5EDDE] cursor-pointer hover:border-[#E8673A] hover:text-[#E8673A] hover:bg-[#E8673A]/10'
            : 'bg-transparent border-white/[0.05] text-white/20 line-through cursor-not-allowed'
        }`}
      >
        {slot.horaInicio}
      </button>
    );
  }
  return (
    <button
      disabled={!slot.disponible}
      onClick={() => slot.disponible && onBook(slot.horaInicio, day)}
      className={`px-3.5 py-2 rounded-full font-sans text-[13px] font-semibold border transition-all duration-[140ms] ${
        slot.disponible
          ? 'bg-[#FFFBF3] border-[#E5D9C2] text-[#1A1208] cursor-pointer hover:border-[#E8673A] hover:text-[#E8673A] hover:bg-[#FFF5F0]'
          : 'bg-[#F5EDDE] border-[#EFE5D0] text-[#C9BDA5] line-through cursor-not-allowed'
      }`}
    >
      {slot.horaInicio}
    </button>
  );
}

/* ─── Availability strip ──────────────────────────────────────────────── */
function AvailabilityStrip({ proveedorId, onBook, dark }: { proveedorId: string; onBook: (slot: string, day: DayOption) => void; dark?: boolean }) {
  const days = getNextDays(7);
  const [selectedDay, setSelectedDay] = useState(0);
  const [slots, setSlots] = useState<SlotDisponible[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadSlots(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSlots = async (idx: number) => {
    setSelectedDay(idx);
    setLoading(true);
    const d = days[idx];
    if (!d) return;
    try {
      const res = await fetch(`/api/turnos/disponibilidad?proveedorId=${proveedorId}&fecha=${d.date.toISOString().split('T')[0]}`);
      const data = await res.json() as SlotDisponible[];
      setSlots(data);
    } catch { setSlots([]); }
    finally { setLoading(false); }
  };

  const morning = slots.filter(s => parseInt(s.horaInicio.split(':')[0] ?? '0') < 13);
  const afternoon = slots.filter(s => parseInt(s.horaInicio.split(':')[0] ?? '0') >= 13);

  const dayBtnActive = dark
    ? 'bg-[#E8673A] border-[#E8673A] text-white'
    : 'bg-[#1A1208] border-[#1A1208] text-[#F5EDDE]';
  const dayBtnIdle = dark
    ? 'bg-white/[0.05] border-white/[0.1] text-[#F5EDDE]/60 hover:border-white/25'
    : 'bg-[#FFFBF3] border-[#E5D9C2] text-[#1A1208] hover:border-[#E8673A]';
  const emptyBg = dark ? 'bg-white/[0.04] border-white/[0.06] text-white/30' : 'bg-[#FAF4E8] border-[#EFE5D0] text-[#8B7D6B]';
  const sectionLabel = dark ? 'text-white/30' : 'text-[#8B7D6B]';

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1.5 mb-4 hide-scrollbar">
        {days.map((d, i) => (
          <button
            key={d.key}
            onClick={() => loadSlots(i)}
            className={`shrink-0 w-[52px] py-2.5 px-1 rounded-2xl text-center cursor-pointer border transition-all duration-[160ms] ${i === selectedDay ? dayBtnActive : dayBtnIdle}`}
          >
            <div className="font-sans text-[9px] uppercase tracking-[0.8px] font-bold opacity-60">
              {d.isToday ? 'hoy' : d.isTomorrow ? 'mañ' : d.dayName}
            </div>
            <div className="font-sans font-bold text-[20px] leading-[1.15] mt-0.5 tabular-nums">{d.dayNum}</div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className={`py-5 text-center font-sans text-[13px] ${dark ? 'text-white/30' : 'text-[#8B7D6B]'}`}>Cargando horarios…</div>
      ) : slots.length === 0 ? (
        <div className={`py-5 rounded-2xl border text-center font-sans text-[13px] ${emptyBg}`}>Sin disponibilidad este día</div>
      ) : (
        <div className="flex flex-col gap-4">
          {morning.length > 0 && (
            <div>
              <div className={`font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-2 ${sectionLabel}`}>Mañana</div>
              <div className="flex flex-wrap gap-1.5">
                {morning.map(s => <SlotButton key={s.horaInicio} slot={s} onBook={onBook} day={days[selectedDay]!} dark={dark}/>)}
              </div>
            </div>
          )}
          {afternoon.length > 0 && (
            <div>
              <div className={`font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-2 ${sectionLabel}`}>Tarde</div>
              <div className="flex flex-wrap gap-1.5">
                {afternoon.map(s => <SlotButton key={s.horaInicio} slot={s} onBook={onBook} day={days[selectedDay]!} dark={dark}/>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── MOBILE ──────────────────────────────────────────────────────────── */
export function ProfileScreenMobile({ proveedor: p, reviews, onBook }: ProfileScreenProps) {
  const router = useRouter();

  return (
    <div className="min-h-full pb-[96px]" style={{ background: '#F5EDDE' }}>

      {/* Dark identity header */}
      <div style={{ background: '#140E08' }}>
        {/* Top bar */}
        <div className="flex justify-between items-center px-4 pt-12 pb-4">
          <button
            onClick={() => router.push('/buscar')}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-none"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <TshIcon name="chevronL" size={17} color="rgba(245,237,222,0.8)"/>
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-none" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <TshIcon name="share" size={15} color="rgba(245,237,222,0.7)"/>
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-none" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <TshIcon name="heart" size={15} color="rgba(245,237,222,0.7)"/>
            </button>
          </div>
        </div>

        {/* Cover strip */}
        <div className="relative h-[130px] mx-4 rounded-2xl overflow-hidden mb-4">
          <TshPlaceholder label={p.categoria.slug} seed={p.coverSeed} rounded={0} style={{ width: '100%', height: '100%' }}/>
          <div className="absolute inset-0" style={{ background: 'rgba(20,14,8,0.35)' }}/>
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: p.categoria.color }}/>
        </div>

        {/* Identity */}
        <div className="px-4 pb-6">
          <div className="flex gap-3 items-start mb-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0" style={{ border: `2px solid ${p.categoria.color}` }}>
              <TshAvatar name={p.person} seed={p.avatarSeed} size={56}/>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex gap-1.5 items-center mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full font-sans text-[10px] font-bold" style={{ color: p.categoria.color, background: `${p.categoria.color}22` }}>
                  {p.categoria.nombre}
                </span>
                {p.availableToday && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold" style={{ background: 'rgba(52,211,153,0.12)', color: '#34D399' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"/>
                    Disponible hoy
                  </span>
                )}
              </div>
              <h1 className="font-sans font-bold text-[22px] text-[#F5EDDE] m-0 tracking-[-0.4px] leading-[1.1] flex items-center gap-2">
                {p.nombre}
                {p.isPro && (
                  <span title="Profesional verificado" className="shrink-0 w-[20px] h-[20px] rounded-full flex items-center justify-center" style={{ background: '#E8673A' }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                )}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <TshStars rating={p.rating} reviews={p.reviews} size={12}/>
            <span className="font-sans text-[12px] inline-flex items-center gap-1" style={{ color: 'rgba(245,237,222,0.45)' }}>
              <TshIcon name="pin" size={11} color="rgba(245,237,222,0.35)"/>
              {p.neighborhood} · {p.distanceKm} km
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 flex flex-col gap-6">

        {/* Description */}
        <p className="font-sans text-[14px] leading-[1.7] m-0" style={{ color: '#5C5048' }}>{p.description}</p>

        {/* Services */}
        <div>
          <div className="font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-2.5" style={{ color: '#8B7D6B' }}>Servicios</div>
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full font-sans text-[12px] font-medium border" style={{ background: '#FFFBF3', borderColor: '#E5D9C2', color: '#1A1208' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl border divide-y overflow-hidden" style={{ background: '#FFFBF3', borderColor: '#EFE5D0' }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <TshIcon name="clock" size={14} color="#8B7D6B"/>
            <span className="font-sans text-[13px]" style={{ color: '#5C5048' }}>{p.hours}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <TshIcon name="sparkle" size={14} color="#8B7D6B"/>
            <span className="font-sans text-[13px]" style={{ color: '#5C5048' }}>En la plataforma desde {p.since}</span>
          </div>
        </div>

        {/* Availability */}
        <div>
          <div className="font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-3" style={{ color: '#8B7D6B' }}>Elegí tu turno</div>
          <AvailabilityStrip proveedorId={p.id} onBook={onBook}/>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="font-sans text-[10px] uppercase tracking-[0.8px] font-bold" style={{ color: '#8B7D6B' }}>Reseñas ({p.reviews})</div>
              <span className="font-sans text-[12px] font-semibold cursor-pointer" style={{ color: '#E8673A' }}>Ver todas</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {reviews.map((r, i) => (
                <div key={i} className="rounded-2xl border p-4" style={{ background: '#FFFBF3', borderColor: '#EFE5D0' }}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <TshAvatar name={r.name} seed={r.seed} size={28}/>
                      <span className="font-sans text-[13px] font-semibold" style={{ color: '#1A1208' }}>{r.name}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TshIcon key={j} name={j < r.rating ? 'star' : 'starLine'} size={11} color="#E8673A"/>
                      ))}
                    </div>
                  </div>
                  <p className="font-sans text-[13px] leading-[1.55] m-0" style={{ color: '#5C5048' }}>{r.text}</p>
                  <div className="font-sans text-[11px] mt-1.5" style={{ color: '#8B7D6B' }}>{r.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      {p.lat && p.lng && (
        <div className="px-4 pb-6">
          <div className="font-sans text-[13px] font-bold mb-2" style={{ color: '#1A1208' }}>Ubicación</div>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#E5D9C2', height: 200 }}>
            <TshMap
              pins={[{ id: p.id, nombre: p.nombre, lat: p.lat, lng: p.lng }]}
              height="100%"
              singlePin
              zoom={15}
              scrollWheel={false}
            />
          </div>
        </div>
      )}

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-8 pt-4" style={{ background: 'linear-gradient(to bottom, rgba(245,237,222,0) 0%, #F5EDDE 35%)' }}>
        <div className="flex items-center gap-3">
          <div>
            <div className="font-sans text-[10px] uppercase tracking-[0.6px] font-bold" style={{ color: '#8B7D6B' }}>Desde</div>
            <div className="font-sans font-bold text-[22px] tracking-[-0.5px] tabular-nums" style={{ color: '#1A1208' }}>{fmtPrice(p.priceFrom)}</div>
          </div>
          <button
            onClick={() => router.push(`/reservar/${p.id}`)}
            className="flex-1 h-12 rounded-xl border-none font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: '#E8673A', color: 'white', boxShadow: '0 4px 20px rgba(232,103,58,0.4)' }}
          >
            Reservar turno
            <TshIcon name="arrowR" size={16} color="white"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── DESKTOP ─────────────────────────────────────────────────────────── */
export function ProfileScreenDesktop({ proveedor: p, reviews, onBook }: ProfileScreenProps) {
  const router = useRouter();

  return (
    <div className="min-h-full" style={{ background: '#F5EDDE' }}>

      {/* Dark identity header */}
      <div style={{ background: '#140E08' }}>
        <TshNavBar city={p.neighborhood} variant="desktop" darkBg/>

        {/* Breadcrumb */}
        <div className="px-14 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => router.push('/')} className="font-sans text-[12px] bg-transparent border-none cursor-pointer p-0 transition-colors hover:opacity-100" style={{ color: 'rgba(245,237,222,0.3)' }}>Inicio</button>
          <TshIcon name="chevronR" size={10} color="rgba(245,237,222,0.2)"/>
          <button onClick={() => router.push('/buscar')} className="font-sans text-[12px] bg-transparent border-none cursor-pointer p-0 transition-colors hover:opacity-100" style={{ color: 'rgba(245,237,222,0.3)' }}>{p.categoria.nombre}</button>
          <TshIcon name="chevronR" size={10} color="rgba(245,237,222,0.2)"/>
          <span className="font-sans text-[12px] font-medium" style={{ color: 'rgba(245,237,222,0.6)' }}>{p.nombre}</span>
        </div>

        {/* Identity section */}
        <div className="px-14 pt-8 pb-10 grid grid-cols-[1fr_400px] gap-10 max-w-[1280px] mx-auto">

          {/* Left: provider identity */}
          <div className="flex gap-6 items-start">
            {/* Cover thumbnail + avatar stacked */}
            <div className="shrink-0 relative">
              <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden" style={{ border: `2px solid ${p.categoria.color}` }}>
                <TshAvatar name={p.person} seed={p.avatarSeed} size={100}/>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex gap-2 items-center mb-3 flex-wrap">
                <span className="px-3 py-1 rounded-full font-sans text-[11px] font-bold" style={{ color: p.categoria.color, background: `${p.categoria.color}22` }}>
                  {p.categoria.nombre}
                </span>
                {p.availableToday && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-[11px] font-semibold" style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"/>
                    Disponible hoy
                  </span>
                )}
              </div>

              <h1 className="font-sans font-bold text-[46px] m-0 tracking-[-1px] leading-none mb-4 flex items-center gap-3" style={{ color: '#F5EDDE' }}>
                {p.nombre}
                {p.isPro && (
                  <span title="Profesional verificado" className="shrink-0 w-[28px] h-[28px] rounded-full flex items-center justify-center" style={{ background: '#E8673A' }}>
                    <svg width="13" height="10" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                )}
              </h1>

              <div className="flex items-center gap-5 flex-wrap">
                {/* Big rating */}
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-[28px] tabular-nums tracking-[-0.5px]" style={{ color: '#F5EDDE' }}>{p.rating.toFixed(1)}</span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <TshIcon key={i} name={i < Math.round(p.rating) ? 'star' : 'starLine'} size={13} color="#E8673A"/>
                      ))}
                    </div>
                    <span className="font-sans text-[11px]" style={{ color: 'rgba(245,237,222,0.35)' }}>{p.reviews} reseñas</span>
                  </div>
                </div>

                <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }}/>

                <span className="font-sans text-[13px] inline-flex items-center gap-1.5" style={{ color: 'rgba(245,237,222,0.45)' }}>
                  <TshIcon name="pin" size={13} color="rgba(245,237,222,0.3)"/>
                  {p.neighborhood} · {p.distanceKm} km
                </span>

                <span className="font-sans text-[13px] inline-flex items-center gap-1.5" style={{ color: 'rgba(245,237,222,0.45)' }}>
                  <TshIcon name="clock" size={13} color="rgba(245,237,222,0.3)"/>
                  {p.hours}
                </span>

                <span className="font-sans text-[13px] inline-flex items-center gap-1.5" style={{ color: 'rgba(245,237,222,0.45)' }}>
                  <TshIcon name="sparkle" size={13} color="rgba(245,237,222,0.3)"/>
                  {new Date().getFullYear() - p.since} años en la plataforma
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 shrink-0">
              <button className="w-10 h-10 rounded-full border-none flex items-center justify-center cursor-pointer transition-colors" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <TshIcon name="share" size={15} color="rgba(245,237,222,0.6)"/>
              </button>
              <button className="w-10 h-10 rounded-full border-none flex items-center justify-center cursor-pointer transition-colors" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <TshIcon name="heart" size={15} color="rgba(245,237,222,0.6)"/>
              </button>
            </div>
          </div>

          {/* Right: booking card — overlaps into cream section */}
          <div className="relative">
            <div
              className="absolute top-0 left-0 right-0 rounded-[22px] overflow-hidden z-10"
              style={{
                background: '#FFFBF3',
                border: '1px solid #EFE5D0',
                boxShadow: '0 20px 60px rgba(26,18,8,0.25)',
                top: '-16px',
              }}
            >
              {/* Price + CTA */}
              <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid #EFE5D0' }}>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="font-sans text-[10px] uppercase tracking-[0.7px] font-bold mb-0.5" style={{ color: '#8B7D6B' }}>Precio desde</div>
                    <div className="font-sans font-bold text-[36px] tracking-[-1px] tabular-nums leading-none" style={{ color: '#1A1208' }}>{fmtPrice(p.priceFrom)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-sans font-bold text-[22px] tabular-nums" style={{ color: '#1A1208' }}>{p.rating.toFixed(1)}</div>
                    <TshStars rating={p.rating} reviews={p.reviews} size={11}/>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/reservar/${p.id}`)}
                  className="w-full h-12 rounded-xl border-none font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ background: '#E8673A', color: 'white', boxShadow: '0 4px 20px rgba(232,103,58,0.3)' }}
                >
                  Reservar turno
                  <TshIcon name="arrowR" size={16} color="white"/>
                </button>
                <div className="font-sans text-[11px] text-center mt-2" style={{ color: '#8B7D6B' }}>Cancelá sin cargo hasta 2h antes</div>
              </div>

              {/* Next slot */}
              <div className="px-6 py-4" style={{ borderBottom: '1px solid #EFE5D0' }}>
                <div className="font-sans text-[10px] uppercase tracking-[0.7px] font-bold mb-2.5" style={{ color: '#8B7D6B' }}>Próximo disponible</div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#E3EFE8', border: '1px solid #C5DCC9' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#0F6E4E' }}>
                    <TshIcon name="clock" size={14} color="#FFFBF3"/>
                  </div>
                  <div>
                    <div className="font-sans font-bold text-[15px] tracking-[-0.2px]" style={{ color: '#0F6E4E' }}>{p.nextSlot}</div>
                    <div className="font-sans text-[11px] opacity-60" style={{ color: '#0F6E4E' }}>Disponible para reservar</div>
                  </div>
                </div>
              </div>

              {/* Availability picker */}
              <div className="px-6 py-4" style={{ borderBottom: '1px solid #EFE5D0' }}>
                <div className="font-sans text-[10px] uppercase tracking-[0.7px] font-bold mb-3" style={{ color: '#8B7D6B' }}>Elegí un día y horario</div>
                <AvailabilityStrip proveedorId={p.id} onBook={onBook}/>
              </div>

              {/* Details */}
              <div className="px-6 py-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <TshIcon name="clock" size={13} color="#8B7D6B"/>
                  <span className="font-sans text-[13px]" style={{ color: '#5C5048' }}>{p.hours}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <TshIcon name="pin" size={13} color="#8B7D6B"/>
                  <span className="font-sans text-[13px]" style={{ color: '#5C5048' }}>{p.neighborhood}</span>
                </div>
                {p.whatsapp && (
                  <a
                    href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 no-underline transition-opacity hover:opacity-75"
                    style={{ color: '#0F6E4E' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="font-sans text-[13px] font-medium">Consultar por WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cream content */}
      <div className="max-w-[1280px] mx-auto px-14 pb-16" style={{ paddingTop: '420px' }}>
        <div className="max-w-[700px]">

          {/* About */}
          <div style={{ borderTop: '1px solid #EFE5D0', paddingTop: 32, paddingBottom: 32 }}>
            <h2 className="font-sans font-bold text-[20px] m-0 mb-3 tracking-[-0.3px]" style={{ color: '#1A1208' }}>
              Sobre {p.person.split(' ')[0]}
            </h2>
            <p className="font-sans text-[15px] leading-[1.7] m-0" style={{ color: '#5C5048' }}>{p.description}</p>
          </div>

          {/* Services */}
          <div style={{ borderTop: '1px solid #EFE5D0', paddingTop: 32, paddingBottom: 32 }}>
            <h2 className="font-sans font-bold text-[20px] m-0 mb-4 tracking-[-0.3px]" style={{ color: '#1A1208' }}>Servicios</h2>
            <div className="flex flex-wrap gap-2">
              {p.tags.map(t => (
                <span key={t} className="px-4 py-2 rounded-full font-sans text-[13px] font-medium border transition-colors" style={{ background: '#FFFBF3', borderColor: '#E5D9C2', color: '#1A1208' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div style={{ borderTop: '1px solid #EFE5D0', paddingTop: 32, paddingBottom: 32 }}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-sans font-bold text-[48px] tracking-[-1.5px] tabular-nums leading-none" style={{ color: '#1A1208' }}>{p.rating.toFixed(1)}</span>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <TshIcon key={i} name={i < Math.round(p.rating) ? 'star' : 'starLine'} size={16} color="#E8673A"/>
                      ))}
                    </div>
                    <div className="font-sans text-[13px]" style={{ color: '#8B7D6B' }}>{p.reviews} reseñas</div>
                  </div>
                </div>
                <button className="font-sans text-[13px] font-semibold bg-transparent border-none cursor-pointer p-0" style={{ color: '#E8673A' }}>Ver todas</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {reviews.map((r, i) => (
                  <div key={i} className="rounded-2xl border p-5" style={{ background: '#FFFBF3', borderColor: '#EFE5D0' }}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <TshAvatar name={r.name} seed={r.seed + 2} size={34}/>
                        <div>
                          <div className="font-sans text-[13px] font-semibold" style={{ color: '#1A1208' }}>{r.name}</div>
                          <div className="font-sans text-[11px]" style={{ color: '#8B7D6B' }}>{r.date}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <TshIcon key={j} name={j < r.rating ? 'star' : 'starLine'} size={12} color="#E8673A"/>
                        ))}
                      </div>
                    </div>
                    <p className="font-sans text-[13px] leading-[1.6] m-0" style={{ color: '#5C5048' }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {p.lat && p.lng && (
            <div style={{ borderTop: '1px solid #EFE5D0', paddingTop: 32, paddingBottom: 32 }}>
              <h2 className="font-sans font-bold text-[20px] m-0 mb-4 tracking-[-0.3px]" style={{ color: '#1A1208' }}>Ubicación</h2>
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#EFE5D0', height: 280 }}>
                <TshMap
                  pins={[{ id: p.id, nombre: p.nombre, lat: p.lat, lng: p.lng }]}
                  height="100%"
                  singlePin
                  zoom={15}
                  scrollWheel={false}
                />
              </div>
              {p.neighborhood && (
                <p className="font-sans text-[13px] mt-2 m-0 flex items-center gap-1.5" style={{ color: '#8B7D6B' }}>
                  <TshIcon name="pin" size={12} color="#8B7D6B"/>
                  {p.neighborhood}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
