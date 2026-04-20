import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const FREE_LIMIT = 20;

export default async function PlanPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as { email?: string | null };

  const proveedor = await prisma.proveedor.findFirst({
    where: { user: { email: user.email ?? '' } },
    select: { id: true, nombre: true, plan: true, planVence: true },
  });
  if (!proveedor) return null;

  const isPro = proveedor.plan === 'PRO';

  // Turnos este mes
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const turnosMes = await prisma.turno.count({
    where: { proveedorId: proveedor.id, createdAt: { gte: firstOfMonth }, estado: { not: 'CANCELADO' } },
  });

  const usoPct = isPro ? null : Math.min(100, Math.round((turnosMes / FREE_LIMIT) * 100));
  const diasHastaRenovacion = (() => {
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.getDate() - now.getDate();
  })();

  const waLink = `https://wa.me/54239261818?text=${encodeURIComponent(`Hola! Soy ${proveedor.nombre} y quiero activar el plan Pro`)}`;

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-sans font-bold text-[28px] text-white m-0 tracking-[-0.5px]">Mi plan</h1>
        <p className="font-sans text-sm text-white/40 m-0 mt-1.5">Gestioná tu suscripción y el uso mensual</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px]">

        {/* Plan actual */}
        <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="font-sans text-sm font-semibold text-white">Plan actual</div>
            <div className={`px-3 py-1 rounded-full font-sans text-[11px] font-bold ${isPro ? 'bg-[#E8673A] text-white' : 'bg-white/[0.06] text-white/50'}`}>
              {isPro ? '⚡ Pro' : 'Starter'}
            </div>
          </div>

          {isPro ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(232,103,58,0.12)' }}>
                  <span className="text-[16px]">♾️</span>
                </div>
                <div>
                  <div className="font-sans text-[13px] font-semibold text-white">Turnos ilimitados</div>
                  <div className="font-sans text-[11px] text-white/35">Sin límite mensual</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(232,103,58,0.12)' }}>
                  <span className="text-[16px]">✓</span>
                </div>
                <div>
                  <div className="font-sans text-[13px] font-semibold text-white">Badge verificado</div>
                  <div className="font-sans text-[11px] text-white/35">Visible en tu perfil público</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(232,103,58,0.12)' }}>
                  <span className="text-[16px]">📣</span>
                </div>
                <div>
                  <div className="font-sans text-[13px] font-semibold text-white">Publicidad en redes</div>
                  <div className="font-sans text-[11px] text-white/35">Instagram y Facebook mensual</div>
                </div>
              </div>
              {proveedor.planVence && (
                <div className="mt-2 pt-4 border-t border-white/[0.05] font-sans text-[12px] text-white/35">
                  Próxima renovación: {new Date(proveedor.planVence).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-sans text-[12px] text-white/50">Turnos este mes</div>
                  <div className="font-sans text-[13px] font-bold tabular-nums" style={{ color: turnosMes >= FREE_LIMIT ? '#E8673A' : 'white' }}>
                    {turnosMes} / {FREE_LIMIT}
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${usoPct}%`,
                      background: (usoPct ?? 0) >= 90 ? '#E8673A' : (usoPct ?? 0) >= 70 ? '#FBBF24' : '#34D399',
                    }}
                  />
                </div>
                {turnosMes >= FREE_LIMIT && (
                  <div className="mt-2 font-sans text-[12px] text-[#E8673A]">Límite alcanzado — los clientes no pueden reservar</div>
                )}
              </div>
              <div className="font-sans text-[12px] text-white/30">
                Se reinicia en {diasHastaRenovacion} {diasHastaRenovacion === 1 ? 'día' : 'días'}
              </div>
            </div>
          )}
        </div>

        {/* Upgrade / Info card */}
        {isPro ? (
          <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="font-sans text-sm font-semibold text-white mb-1">¿Necesitás algo?</div>
              <div className="font-sans text-[13px] text-white/40 mb-5 leading-[1.5]">
                Para cambiar de plan, pausar o consultar facturación escribinos directamente.
              </div>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-sans text-[13px] font-bold no-underline transition-opacity hover:opacity-85"
              style={{ background: '#25D366', color: 'white' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Contactar soporte
            </a>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden flex flex-col" style={{ background: '#1A1208' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #E8673A, transparent)' }}/>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="font-sans font-bold text-[32px] tracking-[-1px]" style={{ color: '#F5EDDE' }}>$14.900</span>
                <span className="font-sans text-[13px]" style={{ color: 'rgba(245,237,222,0.35)' }}>/mes</span>
              </div>
              <div className="font-sans text-[12px] mb-5" style={{ color: '#E8673A' }}>o $11.900/mes pagando el año</div>

              <div className="flex flex-col gap-2.5 flex-1 mb-6">
                {['Turnos ilimitados', 'Destacado en búsquedas', 'Badge verificado ✓', 'Publicidad en Instagram y Facebook', 'Estadísticas completas'].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(232,103,58,0.2)' }}>
                      <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#E8673A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="font-sans text-[12px]" style={{ color: 'rgba(245,237,222,0.7)' }}>{f}</span>
                  </div>
                ))}
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 text-center font-sans font-bold text-[14px] rounded-xl no-underline transition-opacity hover:opacity-85"
                style={{ background: '#E8673A', color: 'white' }}
              >
                Quiero el plan Pro →
              </a>
              <div className="font-sans text-[11px] text-center mt-2" style={{ color: 'rgba(245,237,222,0.2)' }}>
                Te contactamos en menos de 24 hs
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Link a página pública de precios */}
      <div className="mt-6">
        <a href="/precios" target="_blank" className="font-sans text-[13px] text-white/30 hover:text-white/55 transition-colors no-underline">
          Ver página de planes completa →
        </a>
      </div>
    </div>
  );
}
