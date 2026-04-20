'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Categoria { id: string; nombre: string; icono: string }

const ICONO_EMOJI: Record<string, string> = {
  scissors: '✂️', heart: '❤️', scale: '⚖️', wrench: '🔧',
  paw: '🐾', book: '📚', lotus: '🪷', car: '🚗',
};

const inputCls = 'w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-[#1C1C1C] font-sans text-[14px] text-white outline-none focus:border-[#E8673A]/50 transition-colors placeholder:text-white/20';
const labelCls = 'block font-sans text-[11px] text-white/35 uppercase tracking-[0.8px] font-bold mb-1.5';

export function RegistrarNegocioForm({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', categoriaId: '', direccion: '',
    neighborhood: 'Centro', hours: 'Lun a Vie · 9:00 — 18:00',
    precioDesde: 0, whatsapp: '', tags: [] as string[], since: new Date().getFullYear(),
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));
  const addTag = () => { const t = newTag.trim(); if (t && !form.tags.includes(t)) { set('tags', [...form.tags, t]); setNewTag(''); } };
  const removeTag = (t: string) => set('tags', form.tags.filter(x => x !== t));

  const submit = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error ?? 'Error'); }
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
      setLoading(false);
    }
  };

  const stepTitles = ['Información básica', 'Ubicación y horarios', 'Tus servicios'];
  const canContinue = step === 1 ? !!(form.nombre && form.descripcion && form.categoriaId && form.precioDesde) : true;

  return (
    <div className="bg-[#0D0D0D] min-h-screen flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[520px]">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <svg width="26" height="33" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
            <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex flex-col leading-[1.1]">
            <span className="font-sans font-bold text-[11px] text-white">Tu</span>
            <span className="font-sans font-bold text-[15px] tracking-[-0.2px]">
              <span className="text-[#E8673A]">Servicio</span><span className="text-white">Hoy</span>
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="font-sans font-bold text-[28px] text-white tracking-[-0.5px] m-0">
            Registrá tu negocio
          </h1>
          <p className="font-sans text-[14px] text-white/40 mt-2 m-0">En 3 pasos estás listo para recibir turnos</p>

          {/* Steps */}
          <div className="flex items-center gap-2 justify-center mt-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full font-sans text-[12px] font-bold transition-all duration-200"
                  style={{
                    background: n < step ? '#E8673A' : n === step ? 'rgba(232,103,58,0.15)' : 'rgba(255,255,255,0.05)',
                    color: n <= step ? '#E8673A' : 'rgba(255,255,255,0.25)',
                    border: `1.5px solid ${n <= step ? '#E8673A' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {n < step ? '✓' : n}
                </div>
                {n < 3 && <div className="w-8 h-px" style={{ background: n < step ? '#E8673A' : 'rgba(255,255,255,0.08)' }}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#161616] border border-white/[0.06] rounded-3xl p-7">
          <div className="font-sans font-bold text-[18px] text-white tracking-[-0.3px] mb-5">
            {stepTitles[step - 1]}
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Nombre del negocio *</label>
                <input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej: Peluquería Doña Marta" className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Descripción *</label>
                <textarea rows={3} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Contale a tus clientes qué hacés…" className={`${inputCls} resize-y`}/>
              </div>
              <div>
                <label className={labelCls}>Categoría *</label>
                <select value={form.categoriaId} onChange={e => set('categoriaId', e.target.value)}
                  className={`${inputCls} appearance-none`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                >
                  <option value="">Seleccioná una categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{ICONO_EMOJI[c.icono] ?? '•'} {c.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Precio desde (ARS) *</label>
                <input type="number" min={0} value={form.precioDesde || ''} onChange={e => set('precioDesde', Number(e.target.value))} placeholder="Ej: 2000" className={inputCls}/>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Barrio / Zona</label>
                <input value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} placeholder="Centro" className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Dirección</label>
                <input value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Ej: San Martín 450" className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Horario de atención</label>
                <input value={form.hours} onChange={e => set('hours', e.target.value)} placeholder="Lun a Vie · 9:00 — 18:00" className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>WhatsApp</label>
                <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+54 9 02392 ..." className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Año de inicio</label>
                <input type="number" value={form.since} onChange={e => set('since', Number(e.target.value))} className={inputCls}/>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <p className="font-sans text-[13px] text-white/40 m-0">Agregá los servicios que ofrecés. Los clientes los verán en tu perfil.</p>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {form.tags.length === 0 && <span className="font-sans text-[12px] text-white/20">Sin servicios todavía</span>}
                {form.tags.map(t => (
                  <div key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] font-sans text-[12px] font-semibold text-white/80">
                    {t}
                    <button onClick={() => removeTag(t)} className="bg-transparent border-none cursor-pointer text-white/40 hover:text-white/80 p-0 leading-none text-base transition-colors">×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  placeholder="Ej: Corte, Color, Peinado…"
                  className={`${inputCls} flex-1`}
                />
                <button onClick={addTag} className="px-4 rounded-xl bg-[#E8673A] border-none cursor-pointer text-white font-sans text-lg font-bold hover:opacity-80 transition-opacity">+</button>
              </div>
              {error && (
                <div className="px-4 py-3 bg-[#E8673A]/10 border border-[#E8673A]/20 rounded-xl font-sans text-[13px] text-[#E8673A]">{error}</div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2.5 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 h-11 rounded-xl border border-white/[0.08] bg-transparent text-white/60 font-sans text-[14px] font-semibold cursor-pointer hover:bg-white/[0.04] hover:text-white transition-all"
              >
                Atrás
              </button>
            )}
            <button
              onClick={step < 3 ? () => setStep(step + 1) : submit}
              disabled={!canContinue || loading}
              className="flex-1 h-11 rounded-xl bg-[#E8673A] text-white font-sans text-[14px] font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed border-none"
            >
              {loading ? 'Creando tu perfil…' : step < 3 ? 'Continuar' : 'Crear mi perfil →'}
            </button>
          </div>
        </div>

        <div className="text-center mt-5">
          <a href="/" className="font-sans text-[13px] text-white/30 no-underline hover:text-white/55 transition-colors">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
