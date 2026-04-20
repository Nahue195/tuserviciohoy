'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Proveedor {
  id: string; nombre: string; descripcion: string; direccion?: string | null;
  hours: string; since: number; neighborhood: string; whatsapp?: string | null; activo: boolean;
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#1C1C1C] font-sans text-[14px] text-white outline-none focus:border-[#E8673A]/50 transition-colors placeholder:text-white/20';
const labelCls = 'block font-sans text-[11px] text-white/35 uppercase tracking-[0.8px] font-semibold mb-1.5';

export function PerfilView({ proveedor: p }: { proveedor: Proveedor }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...p });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean | number) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    await fetch(`/api/proveedores/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: form.nombre, descripcion: form.descripcion, activo: form.activo }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-sans font-bold text-[28px] text-white m-0 tracking-[-0.5px]">Mi perfil público</h1>
        <p className="font-sans text-sm text-white/40 m-0 mt-1.5">Así te ven los clientes en la búsqueda</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-[860px]">
        <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4">
          <div className="font-sans text-sm font-semibold text-white">Información básica</div>

          <div>
            <label className={labelCls}>Nombre del negocio</label>
            <input value={form.nombre} onChange={e => set('nombre', e.target.value)} className={inputCls}/>
          </div>
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea rows={4} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} className={`${inputCls} resize-y`}/>
          </div>
          <div>
            <label className={labelCls}>Dirección</label>
            <input value={form.direccion ?? ''} onChange={e => set('direccion', e.target.value)} placeholder="Ej: San Martín 450" className={inputCls}/>
          </div>
          <div>
            <label className={labelCls}>WhatsApp</label>
            <input value={form.whatsapp ?? ''} onChange={e => set('whatsapp', e.target.value)} placeholder="+54 9 02392 ..." className={inputCls}/>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6">
            <div className="font-sans text-sm font-semibold text-white mb-4">Datos adicionales</div>
            <div className="flex flex-col gap-3.5">
              <div>
                <label className={labelCls}>Barrio / Zona</label>
                <input value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Horario de atención</label>
                <input value={form.hours} onChange={e => set('hours', e.target.value)} placeholder="Lun a Vie · 9:00 — 18:00" className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Año de inicio</label>
                <input type="number" value={form.since} onChange={e => set('since', Number(e.target.value))} className={inputCls}/>
              </div>
            </div>
          </div>

          <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-sans text-[13px] font-semibold text-white">Perfil activo</div>
                <div className="font-sans text-[11px] text-white/35 mt-0.5">Aparecés en la búsqueda pública</div>
              </div>
              <button
                onClick={() => set('activo', !form.activo)}
                className="w-11 h-6 rounded-full border-none cursor-pointer relative transition-colors duration-200"
                style={{ background: form.activo ? '#34D399' : 'rgba(255,255,255,0.12)' }}
              >
                <div
                  className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-200"
                  style={{ left: form.activo ? 22 : 3 }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={save}
          disabled={saving}
          className="px-5 h-10 rounded-xl bg-white text-[#0D0D0D] font-sans text-[13px] font-bold cursor-pointer border-none hover:opacity-85 transition-opacity disabled:opacity-40"
        >
          {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
