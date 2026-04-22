import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TshIcon } from '@/components/ui/TshIcon';

function pct(a: number, b: number) {
  if (b === 0) return a > 0 ? 100 : 0;
  return Math.round(((a - b) / b) * 100);
}

function fmtMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function Trend({ value }: { value: number }) {
  if (value === 0) return <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>sin cambios</span>;
  const up = value > 0;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-geist-sans)', fontSize: 11, fontWeight: 600, color: up ? '#34D399' : '#F87171' }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d={up ? 'M5 8V2M2 5l3-3 3 3' : 'M5 2v6M2 5l3 3 3-3'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {Math.abs(value)}% vs mes anterior
    </span>
  );
}

export default async function EstadisticasPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as { email?: string | null };

  const proveedor = await prisma.proveedor.findFirst({
    where: { user: { email: user.email ?? '' } },
    include: { resenas: { select: { rating: true, createdAt: true, comentario: true, cliente: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 5 } },
  });
  if (!proveedor) return null;

  // Date ranges
  const now = new Date();
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 29); thirtyDaysAgo.setHours(0, 0, 0, 0);
  const eightWeeksAgo = new Date(); eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const [turnosThisMonth, turnosLastMonth, turnos30, allTurnos] = await Promise.all([
    prisma.turno.findMany({
      where: { proveedorId: proveedor.id, fecha: { gte: startThisMonth }, estado: { not: 'CANCELADO' } },
      select: { clienteId: true, precio: true, servicio: true, estado: true, fecha: true, horaInicio: true, cliente: { select: { name: true } } },
    }),
    prisma.turno.findMany({
      where: { proveedorId: proveedor.id, fecha: { gte: startLastMonth, lte: endLastMonth }, estado: { not: 'CANCELADO' } },
      select: { clienteId: true, precio: true, estado: true },
    }),
    prisma.turno.findMany({
      where: { proveedorId: proveedor.id, fecha: { gte: thirtyDaysAgo }, estado: { not: 'CANCELADO' } },
      select: { fecha: true },
    }),
    prisma.turno.findMany({
      where: { proveedorId: proveedor.id, createdAt: { gte: eightWeeksAgo }, estado: { not: 'CANCELADO' } },
      select: { createdAt: true, servicio: true },
    }),
  ]);

  // This month stats
  const ingresosMes = turnosThisMonth.filter(t => t.estado === 'COMPLETADO').reduce((s, t) => s + (t.precio ?? 0), 0);
  const clientesUnicos = new Set(turnosThisMonth.map(t => t.clienteId)).size;
  const avgRating = proveedor.resenas.length > 0 ? proveedor.resenas.reduce((s, r) => s + r.rating, 0) / proveedor.resenas.length : 0;

  // Last month stats
  const ingresosLastMonth = turnosLastMonth.filter(t => t.estado === 'COMPLETADO').reduce((s, t) => s + (t.precio ?? 0), 0);
  const clientesUnicosLast = new Set(turnosLastMonth.map(t => t.clienteId)).size;

  // Trends
  const turnosTrend = pct(turnosThisMonth.length, turnosLastMonth.length);
  const ingresosTrend = pct(ingresosMes, ingresosLastMonth);
  const clientesTrend = pct(clientesUnicos, clientesUnicosLast);

  // Daily chart (last 30 days)
  const dailyCounts: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo); d.setDate(d.getDate() + i);
    dailyCounts[d.toISOString().split('T')[0]!] = 0;
  }
  for (const t of turnos30) {
    const key = new Date(t.fecha).toISOString().split('T')[0]!;
    if (key in dailyCounts) dailyCounts[key] = (dailyCounts[key] ?? 0) + 1;
  }
  const dailyData = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));
  const maxDay = Math.max(...dailyData.map(d => d.count), 1);

  // Weekly chart
  const weeks: { label: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date(); start.setDate(start.getDate() - i * 7 - start.getDay() + 1); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 6); end.setHours(23, 59, 59, 999);
    const count = allTurnos.filter(t => t.createdAt >= start && t.createdAt <= end).length;
    weeks.push({ label: `${start.getDate()}/${start.getMonth() + 1}`, count });
  }

  // Services
  const serviceCounts: Record<string, number> = {};
  for (const t of allTurnos) {
    const s = t.servicio ?? 'Consulta';
    serviceCounts[s] = (serviceCounts[s] ?? 0) + 1;
  }
  const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSvc = Math.max(...topServices.map(s => s[1]), 1);

  // Upcoming turnos
  const upcoming = turnosThisMonth
    .filter(t => new Date(t.fecha) >= now)
    .sort((a, b) => {
      const da = new Date(a.fecha).getTime() + parseInt(a.horaInicio.split(':')[0] ?? '0') * 60;
      const db = new Date(b.fecha).getTime() + parseInt(b.horaInicio.split(':')[0] ?? '0') * 60;
      return da - db;
    })
    .slice(0, 4);

  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-sans font-bold text-[28px] text-white m-0 tracking-[-0.5px]">Estadísticas</h1>
        <p className="font-sans text-sm text-white/40 m-0 mt-1.5">
          {now.toLocaleString('es-AR', { month: 'long', year: 'numeric' })} · actualizado ahora
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: 'Turnos este mes', value: turnosThisMonth.length, trend: turnosTrend,
            icon: 'calendar2', color: '#E8673A', sub: `${turnosLastMonth.length} mes anterior`,
          },
          {
            label: 'Ingresos estimados', value: ingresosMes > 0 ? fmtMoney(ingresosMes) : '—', trend: ingresosTrend,
            icon: 'chart', color: '#34D399', sub: ingresosMes > 0 ? 'completados' : 'sin precios cargados',
          },
          {
            label: 'Clientes únicos', value: clientesUnicos, trend: clientesTrend,
            icon: 'user', color: '#60A5FA', sub: `${clientesUnicosLast} mes anterior`,
          },
          {
            label: 'Calificación', value: avgRating > 0 ? avgRating.toFixed(1) : '—', trend: 0,
            icon: 'star', color: '#FBBF24', sub: `${proveedor.resenas.length} reseñas`,
          },
        ].map(s => (
          <div key={s.label} className="bg-[#161616] border border-white/[0.06] rounded-2xl px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-[11px] text-white/35 font-bold uppercase tracking-[0.7px]">{s.label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <TshIcon name={s.icon} size={14} color={s.color}/>
              </div>
            </div>
            <div className="font-sans text-[32px] font-bold leading-none tracking-[-1.5px] mb-2" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="flex flex-col gap-1">
              <Trend value={s.trend}/>
              <span className="font-sans text-[10px] text-white/25">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Daily chart — last 30 days */}
        <div className="lg:col-span-2 bg-[#161616] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="font-sans text-sm font-semibold text-white">Turnos últimos 30 días</div>
            <div className="font-sans text-[11px] text-white/30">{turnos30.length} total</div>
          </div>
          <div className="flex items-end gap-[3px] h-[100px]">
            {dailyData.map((d, i) => {
              const isWeekend = [0, 6].includes(new Date(d.date).getDay());
              return (
                <div key={i} className="flex-1 flex flex-col justify-end" title={`${d.date}: ${d.count}`}>
                  <div
                    className="w-full rounded-t-[2px] transition-all duration-300"
                    style={{
                      height: `${Math.max((d.count / maxDay) * 100, d.count > 0 ? 8 : 3)}%`,
                      background: d.count > 0
                        ? (isWeekend ? 'rgba(232,103,58,0.5)' : '#E8673A')
                        : 'rgba(255,255,255,0.04)',
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-sans text-[9px] text-white/20">
              {new Date(thirtyDaysAgo).getDate()} {MESES[new Date(thirtyDaysAgo).getMonth()]}
            </span>
            <span className="font-sans text-[9px] text-white/20">hoy</span>
          </div>
        </div>

        {/* Services */}
        <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6">
          <div className="font-sans text-sm font-semibold text-white mb-5">Servicios más pedidos</div>
          {topServices.length === 0 ? (
            <div className="font-sans text-[13px] text-white/25 text-center py-6">Sin datos todavía</div>
          ) : (
            <div className="flex flex-col gap-4">
              {topServices.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-sans text-[12px] font-semibold text-white truncate pr-2">{name}</span>
                    <span className="font-sans text-[12px] text-white/35 shrink-0">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.05]">
                    <div className="h-full rounded-full bg-[#E8673A]" style={{ width: `${(count / maxSvc) * 100}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Upcoming appointments */}
        <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6">
          <div className="font-sans text-sm font-semibold text-white mb-4">Próximos turnos</div>
          {upcoming.length === 0 ? (
            <div className="font-sans text-[13px] text-white/25 text-center py-6">No hay turnos próximos</div>
          ) : (
            <div className="flex flex-col gap-2">
              {upcoming.map(t => {
                const d = new Date(t.fecha);
                return (
                  <div key={t.horaInicio + t.clienteId} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0" style={{ background: 'rgba(232,103,58,0.1)', border: '1px solid rgba(232,103,58,0.15)' }}>
                      <span className="font-sans text-[9px] font-bold uppercase" style={{ color: '#E8673A', lineHeight: 1 }}>{DIAS[d.getDay()]}</span>
                      <span className="font-sans text-[14px] font-bold" style={{ color: '#E8673A', lineHeight: 1.1 }}>{d.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-[13px] font-semibold text-white truncate">{(t.cliente as { name?: string | null }).name ?? 'Cliente'}</div>
                      <div className="font-sans text-[11px] text-white/35">{t.servicio ?? 'Consulta'} · {t.horaInicio}</div>
                    </div>
                    <div className="font-sans text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: t.estado === 'CONFIRMADO' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)', color: t.estado === 'CONFIRMADO' ? '#34D399' : '#FBBF24' }}>
                      {t.estado === 'CONFIRMADO' ? 'Confirmado' : 'Pendiente'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent reviews */}
        <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6">
          <div className="font-sans text-sm font-semibold text-white mb-4">Últimas reseñas</div>
          {proveedor.resenas.length === 0 ? (
            <div className="font-sans text-[13px] text-white/25 text-center py-6">Todavía no tenés reseñas</div>
          ) : (
            <div className="flex flex-col gap-3">
              {proveedor.resenas.map((r, i) => (
                <div key={i} className="px-3 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sans text-[12px] font-semibold text-white">{r.cliente.name ?? 'Cliente'}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <svg key={j} width="10" height="10" viewBox="0 0 12 12" fill={j < r.rating ? '#FBBF24' : 'rgba(255,255,255,0.1)'}>
                          <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  {r.comentario && (
                    <p className="font-sans text-[11px] text-white/40 leading-[1.5] m-0 line-clamp-2">{r.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
