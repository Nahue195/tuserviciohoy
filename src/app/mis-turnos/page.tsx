'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TshNavBar } from '@/components/ui/TshNavBar';
import { TshStatusPill } from '@/components/ui/TshStatusPill';

interface Resena { id: string; rating: number }

interface Turno {
  id: string; fecha: string; horaInicio: string; horaFin: string;
  estado: string; servicio: string | null; precio: number | null; codigo: string; notas: string | null;
  proveedor: { nombre: string; neighborhood: string; direccion: string | null; categoria: { nombre: string; color: string } };
  resena?: Resena | null;
}

/* ─── Star picker ─────────────────────────────────────────────────────────── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="border-none bg-transparent cursor-pointer p-0.5 transition-transform hover:scale-110"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={(hover || value) >= n ? '#E8673A' : 'none'} stroke={(hover || value) >= n ? '#E8673A' : '#D5C9B5'} strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

/* ─── Review form ─────────────────────────────────────────────────────────── */
function ResenaForm({ turnoId, proveedorNombre, clienteEmail, onDone }: {
  turnoId: string; proveedorNombre: string; clienteEmail?: string; onDone: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (rating === 0) { setError('Elegí una puntuación'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turnoId, rating, comentario: comentario.trim() || undefined, clienteEmail }),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error ?? 'Error'); }
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally { setSaving(false); }
  };

  return (
    <div className="mt-3 pt-4 border-t border-[#EFE5D0]">
      <div className="font-sans text-[12px] font-semibold text-ink mb-3">¿Cómo estuvo tu experiencia con {proveedorNombre}?</div>
      <StarPicker value={rating} onChange={setRating}/>
      <textarea
        value={comentario}
        onChange={e => setComentario(e.target.value)}
        rows={2}
        placeholder="Contanos cómo fue (opcional)"
        className="w-full mt-3 px-3.5 py-2.5 rounded-xl border border-[#E5D9C2] bg-[#FFFBF3] font-sans text-[13px] text-ink outline-none resize-none focus:border-terra/50 transition-colors placeholder:text-[#C9BDA5]"
      />
      {error && <div className="font-sans text-[12px] text-terra mt-1">{error}</div>}
      <div className="flex gap-2 mt-3">
        <button onClick={submit} disabled={saving || rating === 0}
          className="px-4 h-9 rounded-xl font-sans text-[13px] font-bold border-none cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-30"
          style={{ background: '#E8673A', color: 'white' }}>
          {saving ? 'Enviando…' : 'Enviar reseña'}
        </button>
        <button onClick={onDone}
          className="px-4 h-9 rounded-xl font-sans text-[13px] border border-[#E5D9C2] bg-transparent text-[#8B7D6B] cursor-pointer hover:text-ink transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* ─── Turno card ──────────────────────────────────────────────────────────── */
function TurnoCard({ t, upcoming = false, clienteEmail, onCancelled }: { t: Turno; upcoming?: boolean; clienteEmail?: string; onCancelled?: (id: string) => void }) {
  const [showResena, setShowResena] = useState(false);
  const [resenaEnviada, setResenaEnviada] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const fecha = new Date(t.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const cat = t.proveedor.categoria;
  const puedeResenar = t.estado === 'COMPLETADO' && !t.resena && !resenaEnviada;
  const puedeCancelar = upcoming && (t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO');

  const cancelar = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/turnos/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'CANCELADO', guestEmail: clienteEmail }),
      });
      if (res.ok) onCancelled?.(t.id);
    } finally { setCancelling(false); setConfirmCancel(false); }
  };

  return (
    <div className={`bg-paper border rounded-2xl overflow-hidden transition-all ${upcoming ? 'border-[#E5D9C2] shadow-[0_2px_12px_rgba(42,36,32,0.07)]' : 'border-[#EFE5D0] opacity-80'}`}>
      {upcoming && <div className="h-1 w-full" style={{ background: cat.color }}/>}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="font-sans font-bold text-[16px] text-ink tracking-[-0.3px]">{t.proveedor.nombre}</div>
            <div className="font-sans text-[12px] mt-0.5" style={{ color: cat.color }}>{cat.nombre} · {t.proveedor.neighborhood}</div>
          </div>
          <TshStatusPill status={t.estado}/>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 py-3 border-t border-b border-[#EFE5D0] mb-3">
          <div>
            <div className="font-sans text-[10px] text-[#8B7D6B] uppercase tracking-[0.6px] font-bold mb-0.5">Fecha</div>
            <div className="font-sans font-semibold text-[13px] text-ink capitalize">{fecha}</div>
          </div>
          <div>
            <div className="font-sans text-[10px] text-[#8B7D6B] uppercase tracking-[0.6px] font-bold mb-0.5">Horario</div>
            <div className="font-sans font-semibold text-[13px] text-ink tabular-nums">{t.horaInicio} – {t.horaFin}</div>
          </div>
          {t.servicio && (
            <div>
              <div className="font-sans text-[10px] text-[#8B7D6B] uppercase tracking-[0.6px] font-bold mb-0.5">Servicio</div>
              <div className="font-sans font-semibold text-[13px] text-ink">{t.servicio}</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-[11px] text-[#8B7D6B]">Código:</span>
            <span className="font-mono text-[12px] font-bold text-terra tracking-[1px]">{t.codigo.slice(0, 8).toUpperCase()}</span>
          </div>
          {t.precio && (
            <div className="font-sans font-bold text-[14px] text-ink">$ {t.precio.toLocaleString('es-AR')}</div>
          )}
        </div>

        {t.proveedor.direccion && upcoming && (
          <div className="mt-3 pt-3 border-t border-[#EFE5D0] font-sans text-[12px] text-[#5C5048]">
            📍 {t.proveedor.direccion}
          </div>
        )}

        {/* Reseña existente */}
        {t.resena && (
          <div className="mt-3 pt-3 border-t border-[#EFE5D0] flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: t.resena.rating }).map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#E8673A"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
            <span className="font-sans text-[12px] text-[#8B7D6B]">Tu reseña fue enviada</span>
          </div>
        )}

        {/* Reseña enviada ahora */}
        {resenaEnviada && (
          <div className="mt-3 pt-3 border-t border-[#EFE5D0] font-sans text-[12px] text-[#0F6E4E] font-semibold">
            ✓ ¡Gracias por tu reseña!
          </div>
        )}

        {/* Cancelar turno */}
        {puedeCancelar && !confirmCancel && (
          <div className="mt-3 pt-3 border-t border-[#EFE5D0]">
            <button onClick={() => setConfirmCancel(true)}
              className="font-sans text-[13px] text-[#8B7D6B] cursor-pointer border-none bg-transparent p-0 hover:text-terra transition-colors">
              Cancelar turno
            </button>
          </div>
        )}
        {puedeCancelar && confirmCancel && (
          <div className="mt-3 pt-3 border-t border-[#EFE5D0]">
            <div className="font-sans text-[13px] font-semibold text-ink mb-3">¿Cancelar este turno?</div>
            <div className="flex gap-2">
              <button onClick={cancelar} disabled={cancelling}
                className="px-4 h-9 rounded-xl font-sans text-[13px] font-bold border-none cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-40"
                style={{ background: '#E8673A', color: 'white' }}>
                {cancelling ? 'Cancelando…' : 'Sí, cancelar'}
              </button>
              <button onClick={() => setConfirmCancel(false)}
                className="px-4 h-9 rounded-xl font-sans text-[13px] border border-[#E5D9C2] bg-transparent text-[#8B7D6B] cursor-pointer hover:text-ink transition-colors">
                Volver
              </button>
            </div>
          </div>
        )}

        {/* CTA dejar reseña */}
        {puedeResenar && !showResena && (
          <div className="mt-3 pt-3 border-t border-[#EFE5D0]">
            <button onClick={() => setShowResena(true)}
              className="font-sans text-[13px] font-semibold text-terra cursor-pointer border-none bg-transparent p-0 hover:opacity-70 transition-opacity">
              ⭐ Dejar una reseña
            </button>
          </div>
        )}

        {/* Formulario reseña */}
        {puedeResenar && showResena && (
          <ResenaForm
            turnoId={t.id}
            proveedorNombre={t.proveedor.nombre}
            clienteEmail={clienteEmail}
            onDone={() => { setShowResena(false); setResenaEnviada(true); }}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Lookup form ─────────────────────────────────────────────────────────── */
function LookupForm({ onResults }: { onResults: (turnos: Turno[], email?: string) => void }) {
  const [mode, setMode] = useState<'email' | 'codigo'>('email');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const search = async () => {
    const v = value.trim();
    if (!v) return;
    setLoading(true); setError(''); setSearched(false);
    try {
      const param = mode === 'email' ? `email=${encodeURIComponent(v)}` : `codigo=${encodeURIComponent(v)}`;
      const res = await fetch(`/api/turnos/lookup?${param}`);
      if (!res.ok) throw new Error('Error al buscar');
      const data = await res.json() as Turno[];
      onResults(data, mode === 'email' ? v : undefined);
      setSearched(true);
    } catch {
      setError('Ocurrió un error. Intentá de nuevo.');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-paper border border-[#EFE5D0] rounded-2xl p-6 md:p-8">
      <div className="mb-6">
        <div className="font-sans font-bold text-[18px] text-ink mb-1.5 tracking-[-0.3px]">Buscá tus turnos</div>
        <div className="font-sans text-[13px] text-[#8B7D6B]">Ingresá tu email o el código de confirmación que recibiste</div>
      </div>

      <div className="flex gap-2 mb-4 p-1 bg-[#F0E8D6] rounded-xl w-fit">
        {(['email', 'codigo'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setValue(''); setError(''); setSearched(false); }}
            className="px-4 py-2 rounded-lg font-sans text-[12px] font-bold border-none cursor-pointer transition-all"
            style={{ background: mode === m ? 'white' : 'transparent', color: mode === m ? '#1A1208' : '#8B7D6B', boxShadow: mode === m ? '0 1px 3px rgba(42,36,32,0.1)' : 'none' }}>
            {m === 'email' ? 'Por email' : 'Por código'}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()}
          placeholder={mode === 'email' ? 'tu@email.com' : 'Código de confirmación'}
          className="flex-1 px-4 py-3 rounded-xl border border-[#E5D9C2] bg-[#FFFBF3] font-sans text-[14px] text-ink outline-none focus:border-terra/50 transition-colors placeholder:text-[#C9BDA5]"
        />
        <button onClick={search} disabled={loading || !value.trim()}
          className="px-5 h-12 rounded-xl bg-terra text-paper font-sans text-[14px] font-bold border-none cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-30">
          {loading ? '…' : 'Buscar'}
        </button>
      </div>

      {error && <div className="mt-3 font-sans text-[13px] text-terra">{error}</div>}
      {searched && <div className="mt-3 font-sans text-[12px] text-[#8B7D6B]">Búsqueda completada. Los resultados aparecen abajo.</div>}

      <div className="mt-5 pt-5 border-t border-[#EFE5D0]">
        <a href="/auth/login" className="font-sans text-[13px] text-terra hover:opacity-70 transition-opacity no-underline font-semibold">
          Iniciá sesión para ver todos tus turnos →
        </a>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function MisTurnosPage() {
  const { data: session, status } = useSession();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [lookupResults, setLookupResults] = useState<Turno[] | null>(null);
  const [lookupEmail, setLookupEmail] = useState<string | undefined>();

  const handleCancelled = (id: string) => {
    setTurnos(prev => prev.map(t => t.id === id ? { ...t, estado: 'CANCELADO' } : t));
    setLookupResults(prev => prev ? prev.map(t => t.id === id ? { ...t, estado: 'CANCELADO' } : t) : prev);
  };

  const isLoggedIn = status === 'authenticated';
  const sessionEmail = (session?.user as { email?: string })?.email;

  useEffect(() => {
    if (isLoggedIn && !hasFetched) {
      setLoadingTurnos(true);
      fetch('/api/turnos/mis-turnos')
        .then(r => r.ok ? r.json() as Promise<Turno[]> : Promise.resolve([]))
        .then(data => { setTurnos(data); setHasFetched(true); setLoadingTurnos(false); })
        .catch(() => setLoadingTurnos(false));
    }
  }, [isLoggedIn, hasFetched]);

  const now = new Date();
  const proximos = turnos.filter(t => new Date(t.fecha) >= now && t.estado !== 'CANCELADO');
  const pasados = turnos.filter(t => new Date(t.fecha) < now || t.estado === 'CANCELADO');

  return (
    <div className="min-h-screen bg-cream">
      <TshNavBar city="Argentina"/>
      <div className="max-w-[680px] mx-auto px-4 md:px-5 py-6 md:py-10">
        <div className="mb-8">
          <h1 className="font-sans font-bold text-[30px] text-ink m-0 tracking-[-0.6px]">Mis turnos</h1>
          <p className="font-sans text-sm text-[#8B7D6B] m-0 mt-1.5">
            {isLoggedIn ? 'Todos tus turnos agendados' : 'Encontrá tus turnos sin iniciar sesión'}
          </p>
        </div>

        {status === 'loading' && <div className="font-sans text-[13px] text-[#8B7D6B] py-8">Cargando…</div>}

        {status !== 'loading' && !isLoggedIn && (
          <div className="flex flex-col gap-6">
            <LookupForm onResults={(results, email) => { setLookupResults(results); setLookupEmail(email); }}/>
            {lookupResults !== null && (
              <div>
                <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[0.8px] font-bold mb-3">
                  Resultados ({lookupResults.length})
                </div>
                {lookupResults.length === 0 ? (
                  <div className="bg-paper border border-[#EFE5D0] rounded-2xl p-8 text-center">
                    <div className="font-sans font-semibold text-[15px] text-ink mb-1">No encontramos turnos</div>
                    <div className="font-sans text-[13px] text-[#8B7D6B]">Verificá el email o código ingresado</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {lookupResults.map(t => <TurnoCard key={t.id} t={t} clienteEmail={lookupEmail} upcoming={new Date(t.fecha) >= now && t.estado !== 'CANCELADO'} onCancelled={handleCancelled}/>)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {isLoggedIn && loadingTurnos && <div className="font-sans text-[13px] text-[#8B7D6B] py-8">Cargando tus turnos…</div>}

        {isLoggedIn && !loadingTurnos && hasFetched && (
          <>
            {turnos.length === 0 && (
              <div className="bg-paper border border-[#EFE5D0] rounded-2xl p-10 text-center">
                <div className="text-4xl mb-4">📅</div>
                <div className="font-sans font-semibold text-[17px] text-ink mb-2">No tenés turnos todavía</div>
                <div className="font-sans text-sm text-[#8B7D6B] mb-6">Buscá un servicio y reservá tu primer turno</div>
                <a href="/buscar" className="inline-block px-6 py-3 bg-terra text-paper font-sans font-bold text-sm rounded-xl no-underline hover:opacity-90 transition-opacity">
                  Explorar servicios
                </a>
              </div>
            )}
            {proximos.length > 0 && (
              <div className="mb-8">
                <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[0.8px] font-bold mb-3">Próximos</div>
                <div className="flex flex-col gap-3">
                  {proximos.map(t => <TurnoCard key={t.id} t={t} upcoming clienteEmail={sessionEmail} onCancelled={handleCancelled}/>)}
                </div>
              </div>
            )}
            {pasados.length > 0 && (
              <div>
                <div className="font-sans text-[11px] text-[#8B7D6B] uppercase tracking-[0.8px] font-bold mb-3">Historial</div>
                <div className="flex flex-col gap-3">
                  {pasados.map(t => <TurnoCard key={t.id} t={t} clienteEmail={sessionEmail}/>)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
