'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface DiasDisp { id: string; diaSemana: number; horaInicio: string; horaFin: string; intervaloMinutos: number }
interface Perfil {
  nombre: string;
  descripcion: string;
  direccion: string;
  neighborhood: string;
  whatsapp: string;
  hours: string;
  precioDesde: number;
  tags: string[];
}
interface Props {
  proveedorId: string;
  perfil: Perfil;
  disponibilidad: DiasDisp[];
}

const fieldCls = 'w-full px-3 py-2.5 rounded-lg border border-white/[0.08] bg-[#1C1C1C] font-sans text-[13px] text-white outline-none focus:border-[#E8673A]/50 transition-colors placeholder:text-white/20';
const labelCls = 'font-sans text-[12px] font-semibold text-white/50 uppercase tracking-wider mb-1.5 block';

export function ConfiguracionView({ proveedorId, perfil: initialPerfil, disponibilidad: initialDisp }: Props) {
  const router = useRouter();

  // Perfil state
  const [perfil, setPerfil] = useState<Perfil>(initialPerfil);
  const [tagsInput, setTagsInput] = useState(initialPerfil.tags.join(', '));
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [savedPerfil, setSavedPerfil] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState('');

  // Disponibilidad state
  const [disps, setDisps] = useState<DiasDisp[]>(initialDisp);
  const [savingDisp, setSavingDisp] = useState(false);
  const [savedDisp, setSavedDisp] = useState(false);

  const activeDays = new Set(disps.map(d => d.diaSemana));

  const toggleDay = (dia: number) => {
    if (activeDays.has(dia)) {
      setDisps(disps.filter(d => d.diaSemana !== dia));
    } else {
      setDisps([...disps, { id: `new-${dia}`, diaSemana: dia, horaInicio: '09:00', horaFin: '18:00', intervaloMinutos: 30 }].sort((a, b) => a.diaSemana - b.diaSemana));
    }
  };

  const updateDisp = (dia: number, field: keyof DiasDisp, value: string | number) => {
    setDisps(disps.map(d => d.diaSemana === dia ? { ...d, [field]: value } : d));
  };

  const savePerfil = async () => {
    setErrorPerfil('');
    if (!perfil.nombre.trim()) { setErrorPerfil('El nombre es obligatorio'); return; }
    setSavingPerfil(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const res = await fetch(`/api/proveedores/${proveedorId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...perfil, tags, precioDesde: Number(perfil.precioDesde) }),
    });
    setSavingPerfil(false);
    if (res.ok) {
      setSavedPerfil(true);
      setTimeout(() => { setSavedPerfil(false); router.refresh(); }, 1800);
    } else {
      setErrorPerfil('Error al guardar. Intentá de nuevo.');
    }
  };

  const saveDisp = async () => {
    setSavingDisp(true);
    await fetch(`/api/proveedores/${proveedorId}/disponibilidad`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disponibilidad: disps }),
    });
    setSavingDisp(false);
    setSavedDisp(true);
    setTimeout(() => { setSavedDisp(false); router.refresh(); }, 1500);
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-sans font-bold text-[28px] text-white m-0 tracking-[-0.5px]">Configuración</h1>
        <p className="font-sans text-sm text-white/40 m-0 mt-1.5">Administrá tu perfil y disponibilidad</p>
      </div>

      {/* Perfil */}
      <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6 max-w-[680px] mb-5">
        <div className="font-sans text-sm font-semibold text-white mb-5">Información del negocio</div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelCls}>Nombre del negocio</label>
            <input
              className={fieldCls}
              value={perfil.nombre}
              onChange={e => setPerfil(p => ({ ...p, nombre: e.target.value }))}
              placeholder="Ej: Peluquería Miguel"
            />
          </div>

          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              className={`${fieldCls} resize-none h-[88px]`}
              value={perfil.descripcion}
              onChange={e => setPerfil(p => ({ ...p, descripcion: e.target.value }))}
              placeholder="Contá brevemente qué ofrecés…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Dirección</label>
              <input
                className={fieldCls}
                value={perfil.direccion}
                onChange={e => setPerfil(p => ({ ...p, direccion: e.target.value }))}
                placeholder="Ej: Av. Siempreviva 742"
              />
            </div>
            <div>
              <label className={labelCls}>Barrio / Zona</label>
              <input
                className={fieldCls}
                value={perfil.neighborhood}
                onChange={e => setPerfil(p => ({ ...p, neighborhood: e.target.value }))}
                placeholder="Ej: Palermo"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>WhatsApp</label>
              <input
                className={fieldCls}
                value={perfil.whatsapp}
                onChange={e => setPerfil(p => ({ ...p, whatsapp: e.target.value }))}
                placeholder="Ej: 5491112345678"
              />
            </div>
            <div>
              <label className={labelCls}>Precio desde ($)</label>
              <input
                type="number"
                className={fieldCls}
                value={perfil.precioDesde}
                onChange={e => setPerfil(p => ({ ...p, precioDesde: Number(e.target.value) }))}
                placeholder="Ej: 5000"
                min={0}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Horario de atención (texto)</label>
            <input
              className={fieldCls}
              value={perfil.hours}
              onChange={e => setPerfil(p => ({ ...p, hours: e.target.value }))}
              placeholder="Ej: Lun–Vie 9–18hs, Sáb 9–13hs"
            />
          </div>

          <div>
            <label className={labelCls}>Tags (separados por coma)</label>
            <input
              className={fieldCls}
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Ej: corte, coloración, keratina"
            />
            <p className="font-sans text-[11px] text-white/25 mt-1.5 m-0">Palabras clave que describen tus servicios</p>
          </div>
        </div>

        {errorPerfil && (
          <p className="font-sans text-[13px] text-red-400 mt-4 m-0">{errorPerfil}</p>
        )}

        <div className="mt-5">
          <button
            onClick={savePerfil}
            disabled={savingPerfil}
            className="px-5 h-10 rounded-xl bg-white text-[#0D0D0D] font-sans text-[13px] font-bold cursor-pointer border-none hover:opacity-85 transition-opacity disabled:opacity-40"
          >
            {savingPerfil ? 'Guardando…' : savedPerfil ? '✓ Guardado' : 'Guardar perfil'}
          </button>
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-6 max-w-[680px]">
        <div className="font-sans text-sm font-semibold text-white mb-5">Disponibilidad semanal</div>

        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6, 0].map(dia => {
            const active = activeDays.has(dia);
            const disp = disps.find(d => d.diaSemana === dia);
            return (
              <div
                key={dia}
                className="px-4 py-3 rounded-xl border transition-all duration-[140ms]"
                style={{
                  border: `1px solid ${active ? 'rgba(232,103,58,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  background: active ? 'rgba(232,103,58,0.05)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => toggleDay(dia)}
                    className="w-5 h-5 rounded-[5px] border cursor-pointer shrink-0 flex items-center justify-center transition-all"
                    style={{
                      border: `1.5px solid ${active ? '#E8673A' : 'rgba(255,255,255,0.2)'}`,
                      background: active ? '#E8673A' : 'transparent',
                    }}
                  >
                    {active && <span className="text-white text-[11px] font-bold leading-none">✓</span>}
                  </button>
                  <span className="font-sans text-[13px] font-semibold text-white min-w-[90px]">{DIAS[dia]}</span>
                  {active && disp && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <input type="time" value={disp.horaInicio} onChange={e => updateDisp(dia, 'horaInicio', e.target.value)} className="px-3 py-2 rounded-lg border border-white/[0.08] bg-[#1C1C1C] font-sans text-[13px] text-white outline-none focus:border-[#E8673A]/50 transition-colors" />
                      <span className="font-sans text-[12px] text-white/30">a</span>
                      <input type="time" value={disp.horaFin} onChange={e => updateDisp(dia, 'horaFin', e.target.value)} className="px-3 py-2 rounded-lg border border-white/[0.08] bg-[#1C1C1C] font-sans text-[13px] text-white outline-none focus:border-[#E8673A]/50 transition-colors" />
                      <select value={disp.intervaloMinutos} onChange={e => updateDisp(dia, 'intervaloMinutos', Number(e.target.value))} className="px-3 py-2 rounded-lg border border-white/[0.08] bg-[#1C1C1C] font-sans text-[13px] text-white outline-none focus:border-[#E8673A]/50 transition-colors">
                        <option value={15}>c/15 min</option>
                        <option value={30}>c/30 min</option>
                        <option value={45}>c/45 min</option>
                        <option value={60}>c/60 min</option>
                      </select>
                    </div>
                  )}
                  {!active && <span className="font-sans text-[12px] text-white/20">No disponible</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <button
            onClick={saveDisp}
            disabled={savingDisp}
            className="px-5 h-10 rounded-xl bg-white text-[#0D0D0D] font-sans text-[13px] font-bold cursor-pointer border-none hover:opacity-85 transition-opacity disabled:opacity-40"
          >
            {savingDisp ? 'Guardando…' : savedDisp ? '✓ Guardado' : 'Guardar disponibilidad'}
          </button>
        </div>
      </div>
    </div>
  );
}
