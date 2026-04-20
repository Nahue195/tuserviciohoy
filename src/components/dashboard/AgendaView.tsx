'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TshIcon } from '@/components/ui/TshIcon';
import { TshAvatar } from '@/components/ui/TshAvatar';
import { TshStatusPill } from '@/components/ui/TshStatusPill';

interface Apt { id: string; time: string; client: string; service: string; status: string; avatarSeed: number }
interface WeekApt extends Apt { fecha: string; dayIdx: number }
interface WeekBlock { day: number; start: number; end: number; client: string; color: string }
interface Props {
  turnosHoy: Apt[];
  turnosSemana: WeekApt[];
  weekSchedule: WeekBlock[];
  stats: { hoy: number; semana: number; clientes: number; rating: number; reviews: number };
}

const DAYS_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function AptCard({ a, onAction, compact = false }: { a: Apt; onAction: (id: string, estado: string) => Promise<void>; compact?: boolean }) {
  const [loading, setLoading] = useState('');
  const act = async (estado: string) => { setLoading(estado); await onAction(a.id, estado); setLoading(''); };
  return (
    <div className={`flex gap-3 ${compact ? 'p-3' : 'p-3.5'} bg-[#1C1C1C] rounded-xl border border-white/[0.06]`}>
      <div className="text-center shrink-0 min-w-[44px]">
        <div className="font-sans text-base font-semibold text-white tabular-nums">{a.time}</div>
        <div className="font-sans text-[10px] text-white/35 font-semibold">30m</div>
      </div>
      <div className="w-px bg-white/[0.06]"/>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <TshAvatar name={a.client} seed={a.avatarSeed} size={20}/>
          <span className="font-sans text-[13px] font-semibold text-white">{a.client}</span>
        </div>
        <div className="font-sans text-[11px] text-white/40 mb-2">{a.service}</div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <TshStatusPill status={a.status}/>
          {a.status === 'PENDIENTE' && (
            <button onClick={() => act('CONFIRMADO')} disabled={!!loading} className="px-2 py-[2px] rounded-full bg-[#34D399]/10 border-none cursor-pointer font-sans text-[11px] font-bold text-[#34D399] disabled:opacity-40">
              {loading === 'CONFIRMADO' ? '…' : 'Confirmar'}
            </button>
          )}
          {!['CANCELADO', 'COMPLETADO'].includes(a.status) && (
            <button onClick={() => act('CANCELADO')} disabled={!!loading} className="px-2 py-[2px] rounded-full bg-[#E8673A]/10 border-none cursor-pointer font-sans text-[11px] font-bold text-[#E8673A] disabled:opacity-40">
              {loading === 'CANCELADO' ? '…' : 'Cancelar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ViewToggle({ view, onChange }: { view: 'calendar' | 'list'; onChange: (v: 'calendar' | 'list') => void }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]">
      {(['calendar', 'list'] as const).map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-none cursor-pointer font-sans text-[12px] font-semibold transition-all duration-150"
          style={{
            background: view === v ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: view === v ? '#fff' : 'rgba(255,255,255,0.35)',
          }}
        >
          <TshIcon name={v === 'calendar' ? 'calendar2' : 'menu'} size={13} color="currentColor"/>
          {v === 'calendar' ? 'Calendario' : 'Lista'}
        </button>
      ))}
    </div>
  );
}

function ListView({ turnosSemana, todayIdx, onAction }: { turnosSemana: WeekApt[]; todayIdx: number; onAction: (id: string, estado: string) => Promise<void> }) {
  const byDay = Array.from({ length: 7 }, (_, i) => ({
    idx: i,
    label: DAYS_FULL[i],
    turnos: turnosSemana.filter(t => t.dayIdx === i),
  }));

  return (
    <div className="flex flex-col gap-3">
      {byDay.map(({ idx, label, turnos }) => {
        const isToday = idx === todayIdx;
        const hasItems = turnos.length > 0;
        return (
          <div key={idx} className="bg-[#161616] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div
              className="px-5 py-3.5 flex items-center gap-3 border-b"
              style={{ borderColor: isToday ? 'rgba(232,103,58,0.2)' : 'rgba(255,255,255,0.06)', background: isToday ? 'rgba(232,103,58,0.04)' : 'transparent' }}
            >
              <div className="flex items-center gap-2 flex-1">
                <span
                  className="font-sans text-[13px] font-bold"
                  style={{ color: isToday ? '#E8673A' : 'rgba(255,255,255,0.7)' }}
                >
                  {label}
                </span>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-full bg-[#E8673A]/10 font-sans text-[10px] font-bold text-[#E8673A] uppercase tracking-[0.5px]">Hoy</span>
                )}
              </div>
              <span className="font-sans text-[11px] text-white/25 font-semibold">
                {hasItems ? `${turnos.length} turno${turnos.length !== 1 ? 's' : ''}` : 'Sin turnos'}
              </span>
            </div>
            {hasItems ? (
              <div className="p-3 flex flex-col gap-2">
                {turnos.map(t => <AptCard key={t.id} a={t} onAction={onAction} compact/>)}
              </div>
            ) : (
              <div className="px-5 py-4 font-sans text-[12px] text-white/20">Día libre</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AgendaView({ turnosHoy, turnosSemana, weekSchedule, stats }: Props) {
  const router = useRouter();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const fecha = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  const handleAction = async (id: string, estado: string) => {
    await fetch(`/api/turnos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) });
    router.refresh();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
        <div>
          <div className="font-sans text-[11px] text-white/35 uppercase tracking-[1px] font-semibold mb-1 capitalize">{fecha}</div>
          <h1 className="font-sans font-bold text-[24px] md:text-[28px] text-white m-0 tracking-[-0.5px]">
            Agenda de hoy
            <span className="text-[#E8673A] ml-2 font-semibold">{stats.hoy} turno{stats.hoy !== 1 ? 's' : ''}</span>
          </h1>
        </div>
        <div className="hidden md:block">
          <ViewToggle view={view} onChange={setView}/>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Hoy', value: String(stats.hoy), sub: 'confirmados', accent: '#E8673A' },
          { label: 'Esta semana', value: String(stats.semana), sub: 'turnos totales', accent: '#A78BFA' },
          { label: 'Clientes nuevos', value: String(stats.clientes), sub: 'este mes', accent: '#34D399' },
          { label: 'Calificación', value: stats.rating.toFixed(1), sub: `${stats.reviews} reseñas`, accent: '#FBBF24', isStar: true },
        ].map(s => (
          <div key={s.label} className="bg-[#161616] border border-white/[0.06] rounded-2xl px-5 py-4">
            <div className="font-sans text-[10px] text-white/35 uppercase tracking-[0.8px] font-semibold mb-3">{s.label}</div>
            <div className="flex items-baseline gap-1.5">
              <div className="font-sans text-[36px] font-bold leading-none tracking-[-1px]" style={{ color: s.accent }}>{s.value}</div>
              {(s as { isStar?: boolean }).isStar && <TshIcon name="star" size={14} color={s.accent}/>}
            </div>
            <div className="font-sans text-[11px] text-white/35 mt-1.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Mobile: always show list view */}
      <div className="md:hidden">
        <ListView turnosSemana={turnosSemana} todayIdx={todayIdx} onAction={handleAction}/>
      </div>

      {/* Desktop: toggle between list and calendar */}
      <div className="hidden md:block">
      {view === 'list' && (
        <ListView turnosSemana={turnosSemana} todayIdx={todayIdx} onAction={handleAction}/>
      )}

      {/* Calendar view */}
      {view === 'calendar' && (
        <div className="grid grid-cols-[1fr_280px] gap-4">
          {/* Calendar grid */}
          <div className="bg-[#161616] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <div className="font-sans text-sm font-semibold text-white">Agenda semanal</div>
            </div>
            <div className="grid relative" style={{ gridTemplateColumns: '48px repeat(6, 1fr)' }}>
              <div/>
              {DAYS_SHORT.map((d, i) => (
                <div key={d} className={`px-2 py-2.5 text-center border-b border-l border-white/[0.04] ${i === todayIdx ? 'bg-white/[0.03]' : ''}`}>
                  <div className="font-sans text-[10px] text-white/30 uppercase tracking-[0.6px] font-semibold">{d}</div>
                  <div className={`font-sans font-semibold text-base mt-0.5 tabular-nums ${i === todayIdx ? 'text-[#E8673A]' : 'text-white/70'}`}>
                    {new Date().getDate() - todayIdx + i}
                  </div>
                </div>
              ))}
              {hours.map(h => (
                <div key={h} style={{ display: 'contents' }}>
                  <div className="px-2 pt-1 text-right border-b border-white/[0.03] font-sans text-[10px] text-white/20 font-semibold h-11">
                    {String(h).padStart(2,'0')}
                  </div>
                  {DAYS_SHORT.map((_, di) => (
                    <div key={di} className={`h-11 border-b border-white/[0.03] border-l border-solid border-white/[0.04] ${di === todayIdx ? 'bg-white/[0.02]' : ''}`}/>
                  ))}
                </div>
              ))}
              {weekSchedule.map((a, i) => {
                const isOrange = a.color === '#D9634A';
                return (
                  <div
                    key={i}
                    className="absolute rounded-[6px] px-1.5 py-1 overflow-hidden font-sans cursor-pointer"
                    style={{
                      left: `calc(48px + (100% - 48px) / 6 * ${a.day} + 2px)`,
                      width: `calc((100% - 48px) / 6 - 4px)`,
                      top: `${34 + (a.start - 9) * 44}px`,
                      height: `${Math.max((a.end - a.start) * 44 - 3, 18)}px`,
                      background: isOrange ? 'rgba(232,103,58,0.15)' : 'rgba(52,211,153,0.1)',
                      borderLeft: `2px solid ${isOrange ? '#E8673A' : '#34D399'}`,
                    }}
                  >
                    <div className="text-[9px] font-bold" style={{ color: isOrange ? '#E8673A' : '#34D399' }}>{String(a.start).padStart(2,'0')}:00</div>
                    <div className="text-[9px] truncate opacity-70" style={{ color: isOrange ? '#E8673A' : '#34D399' }}>{a.client}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today list */}
          <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-4">
            <div className="font-sans text-sm font-semibold text-white mb-0.5">Turnos de hoy</div>
            <div className="font-sans text-[11px] text-white/35 mb-4">{stats.hoy} agendado{stats.hoy !== 1 ? 's' : ''}</div>
            <div className="flex flex-col gap-2">
              {turnosHoy.length === 0 && (
                <div className="font-sans text-[13px] text-white/30 text-center py-8">Sin turnos para hoy 🎉</div>
              )}
              {turnosHoy.map(a => <AptCard key={a.id} a={a} onAction={handleAction}/>)}
            </div>
          </div>
        </div>
      )}
      </div>{/* end desktop block */}
    </div>
  );
}
