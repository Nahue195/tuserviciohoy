'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

function fmtPrice(n: number) { return `$ ${n.toLocaleString('es-AR')}`; }
function fmtDur(min: number) { return min >= 60 ? `${Math.floor(min/60)}h${min%60 ? ` ${min%60}min` : ''}` : `${min} min`; }

interface Servicio {
  id: string; nombre: string; descripcion?: string | null;
  duracion: number; precio: number; activo: boolean; orden: number;
}

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1C1C1C] font-sans text-[13px] text-white outline-none focus:border-[#E8673A]/50 transition-colors placeholder:text-white/25';

function ServiceForm({
  initial, onSave, onCancel,
}: {
  initial?: Partial<Servicio>;
  onSave: (data: { nombre: string; descripcion: string; duracion: number; precio: number }) => Promise<void>;
  onCancel: () => void;
}) {
  const [nombre, setNombre] = useState(initial?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? '');
  const [duracion, setDuracion] = useState(String(initial?.duracion ?? 30));
  const [precio, setPrecio] = useState(String(initial?.precio ?? 0));
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!nombre.trim() || Number(duracion) < 5) return;
    setSaving(true);
    await onSave({ nombre: nombre.trim(), descripcion: descripcion.trim(), duracion: Number(duracion), precio: Number(precio) });
    setSaving(false);
  };

  return (
    <div className="p-5 bg-[#1A1A1A] border border-[#E8673A]/20 rounded-2xl flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-sans text-[10px] text-white/35 uppercase tracking-[0.7px] font-bold mb-1.5">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Corte clásico" className={inputCls}/>
        </div>
        <div>
          <label className="block font-sans text-[10px] text-white/35 uppercase tracking-[0.7px] font-bold mb-1.5">Descripción</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Opcional" className={inputCls}/>
        </div>
        <div>
          <label className="block font-sans text-[10px] text-white/35 uppercase tracking-[0.7px] font-bold mb-1.5">Duración (minutos) *</label>
          <input type="number" min={5} step={5} value={duracion} onChange={e => setDuracion(e.target.value)} className={inputCls}/>
        </div>
        <div>
          <label className="block font-sans text-[10px] text-white/35 uppercase tracking-[0.7px] font-bold mb-1.5">Precio (ARS)</label>
          <input type="number" min={0} value={precio} onChange={e => setPrecio(e.target.value)} className={inputCls}/>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={submit} disabled={saving || !nombre.trim()}
          className="px-5 h-9 rounded-xl bg-[#E8673A] text-white font-sans text-[13px] font-bold border-none cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-30"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 h-9 rounded-xl border border-white/[0.1] bg-transparent text-white/50 font-sans text-[13px] font-bold cursor-pointer hover:text-white transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function ServiciosView() {
  const router = useRouter();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/servicios');
    if (res.ok) setServicios(await res.json() as Servicio[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAdd = async (data: { nombre: string; descripcion: string; duracion: number; precio: number }) => {
    const res = await fetch('/api/servicios', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (res.ok) { setShowAdd(false); await load(); router.refresh(); }
  };

  const handleEdit = async (id: string, data: { nombre: string; descripcion: string; duracion: number; precio: number }) => {
    const res = await fetch(`/api/servicios/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (res.ok) { setEditingId(null); await load(); router.refresh(); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/servicios/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    await load();
    router.refresh();
  };

  const toggleActivo = async (svc: Servicio) => {
    await fetch(`/api/servicios/${svc.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !svc.activo }),
    });
    await load();
  };

  return (
    <div>
      <div className="mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-sans font-bold text-[28px] text-white m-0 tracking-[-0.5px]">
            Servicios y precios
          </h1>
          <p className="font-sans text-sm text-white/40 m-0 mt-1.5">Los servicios que ofrecés aparecen en tu perfil y en el flujo de reserva</p>
        </div>
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 h-9 rounded-xl bg-[#E8673A] text-white font-sans text-[13px] font-bold border-none cursor-pointer hover:opacity-85 transition-opacity shrink-0"
          >
            <span className="text-[18px] leading-none">+</span> Nuevo servicio
          </button>
        )}
      </div>

      {showAdd && (
        <div className="mb-4">
          <ServiceForm onSave={handleAdd} onCancel={() => setShowAdd(false)}/>
        </div>
      )}

      {loading ? (
        <div className="font-sans text-[13px] text-white/30 py-8">Cargando…</div>
      ) : servicios.length === 0 && !showAdd ? (
        <div className="bg-[#161616] border border-white/[0.06] rounded-2xl px-5 py-12 text-center">
          <div className="font-sans text-[36px] mb-3">🛠️</div>
          <div className="font-sans font-semibold text-[15px] text-white mb-1.5">Todavía no cargaste servicios</div>
          <div className="font-sans text-[13px] text-white/35 mb-5">Agregá tus servicios para que los clientes sepan qué ofrecés y a qué precio</div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-5 h-9 rounded-xl bg-[#E8673A] text-white font-sans text-[13px] font-bold border-none cursor-pointer hover:opacity-85 transition-opacity"
          >
            + Agregar primer servicio
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {servicios.map(svc => (
            <div key={svc.id}>
              {editingId === svc.id ? (
                <ServiceForm
                  initial={svc}
                  onSave={data => handleEdit(svc.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className={`bg-[#161616] border rounded-2xl p-5 transition-all ${svc.activo ? 'border-white/[0.06]' : 'border-white/[0.03] opacity-50'}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-sans font-semibold text-[15px] text-white">{svc.nombre}</span>
                        {!svc.activo && (
                          <span className="px-2 py-0.5 rounded-full bg-white/[0.06] font-sans text-[10px] text-white/35 font-bold uppercase tracking-[0.5px]">Inactivo</span>
                        )}
                      </div>
                      {svc.descripcion && (
                        <div className="font-sans text-[12px] text-white/40 mt-0.5 truncate">{svc.descripcion}</div>
                      )}
                      <div className="flex items-center gap-4 mt-2.5">
                        <div>
                          <span className="font-sans text-[10px] text-white/25 uppercase tracking-[0.6px] font-bold">Duración</span>
                          <div className="font-sans text-[13px] text-white/70 font-medium mt-0.5">{fmtDur(svc.duracion)}</div>
                        </div>
                        <div>
                          <span className="font-sans text-[10px] text-white/25 uppercase tracking-[0.6px] font-bold">Precio</span>
                          <div className="font-sans text-[15px] text-[#E8673A] font-bold mt-0.5 tabular-nums">{fmtPrice(svc.precio)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Toggle activo */}
                      <button
                        onClick={() => toggleActivo(svc)}
                        title={svc.activo ? 'Desactivar' : 'Activar'}
                        className="w-8 h-8 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer flex items-center justify-center hover:bg-white/[0.04] transition-colors"
                      >
                        <span className="text-[14px]">{svc.activo ? '👁️' : '🚫'}</span>
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => setEditingId(svc.id)}
                        className="w-8 h-8 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer flex items-center justify-center hover:bg-white/[0.04] transition-colors font-sans text-[12px] text-white/50 hover:text-white"
                      >
                        ✏️
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(svc.id)}
                        disabled={deletingId === svc.id}
                        className="w-8 h-8 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/20 transition-colors font-sans text-[12px] text-white/30 hover:text-red-400 disabled:opacity-30"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
