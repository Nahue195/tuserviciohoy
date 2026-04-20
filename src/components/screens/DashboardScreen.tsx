'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TshIcon } from '@/components/ui/TshIcon';
import { TshButton } from '@/components/ui/TshButton';
import { TshAvatar } from '@/components/ui/TshAvatar';
import { TshStatusPill } from '@/components/ui/TshStatusPill';

interface Appointment {
  id: string;
  time: string;
  client: string;
  service: string;
  status: string;
  duration: number;
  avatarSeed: number;
}

function AppointmentCard({ a, onAction }: { a: Appointment; onAction: (id: string, estado: string) => Promise<void> }) {
  const [loading, setLoading] = useState('');
  const handleAction = async (estado: string) => {
    setLoading(estado);
    await onAction(a.id, estado);
    setLoading('');
  };
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 12px', background: '#FAF4E8', borderRadius: 12, border: '1px solid #EFE5D0' }}>
      <div style={{ width: 48, textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 17, fontWeight: 500, color: '#2A2420', letterSpacing: -0.3, lineHeight: 1 }}>{a.time}</div>
        <div style={{ fontFamily: 'inherit', fontSize: 10, color: '#8B7D6B', fontWeight: 600, marginTop: 2 }}>{a.duration}min</div>
      </div>
      <div style={{ width: 1, background: '#EADFC5' }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <TshAvatar name={a.client} seed={a.avatarSeed} size={22}/>
          <span style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#2A2420', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.client}</span>
        </div>
        <div style={{ fontFamily: 'inherit', fontSize: 12, color: '#5C5048', marginBottom: 6 }}>{a.service}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TshStatusPill status={a.status}/>
          {a.status === 'PENDIENTE' && (
            <button onClick={() => handleAction('CONFIRMADO')} disabled={!!loading} style={{ padding: '3px 10px', borderRadius: 9999, background: '#E3EFE8', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, color: '#0F6E4E' }}>
              {loading === 'CONFIRMADO' ? '…' : 'Confirmar'}
            </button>
          )}
          {a.status !== 'CANCELADO' && a.status !== 'COMPLETADO' && (
            <button onClick={() => handleAction('CANCELADO')} disabled={!!loading} style={{ padding: '3px 10px', borderRadius: 9999, background: '#F2DAD2', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, color: '#A03E1B' }}>
              {loading === 'CANCELADO' ? '…' : 'Cancelar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface WeekBlock {
  day: number;
  start: number;
  end: number;
  client: string;
  color: string;
}

interface DashboardScreenProps {
  proveedorNombre: string;
  personName: string;
  avatarSeed: number;
  todayAppointments: Appointment[];
  weekSchedule: WeekBlock[];
  stats: { hoy: number; semana: number; clientes: number; rating: number; reviews: number };
}

const NAV_ITEMS = [
  { id: 'agenda', label: 'Agenda', icon: 'calendar2', active: true },
  { id: 'clientes', label: 'Clientes', icon: 'user' },
  { id: 'servicios', label: 'Servicios y precios', icon: 'sparkle' },
  { id: 'perfil', label: 'Mi perfil público', icon: 'home' },
  { id: 'stats', label: 'Estadísticas', icon: 'chart' },
  { id: 'config', label: 'Configuración', icon: 'settings' },
];

export function DashboardScreenDesktop({ proveedorNombre, personName, avatarSeed, todayAppointments, weekSchedule, stats }: DashboardScreenProps) {
  const router = useRouter();
  const handleAction = async (id: string, estado: string) => {
    await fetch(`/api/turnos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) });
    router.refresh();
  };
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  const fecha = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%', display: 'grid', gridTemplateColumns: '240px 1fr' }}>
      {/* Sidebar */}
      <aside style={{ background: '#2A2420', padding: '24px 20px', color: '#F5EDDE', display: 'flex', flexDirection: 'column', gap: 24, minHeight: '100vh' }}>
        <div onClick={() => router.push('/')} style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, letterSpacing: -0.4, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
          Tu<span style={{ color: '#E88A5F', fontStyle: 'italic' }}>Servicio</span>Hoy
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid rgba(245,237,222,0.12)', borderBottom: '1px solid rgba(245,237,222,0.12)' }}>
          <TshAvatar name={personName} seed={avatarSeed} size={36}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proveedorNombre}</div>
            <div style={{ fontFamily: 'inherit', fontSize: 11, opacity: 0.6 }}>Plan gratuito</div>
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: item.active ? 'rgba(245,237,222,0.1)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: item.active ? 600 : 500, color: item.active ? '#F5EDDE' : 'rgba(245,237,222,0.7)' }}>
              <TshIcon name={item.icon} size={16} color="currentColor"/>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: 14, background: '#C4532A', borderRadius: 14 }}>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 500, letterSpacing: -0.2, marginBottom: 4 }}>Mejorá a Pro</div>
          <div style={{ fontFamily: 'inherit', fontSize: 11, opacity: 0.9, marginBottom: 10, lineHeight: 1.4 }}>Reportes avanzados y recordatorios automáticos</div>
          <div style={{ fontFamily: 'inherit', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            Ver planes <TshIcon name="arrowR" size={12} color="#F5EDDE"/>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ padding: '28px 36px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'inherit', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 6 }}>{fecha}</div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 38, color: '#2A2420', margin: 0, letterSpacing: -0.8 }}>
              Hola, <span style={{ fontStyle: 'italic', color: '#C4532A' }}>{personName.split(' ')[0]}</span>. Tenés {stats.hoy} turnos hoy.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button style={{ width: 40, height: 40, borderRadius: 9999, background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <TshIcon name="bell" size={16} color="#2A2420"/>
              <div style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#C4532A', border: '2px solid #FFFBF3' }}/>
            </button>
            <TshButton variant="secondary" size="sm" icon="close">Bloquear horario</TshButton>
            <TshButton variant="primary" size="sm" icon="plus">Nuevo turno</TshButton>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Turnos hoy', value: String(stats.hoy), sub: `${stats.hoy - 1} confirmados`, color: '#2A2420' },
            { label: 'Esta semana', value: String(stats.semana), sub: 'turnos totales', color: '#0F6E4E', trend: true },
            { label: 'Clientes nuevos', value: String(stats.clientes), sub: 'este mes', color: '#C4532A' },
            { label: 'Calificación', value: stats.rating.toFixed(1), sub: `${stats.reviews} reseñas`, color: '#D69A2A', isStar: true },
          ].map(s => (
            <div key={s.label} style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 18, padding: 18 }}>
              <div style={{ fontFamily: 'inherit', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 }}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 40, fontWeight: 500, color: s.color, letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
                {s.isStar && <TshIcon name="star" size={18} color="#D69A2A"/>}
                {s.trend && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: '2px 7px', borderRadius: 9999, background: '#E3EFE8', color: '#0F6E4E', fontFamily: 'inherit', fontSize: 10, fontWeight: 700 }}>↑ +12%</span>}
              </div>
              <div style={{ fontFamily: 'inherit', fontSize: 12, color: '#8B7D6B', marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Week calendar */}
          <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 22, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #EFE5D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', letterSpacing: -0.3 }}>Agenda semanal</div>
                <div style={{ fontFamily: 'inherit', fontSize: 12, color: '#8B7D6B', marginTop: 2 }}>Esta semana</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ width: 32, height: 32, borderRadius: 9, background: 'transparent', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <TshIcon name="chevronL" size={12} color="#2A2420"/>
                </button>
                <div style={{ padding: '0 14px', height: 32, borderRadius: 9, background: '#FAF4E8', border: '1px solid #E5D9C2', display: 'inline-flex', alignItems: 'center', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: '#2A2420' }}>Hoy</div>
                <button style={{ width: 32, height: 32, borderRadius: 9, background: 'transparent', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <TshIcon name="chevronR" size={12} color="#2A2420"/>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '52px repeat(6, 1fr)', position: 'relative' }}>
              <div/>
              {days.map((d, i) => (
                <div key={d} style={{ padding: '12px 8px 10px', textAlign: 'center', borderBottom: '1px solid #EFE5D0', borderLeft: '1px solid #EFE5D0', background: i === today ? '#FAF4E8' : 'transparent' }}>
                  <div style={{ fontFamily: 'inherit', fontSize: 10, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>{d.slice(0, 3)}</div>
                  <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: i === today ? '#C4532A' : '#2A2420', marginTop: 2, letterSpacing: -0.3 }}>{new Date().getDate() - today + i}</div>
                </div>
              ))}

              {hours.map((h) => (
                <div key={h} style={{ display: 'contents' }}>
                  <div style={{ padding: '4px 6px 0 12px', textAlign: 'right', borderBottom: '1px dashed #F0E6CE', fontFamily: 'inherit', fontSize: 10, color: '#8B7D6B', fontWeight: 600, height: 52 }}>
                    {String(h).padStart(2, '0')}:00
                  </div>
                  {days.map((_, di) => (
                    <div key={di} style={{ height: 52, borderBottom: '1px dashed #F0E6CE', borderLeft: '1px solid #EFE5D0', position: 'relative', background: di === today ? '#FAF4E8' : 'transparent' }}/>
                  ))}
                </div>
              ))}

              {weekSchedule.map((a, i) => {
                const bg = a.color === '#D9634A' ? '#FBE6DD' : '#E3EFE8';
                const fg = a.color === '#D9634A' ? '#A03E1B' : '#0F6E4E';
                return (
                  <div key={i} style={{
                    position: 'absolute',
                    left: `calc(52px + (100% - 52px) / 6 * ${a.day} + 4px)`,
                    width: `calc((100% - 52px) / 6 - 8px)`,
                    top: `${41 + (a.start - 9) * 52}px`,
                    height: `${(a.end - a.start) * 52 - 4}px`,
                    background: bg, borderLeft: `3px solid ${a.color}`, borderRadius: 7,
                    padding: '5px 8px', overflow: 'hidden',
                    fontFamily: 'inherit', cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: fg, lineHeight: 1.2 }}>
                      {String(Math.floor(a.start)).padStart(2, '0')}:{a.start % 1 ? '30' : '00'}
                    </div>
                    <div style={{ fontSize: 11, color: fg, opacity: 0.85, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.client}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '12px 22px', borderTop: '1px solid #EFE5D0', display: 'flex', gap: 18, alignItems: 'center', fontFamily: 'inherit', fontSize: 11, color: '#5C5048' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#D9634A', borderRadius: 3, display: 'inline-block' }}/> Corte / Peinado</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#0F6E4E', borderRadius: 3, display: 'inline-block' }}/> Color / Tratamiento</div>
              <div style={{ marginLeft: 'auto', color: '#8B7D6B' }}>9:00 — 19:00 · Lun a Sáb</div>
            </div>
          </div>

          {/* Today's list */}
          <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 22, padding: '18px 20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', letterSpacing: -0.3 }}>Turnos de hoy</div>
                <div style={{ fontFamily: 'inherit', fontSize: 12, color: '#8B7D6B', marginTop: 2 }}>{stats.hoy} confirmados</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todayAppointments.length === 0 && (
                <div style={{ fontFamily: 'inherit', fontSize: 13, color: '#8B7D6B', textAlign: 'center', padding: '20px 0' }}>Sin turnos para hoy</div>
              )}
              {todayAppointments.map((a) => (
                <AppointmentCard key={a.id} a={a} onAction={handleAction}/>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function DashboardScreenMobile({ proveedorNombre, personName, avatarSeed, todayAppointments, stats }: DashboardScreenProps) {
  const router = useRouter();
  const handleAction = async (id: string, estado: string) => {
    await fetch(`/api/turnos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) });
    router.refresh();
  };
  const fecha = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' });

  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TshAvatar name={personName} seed={avatarSeed} size={36}/>
            <div>
              <div style={{ fontFamily: 'inherit', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>{fecha}</div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 16, color: '#2A2420', letterSpacing: -0.2 }}>Hola, {personName.split(' ')[0]}</div>
            </div>
          </div>
          <button style={{ width: 40, height: 40, borderRadius: 9999, background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <TshIcon name="bell" size={16} color="#2A2420"/>
            <div style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#C4532A', border: '2px solid #FFFBF3' }}/>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: '#2A2420', borderRadius: 16, padding: 14, color: '#F5EDDE' }}>
            <div style={{ fontFamily: 'inherit', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, opacity: 0.7 }}>Turnos hoy</div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 38, fontWeight: 500, letterSpacing: -1, lineHeight: 1, marginTop: 4 }}>{stats.hoy}</div>
            <div style={{ fontFamily: 'inherit', fontSize: 11, opacity: 0.7, marginTop: 4 }}>Próximo {todayAppointments[0]?.time ?? '--'}</div>
          </div>
          <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 16, padding: 14 }}>
            <div style={{ fontFamily: 'inherit', fontSize: 10, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>Semana</div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 38, fontWeight: 500, color: '#0F6E4E', letterSpacing: -1, lineHeight: 1, marginTop: 4 }}>{stats.semana}</div>
            <div style={{ fontFamily: 'inherit', fontSize: 11, color: '#0F6E4E', marginTop: 4, fontWeight: 600 }}>↑ +12%</div>
          </div>
        </div>

        <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: '#F7ECD0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TshIcon name="star" size={20} color="#D69A2A"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'inherit', fontSize: 12, color: '#8B7D6B', fontWeight: 600 }}>Calificación promedio</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, fontWeight: 500, color: '#2A2420', letterSpacing: -0.3 }}>{stats.rating.toFixed(1)}</span>
              <span style={{ fontFamily: 'inherit', fontSize: 12, color: '#8B7D6B' }}>· {stats.reviews} reseñas</span>
            </div>
          </div>
          <TshIcon name="chevronR" size={16} color="#8B7D6B"/>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <TshButton variant="primary" size="sm" icon="plus" className="flex-1">Nuevo turno</TshButton>
          <TshButton variant="soft" size="sm" icon="close" className="flex-1">Bloquear</TshButton>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', margin: 0, letterSpacing: -0.3 }}>Turnos de hoy</h2>
          <span style={{ fontFamily: 'inherit', fontSize: 11, color: '#8B7D6B', fontWeight: 600 }}>{stats.hoy} confirmados</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 100 }}>
          {todayAppointments.length === 0 && (
            <div style={{ fontFamily: 'inherit', fontSize: 13, color: '#8B7D6B', textAlign: 'center', padding: '20px 0' }}>Sin turnos para hoy</div>
          )}
          {todayAppointments.map((a) => (
            <AppointmentCard key={a.id} a={a} onAction={handleAction}/>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, paddingBottom: 34, background: 'rgba(255,251,243,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #EADFC5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0 6px' }}>
          {[
            { icon: 'calendar2', label: 'Agenda', active: true },
            { icon: 'user', label: 'Clientes' },
            { icon: 'chart', label: 'Stats' },
            { icon: 'settings', label: 'Ajustes' },
          ].map(n => (
            <div key={n.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: n.active ? '#C4532A' : '#8B7D6B' }}>
              <TshIcon name={n.icon} size={22} color="currentColor"/>
              <span style={{ fontFamily: 'inherit', fontSize: 10, fontWeight: 600 }}>{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
