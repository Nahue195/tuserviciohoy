import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TshAvatar } from '@/components/ui/TshAvatar';
import { TshStatusPill } from '@/components/ui/TshStatusPill';

export default async function ClientesPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as { email?: string | null };

  const proveedor = await prisma.proveedor.findFirst({ where: { user: { email: user.email ?? '' } } });
  if (!proveedor) return null;

  const turnos = await prisma.turno.findMany({
    where: { proveedorId: proveedor.id },
    include: { cliente: { select: { id: true, name: true, email: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const clienteMap = new Map<string, { name: string; email: string; phone?: string | null; turnos: typeof turnos; lastTurno: (typeof turnos)[0] }>();
  for (const t of turnos) {
    const existing = clienteMap.get(t.clienteId);
    if (!existing) {
      clienteMap.set(t.clienteId, { name: t.cliente.name ?? 'Cliente', email: t.cliente.email, phone: t.cliente.phone, turnos: [t], lastTurno: t });
    } else {
      existing.turnos.push(t);
    }
  }
  const clientes = Array.from(clienteMap.values());

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-sans font-bold text-[28px] text-white m-0 tracking-[-0.5px]">
          Clientes <span className="text-[#E8673A] italic">{clientes.length}</span>
        </h1>
        <p className="font-sans text-sm text-white/40 m-0 mt-1.5">Todos los clientes que reservaron con vos</p>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-[#161616] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-3.5 border-b border-white/[0.06] font-sans text-[10px] text-white/25 uppercase tracking-[0.8px] font-bold">
          <span>Cliente</span><span>Turnos</span><span>Último turno</span><span>Estado</span>
        </div>
        {clientes.length === 0 && (
          <div className="px-5 py-10 text-center font-sans text-[13px] text-white/25">Todavía no tenés clientes registrados</div>
        )}
        {clientes.map((c, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-4 border-b border-white/[0.04] items-center last:border-0 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <TshAvatar name={c.name} seed={i % 8} size={36}/>
              <div>
                <div className="font-sans text-[13px] font-semibold text-white">{c.name}</div>
                <div className="font-sans text-[11px] text-white/35 mt-0.5">{c.email}</div>
              </div>
            </div>
            <div className="font-sans text-[22px] font-medium text-[#E8673A] tracking-[-0.3px]">{c.turnos.length}</div>
            <div className="font-sans text-[12px] text-white/50">
              {new Date(c.lastTurno.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} · {c.lastTurno.horaInicio}
            </div>
            <div><TshStatusPill status={c.lastTurno.estado}/></div>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-3">
        {clientes.length === 0 && (
          <div className="bg-[#161616] border border-white/[0.06] rounded-2xl px-5 py-10 text-center font-sans text-[13px] text-white/25">
            Todavía no tenés clientes registrados
          </div>
        )}
        {clientes.map((c, i) => (
          <div key={i} className="bg-[#161616] border border-white/[0.06] rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <TshAvatar name={c.name} seed={i % 8} size={40}/>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[14px] font-semibold text-white truncate">{c.name}</div>
                <div className="font-sans text-[11px] text-white/35 truncate">{c.email}</div>
              </div>
              <TshStatusPill status={c.lastTurno.estado}/>
            </div>
            <div className="flex gap-4 pt-3 border-t border-white/[0.05]">
              <div>
                <div className="font-sans text-[10px] text-white/25 uppercase tracking-[0.6px] font-bold mb-0.5">Turnos</div>
                <div className="font-sans text-[20px] font-bold text-[#E8673A] tracking-[-0.3px] tabular-nums">{c.turnos.length}</div>
              </div>
              <div>
                <div className="font-sans text-[10px] text-white/25 uppercase tracking-[0.6px] font-bold mb-0.5">Último turno</div>
                <div className="font-sans text-[13px] text-white/50 mt-1">
                  {new Date(c.lastTurno.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} · {c.lastTurno.horaInicio}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
