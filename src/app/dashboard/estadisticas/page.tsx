import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TshIcon } from '@/components/ui/TshIcon';

export default async function EstadisticasPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as { email?: string | null };

  const proveedor = await prisma.proveedor.findFirst({ where: { user: { email: user.email ?? '' } } });
  if (!proveedor) return null;

  const eightWeeksAgo = new Date(); eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const [turnos, resenas] = await Promise.all([
    prisma.turno.findMany({ where: { proveedorId: proveedor.id, createdAt: { gte: eightWeeksAgo }, estado: { not: 'CANCELADO' } }, select: { createdAt: true, servicio: true } }),
    prisma.resena.findMany({ where: { proveedorId: proveedor.id }, select: { rating: true, createdAt: true } }),
  ]);

  const weeks: { label: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date(); start.setDate(start.getDate() - i * 7 - start.getDay() + 1); start.setHours(0,0,0,0);
    const end = new Date(start); end.setDate(end.getDate() + 6); end.setHours(23,59,59,999);
    const count = turnos.filter(t => t.createdAt >= start && t.createdAt <= end).length;
    weeks.push({ label: `${start.getDate()}/${start.getMonth()+1}`, count });
  }

  const maxWeek = Math.max(...weeks.map(w => w.count), 1);
  const avgRating = resenas.length > 0 ? resenas.reduce((s,r) => s + r.rating, 0) / resenas.length : 0;

  const serviceCounts: Record<string, number> = {};
  for (const t of turnos) { const s = t.servicio ?? 'Consulta'; serviceCounts[s] = (serviceCounts[s] ?? 0) + 1; }
  const topServices = Object.entries(serviceCounts).sort((a,b) => b[1]-a[1]).slice(0,5);
  const maxSvc = Math.max(...topServices.map(s => s[1]), 1);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-sans font-bold text-[28px] text-white m-0 tracking-[-0.5px]">Estadísticas</h1>
        <p className="font-sans text-sm text-white/40 m-0 mt-1.5">Últimas 8 semanas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total turnos', value: turnos.length, icon: 'calendar2', color: '#E8673A' },
          { label: 'Calificación', value: avgRating > 0 ? avgRating.toFixed(1) : '—', icon: 'star', color: '#FBBF24' },
          { label: 'Reseñas recibidas', value: resenas.length, icon: 'msg', color: '#34D399' },
        ].map(s => (
          <div key={s.label} className="bg-[#161616] border border-white/[0.06] rounded-2xl px-5 py-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <TshIcon name={s.icon} size={18} color={s.color}/>
              </div>
              <span className="font-sans text-[11px] text-white/35 font-bold uppercase tracking-[0.8px]">{s.label}</span>
            </div>
            <div className="font-sans text-[36px] font-bold leading-none tracking-[-1.5px]" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6">
          <div className="font-sans text-sm font-semibold text-white mb-6">Turnos por semana</div>
          <div className="flex items-end gap-2 h-[140px]">
            {weeks.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="font-sans text-[10px] font-bold text-[#E8673A]">{w.count || ''}</div>
                <div
                  className="w-full rounded-t-[5px] transition-all duration-[400ms]"
                  style={{ background: w.count > 0 ? '#E8673A' : 'rgba(255,255,255,0.06)', height: `${Math.max((w.count / maxWeek) * 100, 4)}%` }}
                />
                <div className="font-sans text-[9px] text-white/25 font-semibold">{w.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top services */}
        <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6">
          <div className="font-sans text-sm font-semibold text-white mb-5">Servicios más pedidos</div>
          {topServices.length === 0 && <div className="font-sans text-[13px] text-white/30">Sin datos todavía</div>}
          <div className="flex flex-col gap-4">
            {topServices.map(([name, count]) => (
              <div key={name}>
                <div className="flex justify-between mb-2">
                  <span className="font-sans text-[13px] font-semibold text-white">{name}</span>
                  <span className="font-sans text-[13px] text-white/35">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-[#E8673A]" style={{ width: `${(count / maxSvc) * 100}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
