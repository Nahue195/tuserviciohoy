'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TshIcon } from '@/components/ui/TshIcon';
import { TshAvatar } from '@/components/ui/TshAvatar';
import { TshStars } from '@/components/ui/TshStars';
import { fmtPrice, getNextDays, generateConfirmCode } from '@/lib/utils';
import type { ProveedorCard, DayOption, BookingService } from '@/types';

interface SlotDisponible { horaInicio: string; horaFin: string; disponible: boolean; }

interface BookingFlowProps {
  proveedor: ProveedorCard;
  initialSlot?: string;
  initialDay?: DayOption;
  onClose?: () => void;
  variant?: 'sheet' | 'page';
}

/* ─── Slot grid ───────────────────────────────────────────────────────── */
function SlotGrid({ proveedorId, day, selectedSlot, onSelect }: {
  proveedorId: string; day: DayOption; selectedSlot: string; onSelect: (s: string) => void;
}) {
  const [slots, setSlots] = useState<SlotDisponible[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/turnos/disponibilidad?proveedorId=${proveedorId}&fecha=${day.date.toISOString().split('T')[0]}`)
      .then(r => r.json())
      .then((d: SlotDisponible[]) => { setSlots(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [proveedorId, day.key]);

  if (loading) return <div className="font-sans text-[13px] py-3" style={{ color: '#8B7D6B' }}>Cargando horarios…</div>;
  if (slots.length === 0) return <div className="font-sans text-[13px] py-4 text-center rounded-xl border" style={{ color: '#8B7D6B', background: '#FAF4E8', borderColor: '#EFE5D0' }}>Sin disponibilidad este día</div>;

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map(s => {
        const active = s.horaInicio === selectedSlot;
        return (
          <button
            key={s.horaInicio}
            disabled={!s.disponible}
            onClick={() => s.disponible && onSelect(s.horaInicio)}
            className={`px-4 py-2.5 rounded-full font-sans text-[13px] font-semibold border transition-all duration-[120ms] ${
              !s.disponible ? 'border-[#EFE5D0] text-[#C9BDA5] line-through cursor-not-allowed' :
              active ? 'cursor-pointer' : 'border-[#E5D9C2] text-[#1A1208] cursor-pointer hover:border-[#E8673A] hover:text-[#E8673A]'
            }`}
            style={{ background: active ? '#E8673A' : '#FFFBF3', borderColor: active ? '#E8673A' : undefined, color: active ? 'white' : undefined }}
          >
            {s.horaInicio}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Section label ───────────────────────────────────────────────────── */
function SLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-2.5" style={{ color: '#8B7D6B' }}>{children}</div>;
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────── */
export function BookingFlow({ proveedor: p, initialSlot, initialDay, onClose, variant = 'page' }: BookingFlowProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionUser = session?.user as { name?: string } | undefined;
  const days = getNextDays(14);

  const [step, setStep] = useState(1);
  const [slot, setSlot] = useState(initialSlot ?? '');
  const [day, setDay] = useState<DayOption>(initialDay ?? days[0]!);
  const [selectedService, setSelectedService] = useState(0);
  const [name, setName] = useState(sessionUser?.name ?? '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [services, setServices] = useState<BookingService[]>([
    { name: p.tags[0] ?? 'Consulta', dur: 30, price: p.priceFrom },
  ]);

  const loadServices = useCallback(async () => {
    try {
      const res = await fetch(`/api/servicios?proveedorId=${p.id}`);
      if (res.ok) {
        const data = await res.json() as Array<{ nombre: string; duracion: number; precio: number }>;
        if (data.length > 0) {
          setServices(data.map(s => ({ name: s.nombre, dur: s.duracion, price: s.precio })));
        }
      }
    } catch { /* keep defaults */ }
  }, [p.id]);

  useEffect(() => { void loadServices(); }, [loadServices]);

  const svc = services[selectedService] ?? services[0]!;

  const handleConfirm = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proveedorId: p.id,
          fecha: day.date.toISOString().split('T')[0],
          horaInicio: slot,
          servicio: svc.name,
          precio: svc.price,
          notas: notes,
          clienteNombre: name,
          clienteTelefono: phone,
          clienteEmail: isGuest ? email : undefined,
        }),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error ?? 'Error'); }
      const d = await res.json() as { codigo?: string };
      setConfirmCode(d.codigo ?? generateConfirmCode());
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally { setLoading(false); }
  };

  const isGuest = !session;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canContinue = step === 1 ? !!slot : step === 2 ? (!!name.trim() && (!isGuest || emailValid)) : true;
  const stepTitles = ['Elegí fecha y hora', 'Tus datos', 'Revisá y confirmá'];
  const ctaLabel = loading ? 'Confirmando…' : step === 3 ? 'Confirmar turno' : 'Continuar';

  /* ── SHEET (legacy mobile bottom-sheet) ── */
  if (variant === 'sheet') {
    return (
      <div className="flex flex-col h-full overflow-hidden" style={{ background: '#FFFBF3' }}>
        <div className="px-5 pt-4 pb-3.5 border-b" style={{ borderColor: '#EFE5D0' }}>
          <div className="w-9 h-1 rounded-full mx-auto mb-3" style={{ background: '#EADFC5' }}/>
          <div className="flex items-center gap-2">
            {step > 1 && step < 4 && (
              <button onClick={() => setStep(s => s - 1)} className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center -ml-1">
                <TshIcon name="chevronL" size={16} color="#2A2420"/>
              </button>
            )}
            <div className="flex-1">
              <div className="font-sans text-[11px] uppercase tracking-[0.6px] font-bold" style={{ color: '#8B7D6B' }}>
                {step === 4 ? 'Confirmado' : `Paso ${step} de 3`}
              </div>
              <div className="font-sans font-bold text-[18px] tracking-[-0.3px]" style={{ color: '#1A1208' }}>
                {step === 4 ? `¡Listo, ${name.split(' ')[0]}!` : stepTitles[step - 1]}
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="w-8 h-8 rounded-full border-none cursor-pointer flex items-center justify-center" style={{ background: '#FAF4E8' }}>
                <TshIcon name="close" size={14} color="#2A2420"/>
              </button>
            )}
          </div>
          {step < 4 && (
            <div className="flex gap-1.5 mt-3">
              {[1,2,3].map(n => <div key={n} className="flex-1 h-[3px] rounded-full" style={{ background: n <= step ? '#E8673A' : '#EADFC5' }}/>)}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto px-5 py-4">
          <StepContent step={step} p={p} days={days} day={day} setDay={setDay} slot={slot} setSlot={setSlot} services={services} selectedService={selectedService} setSelectedService={setSelectedService} name={name} setName={setName} email={email} setEmail={setEmail} isGuest={isGuest} phone={phone} setPhone={setPhone} notes={notes} setNotes={setNotes} confirmCode={confirmCode} error={error} svc={svc} router={router}/>
        </div>
        {step < 4 && (
          <div className="px-5 pt-3.5 pb-7 border-t flex gap-3 items-center" style={{ borderColor: '#EFE5D0', background: '#FFFBF3' }}>
            <div className="shrink-0">
              <div className="font-sans text-[10px] uppercase tracking-[0.5px] font-bold" style={{ color: '#8B7D6B' }}>Total</div>
              <div className="font-sans text-[18px] font-bold tabular-nums" style={{ color: '#1A1208' }}>{fmtPrice(svc.price)}</div>
            </div>
            <button
              onClick={() => step === 3 ? handleConfirm() : setStep(s => s + 1)}
              disabled={loading || !canContinue}
              className="flex-1 h-12 rounded-xl border-none font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: '#E8673A', color: 'white' }}
            >
              {ctaLabel}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── PAGE VARIANT — fully responsive ── */
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#140E08' }}>

      {/* ── Top nav ── */}
      <div className="flex items-center gap-3 px-4 md:px-8 py-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {/* Back */}
        <button
          onClick={() => router.push(`/proveedor/${p.id}`)}
          className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer hover:opacity-75 transition-opacity shrink-0"
          style={{ color: 'rgba(245,237,222,0.45)' }}
        >
          <TshIcon name="chevronL" size={16} color="rgba(245,237,222,0.45)"/>
          <span className="font-sans text-[13px] hidden sm:block">Volver</span>
        </button>

        {/* Logo — centered */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <svg width="18" height="23" viewBox="0 0 28 36" fill="none">
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
            <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-sans font-bold text-[14px]">
            <span style={{ color: '#E8673A' }}>Servicio</span><span style={{ color: '#F5EDDE' }}>Hoy</span>
          </span>
        </div>

        {/* Step progress */}
        {step < 4 && (
          <div className="shrink-0">
            {/* Mobile: progress bar */}
            <div className="flex gap-1 md:hidden">
              {[1,2,3].map(n => (
                <div key={n} className="w-6 h-1 rounded-full transition-all" style={{ background: n <= step ? '#E8673A' : 'rgba(255,255,255,0.1)' }}/>
              ))}
            </div>
            {/* Desktop: numbered circles */}
            <div className="hidden md:flex items-center gap-2">
              {[1, 2, 3].map(n => (
                <div key={n} className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-sans text-[11px] font-bold transition-all"
                    style={{ background: n < step ? '#E8673A' : n === step ? 'rgba(232,103,58,0.15)' : 'rgba(255,255,255,0.05)', color: n <= step ? '#E8673A' : 'rgba(255,255,255,0.2)', border: `1.5px solid ${n <= step ? '#E8673A' : 'rgba(255,255,255,0.08)'}` }}
                  >
                    {n < step ? '✓' : n}
                  </div>
                  {n < 3 && <div className="w-5 h-px" style={{ background: n < step ? '#E8673A' : 'rgba(255,255,255,0.08)' }}/>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">

        {/* Left panel — desktop only */}
        <div className="hidden md:flex w-[320px] lg:w-[360px] shrink-0 flex-col" style={{ background: '#140E08', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="p-8 flex-1 overflow-auto">
            {/* Provider */}
            <div className="flex gap-3 items-center mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0" style={{ border: `1.5px solid ${p.categoria.color}` }}>
                <TshAvatar name={p.person} seed={p.avatarSeed} size={44}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-sans font-bold text-[14px] truncate" style={{ color: '#F5EDDE' }}>{p.nombre}</div>
                <div className="font-sans text-[12px] mt-0.5" style={{ color: 'rgba(245,237,222,0.35)' }}>{p.categoria.nombre} · {p.neighborhood}</div>
              </div>
              <TshStars rating={p.rating} reviews={p.reviews} size={10}/>
            </div>

            <div className="font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-4" style={{ color: 'rgba(245,237,222,0.25)' }}>Tu reserva</div>

            <div className="flex flex-col gap-4">
              {[
                { icon: 'sparkle', color: p.categoria.color, label: 'Servicio', value: svc.name, sub: `${svc.dur} min · ${fmtPrice(svc.price)}`, show: true },
                { icon: 'calendar', color: '#E8673A', label: 'Fecha y hora', value: slot ? `${day.isToday ? 'Hoy' : day.isTomorrow ? 'Mañana' : `${day.dayName} ${day.dayNum}`}` : 'Pendiente', sub: slot ? `${slot} hs` : '', show: true },
                { icon: 'user', color: '#34D399', label: 'A nombre de', value: name.trim() || 'Pendiente', sub: '', show: step >= 2 },
              ].map(({ icon, color, label, value, sub, show }) => (
                <div key={label} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: show && value !== 'Pendiente' ? `${color}22` : 'rgba(255,255,255,0.04)' }}>
                    <TshIcon name={icon as 'sparkle'} size={14} color={show && value !== 'Pendiente' ? color : 'rgba(255,255,255,0.15)'}/>
                  </div>
                  <div>
                    <div className="font-sans text-[10px] uppercase tracking-[0.5px] font-bold mb-0.5" style={{ color: 'rgba(245,237,222,0.25)' }}>{label}</div>
                    <div className="font-sans text-[13px] font-semibold" style={{ color: value !== 'Pendiente' ? '#F5EDDE' : 'rgba(245,237,222,0.2)' }}>{value}</div>
                    {sub && <div className="font-sans text-[11px]" style={{ color: 'rgba(245,237,222,0.3)' }}>{sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {step > 1 && (
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-sans text-[10px] uppercase tracking-[0.6px] font-bold mb-0.5" style={{ color: 'rgba(245,237,222,0.25)' }}>Total</div>
                    <div className="font-sans font-bold text-[28px] tracking-[-0.6px] tabular-nums" style={{ color: '#F5EDDE' }}>{fmtPrice(svc.price)}</div>
                  </div>
                  <div className="font-sans text-[11px] text-right" style={{ color: 'rgba(245,237,222,0.25)' }}>Se paga<br/>en el local</div>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 pb-8 flex flex-col gap-2">
            {['Sin cargo por reservar', 'Cancelá gratis hasta 2h antes'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <TshIcon name="check" size={11} color="rgba(52,211,153,0.5)"/>
                <span className="font-sans text-[12px]" style={{ color: 'rgba(245,237,222,0.25)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right / main panel */}
        <div className="flex-1 min-w-0 w-full flex flex-col overflow-x-hidden" style={{ background: '#F5EDDE' }}>

          {step < 4 ? (
            <>
              {/* Mobile provider strip */}
              <div className="flex md:hidden items-center gap-3 px-4 py-3 border-b" style={{ background: '#FFFBF3', borderColor: '#EFE5D0' }}>
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0" style={{ border: `1.5px solid ${p.categoria.color}` }}>
                  <TshAvatar name={p.person} seed={p.avatarSeed} size={36}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans font-bold text-[13px] truncate" style={{ color: '#1A1208' }}>{p.nombre}</div>
                  <div className="font-sans text-[11px]" style={{ color: '#8B7D6B' }}>{p.categoria.nombre} · {p.neighborhood}</div>
                </div>
                <TshStars rating={p.rating} reviews={p.reviews} size={10}/>
              </div>

              {/* Step header */}
              <div className="px-4 md:px-10 pt-6 pb-5 border-b shrink-0" style={{ borderColor: '#EFE5D0' }}>
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer p-0 mb-3 hover:opacity-70 transition-opacity" style={{ color: '#8B7D6B' }}>
                    <TshIcon name="chevronL" size={13} color="#8B7D6B"/>
                    <span className="font-sans text-[13px]">Atrás</span>
                  </button>
                )}
                <div className="font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-1" style={{ color: '#8B7D6B' }}>Paso {step} de 3</div>
                <div className="font-sans font-bold text-[22px] md:text-[28px] tracking-[-0.5px]" style={{ color: '#1A1208' }}>{stepTitles[step - 1]}</div>
              </div>

              {/* Step content — scrollable */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-10 py-6 pb-24 md:pb-8">
                <div className="w-full max-w-[520px]">
                  <StepContent step={step} p={p} days={days} day={day} setDay={setDay} slot={slot} setSlot={setSlot} services={services} selectedService={selectedService} setSelectedService={setSelectedService} name={name} setName={setName} email={email} setEmail={setEmail} isGuest={isGuest} phone={phone} setPhone={setPhone} notes={notes} setNotes={setNotes} confirmCode={confirmCode} error={error} svc={svc} router={router}/>
                </div>
              </div>

              {/* Bottom CTA — fixed on mobile, static on desktop */}
              <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto px-4 md:px-10 py-4 md:py-5 border-t shrink-0" style={{ borderColor: '#EFE5D0', background: '#FFFBF3' }}>
                <div className="flex items-center justify-between gap-4 max-w-[520px]">
                  <div className="shrink-0">
                    <div className="font-sans text-[10px] uppercase tracking-[0.6px] font-bold" style={{ color: '#8B7D6B' }}>Total</div>
                    <div className="font-sans font-bold text-[20px] md:text-[24px] tracking-[-0.5px] tabular-nums" style={{ color: '#1A1208' }}>{fmtPrice(svc.price)}</div>
                  </div>
                  <button
                    onClick={() => step === 3 ? handleConfirm() : setStep(s => s + 1)}
                    disabled={loading || !canContinue}
                    className="flex-1 h-12 rounded-xl border-none font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: '#E8673A', color: 'white', boxShadow: '0 4px 16px rgba(232,103,58,0.25)' }}
                  >
                    {ctaLabel}
                    {!loading && <TshIcon name={step === 3 ? 'check' : 'arrowR'} size={16} color="white"/>}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ── Confirmation ── */
            <div className="flex-1 flex items-center justify-center px-4 py-12">
              <div className="text-center w-full max-w-[400px]">
                <div className="relative w-20 h-20 mx-auto mb-7">
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(52,211,153,0.15)' }}/>
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#E3EFE8' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0F6E4E' }}>
                      <TshIcon name="check" size={26} color="#FFFBF3" strokeWidth={3}/>
                    </div>
                  </div>
                </div>

                <h1 className="font-sans font-bold text-[26px] md:text-[32px] tracking-[-0.6px] leading-[1.15] mb-2" style={{ color: '#1A1208' }}>
                  Tu turno está <span style={{ color: '#0F6E4E' }}>confirmado</span>
                </h1>
                <p className="font-sans text-[14px] md:text-[15px] leading-[1.6] mb-7" style={{ color: '#5C5048' }}>
                  Te esperamos el {day.isToday ? 'día de hoy' : day.isTomorrow ? 'día de mañana' : `${day.dayName} ${day.dayNum}`} a las {slot} en {p.neighborhood}.
                </p>

                {/* Ticket */}
                <div className="rounded-2xl border-2 border-dashed overflow-hidden mb-6 text-left" style={{ background: '#FFFBF3', borderColor: '#E5D9C2' }}>
                  <div className="px-5 py-4 border-b border-dashed" style={{ borderColor: '#E5D9C2' }}>
                    <div className="font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-1" style={{ color: '#8B7D6B' }}>Código de turno</div>
                    <div className="font-mono text-[26px] font-bold tracking-[4px]" style={{ color: '#E8673A' }}>{confirmCode}</div>
                  </div>
                  <div className="px-5 py-4 flex items-center gap-3">
                    <TshAvatar name={p.person} seed={p.avatarSeed} size={36}/>
                    <div>
                      <div className="font-sans text-[14px] font-semibold" style={{ color: '#1A1208' }}>{p.nombre}</div>
                      <div className="font-sans text-[12px]" style={{ color: '#8B7D6B' }}>{svc.name} · {slot}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button onClick={() => router.push('/mis-turnos')} className="w-full h-12 rounded-xl border-none font-sans text-[15px] font-bold cursor-pointer transition-opacity hover:opacity-90" style={{ background: '#E8673A', color: 'white' }}>
                    Ver mis turnos
                  </button>
                  <button onClick={() => router.push('/')} className="w-full h-12 rounded-xl font-sans text-[14px] font-medium cursor-pointer border transition-colors" style={{ background: 'transparent', color: '#8B7D6B', borderColor: '#E5D9C2' }}>
                    Volver al inicio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Step content (shared between sheet and page) ────────────────────── */
function StepContent({ step, p, days, day, setDay, slot, setSlot, services, selectedService, setSelectedService, name, setName, email, setEmail, isGuest, phone, setPhone, notes, setNotes, confirmCode, error, svc, router }: {
  step: number; p: ProveedorCard; days: DayOption[]; day: DayOption; setDay: (d: DayOption) => void;
  slot: string; setSlot: (s: string) => void; services: BookingService[]; selectedService: number;
  setSelectedService: (i: number) => void; name: string; setName: (n: string) => void;
  email: string; setEmail: (e: string) => void; isGuest: boolean;
  phone: string; setPhone: (p: string) => void; notes: string; setNotes: (n: string) => void;
  confirmCode: string; error: string; svc: BookingService; router: ReturnType<typeof useRouter>;
}) {
  if (step === 1) return (
    <div className="flex flex-col gap-6">
      <div>
        <SLabel>Servicio</SLabel>
        <div className="flex flex-col gap-2">
          {services.map((s, i) => {
            const active = selectedService === i;
            return (
              <button key={i} onClick={() => setSelectedService(i)}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer text-left transition-all w-full"
                style={{ background: active ? '#FFF5F0' : '#FFFBF3', borderColor: active ? '#E8673A' : '#E5D9C2' }}
              >
                <div className="w-5 h-5 rounded-full shrink-0 border-2 flex items-center justify-center" style={{ borderColor: active ? '#E8673A' : '#D5C9B5', background: active ? '#E8673A' : 'transparent' }}>
                  {active && <div className="w-2 h-2 rounded-full bg-white"/>}
                </div>
                <div className="flex-1">
                  <div className="font-sans text-[14px] font-semibold" style={{ color: '#1A1208' }}>{s.name}</div>
                  <div className="font-sans text-[12px] mt-0.5" style={{ color: '#8B7D6B' }}>{s.dur} min</div>
                </div>
                <div className="font-sans text-[14px] font-bold tabular-nums" style={{ color: active ? '#E8673A' : '#1A1208' }}>{fmtPrice(s.price)}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SLabel>Fecha</SLabel>
        <div className="flex gap-2 overflow-x-auto pb-1.5 hide-scrollbar">
          {days.slice(0, 10).map(d => {
            const active = d.key === day.key;
            return (
              <button key={d.key} onClick={() => setDay(d)}
                className="shrink-0 w-[54px] py-3 px-1 rounded-2xl text-center cursor-pointer border-2 transition-all"
                style={{ background: active ? '#1A1208' : '#FFFBF3', borderColor: active ? '#1A1208' : '#E5D9C2', color: active ? '#F5EDDE' : '#1A1208' }}
              >
                <div className="font-sans text-[9px] uppercase tracking-[0.8px] font-bold opacity-60">
                  {d.isToday ? 'hoy' : d.isTomorrow ? 'mañ' : d.dayName}
                </div>
                <div className="font-sans font-bold text-[20px] leading-[1.1] mt-0.5 tabular-nums">{d.dayNum}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SLabel>Hora disponible</SLabel>
        <SlotGrid proveedorId={p.id} day={day} selectedSlot={slot} onSelect={setSlot}/>
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="flex flex-col gap-5">
      {[
        { label: 'Nombre completo', placeholder: 'Tu nombre y apellido', value: name, onChange: setName, type: 'text', hint: '' },
        ...(isGuest ? [{ label: 'Email *', placeholder: 'tu@email.com', value: email, onChange: setEmail, type: 'email', hint: 'Para enviarte la confirmación y poder consultar tu turno' }] : []),
        { label: 'Teléfono', placeholder: '+54 9 ...', value: phone, onChange: setPhone, type: 'tel', hint: 'Te enviamos el recordatorio por WhatsApp' },
      ].map(({ label, placeholder, value, onChange, type, hint }) => (
        <div key={label}>
          <label className="block font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-1.5" style={{ color: '#8B7D6B' }}>{label}</label>
          <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-4 py-3.5 rounded-xl border font-sans text-[15px] outline-none transition-colors"
            style={{ borderColor: '#E5D9C2', background: '#FFFBF3', color: '#1A1208' }}
            onFocus={e => (e.target.style.borderColor = '#E8673A')}
            onBlur={e => (e.target.style.borderColor = '#E5D9C2')}
          />
          {hint && <div className="font-sans text-[11px] mt-1" style={{ color: '#8B7D6B' }}>{hint}</div>}
        </div>
      ))}
      <div>
        <label className="block font-sans text-[10px] uppercase tracking-[0.8px] font-bold mb-1.5" style={{ color: '#8B7D6B' }}>
          Notas <span className="normal-case font-medium">(opcional)</span>
        </label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          placeholder="Cualquier detalle que nos quieras contar…"
          className="w-full px-4 py-3 rounded-xl border font-sans text-[14px] outline-none resize-y transition-colors"
          style={{ borderColor: '#E5D9C2', background: '#FFFBF3', color: '#1A1208' }}
          onFocus={e => (e.target.style.borderColor = '#E8673A')}
          onBlur={e => (e.target.style.borderColor = '#E5D9C2')}
        />
      </div>
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border" style={{ background: '#F0FFF8', borderColor: '#C5DCC9' }}>
        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#0F6E4E' }}>
          <TshIcon name="check" size={12} color="#FFFBF3" strokeWidth={2.5}/>
        </div>
        <div>
          <div className="font-sans text-[13px] font-semibold" style={{ color: '#0F6E4E' }}>Recordarme por WhatsApp</div>
          <div className="font-sans text-[12px] mt-0.5" style={{ color: '#5C9B78' }}>24h y 1h antes del turno</div>
        </div>
      </div>
    </div>
  );

  if (step === 3) return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFBF3', borderColor: '#EFE5D0' }}>
        <div className="p-4 flex gap-3 items-center border-b" style={{ borderColor: '#EFE5D0' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#E8673A' }}>
            <TshIcon name="calendar" size={20} color="#FFFBF3"/>
          </div>
          <div>
            <div className="font-sans font-bold text-[17px] tracking-[-0.3px]" style={{ color: '#1A1208' }}>
              {day.isToday ? 'Hoy' : day.isTomorrow ? 'Mañana' : `${day.dayName} ${day.dayNum}`} · {slot}
            </div>
            <div className="font-sans text-[12px] mt-0.5" style={{ color: '#8B7D6B' }}>{svc.dur} min · {p.neighborhood}</div>
          </div>
        </div>
        {([['Profesional', p.nombre], ['Servicio', svc.name], ['A nombre de', name], isGuest && email ? ['Email', email] : null, phone ? ['Teléfono', phone] : null] as (string[] | null)[]).filter((x): x is string[] => x !== null).map(([k, v]) => (
          <div key={k} className="px-4 py-3.5 flex justify-between items-center border-b" style={{ borderColor: '#EFE5D0' }}>
            <span className="font-sans text-[12px] font-medium" style={{ color: '#8B7D6B' }}>{k}</span>
            <span className="font-sans text-[13px] font-semibold text-right" style={{ color: '#1A1208' }}>{v}</span>
          </div>
        ))}
        <div className="px-4 py-4 flex justify-between" style={{ background: '#FAF4E8' }}>
          <span className="font-sans text-[14px] font-bold" style={{ color: '#1A1208' }}>Total</span>
          <span className="font-sans text-[20px] font-bold tabular-nums tracking-[-0.4px]" style={{ color: '#1A1208' }}>{fmtPrice(svc.price)}</span>
        </div>
      </div>
      <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-xl border" style={{ background: '#F0FFF8', borderColor: '#C5DCC9' }}>
        <TshIcon name="check" size={14} color="#0F6E4E" strokeWidth={2.5}/>
        <div className="font-sans text-[13px] leading-[1.55]" style={{ color: '#0F6E4E' }}>
          <strong>Sin cargo por reservar.</strong> Se paga directamente en el local. Cancelá gratis hasta 2h antes.
        </div>
      </div>
      {error && <div className="px-4 py-3.5 rounded-xl border font-sans text-[13px]" style={{ background: '#FFF0EC', borderColor: '#F5C9BC', color: '#A03E1B' }}>{error}</div>}
    </div>
  );

  return null;
}
