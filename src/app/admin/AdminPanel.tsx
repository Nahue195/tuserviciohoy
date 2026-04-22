'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Proveedor {
  id: string;
  nombre: string;
  plan: 'FREE' | 'PRO';
  planVence: string | null;
  activo: boolean;
  createdAt: string;
  categoria: { nombre: string; color: string };
  _count: { turnos: number };
}

interface Stats {
  totalProveedores: number;
  proCount: number;
  freeCount: number;
  totalUsers: number;
  totalTurnos: number;
}

const inp = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
  color: 'white', fontFamily: 'var(--font-geist-sans), sans-serif',
  fontSize: 14, outline: 'none',
} as const;

export function AdminPanel({ secret }: { secret: string }) {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/stats', {
      headers: { authorization: `Bearer ${secret}` },
    });
    if (res.ok) {
      const data = await res.json() as { stats: Stats; proveedores: Proveedor[] };
      setStats(data.stats);
      setProveedores(data.proveedores);
    }
    setLoading(false);
  }, [secret]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const togglePlan = async (p: Proveedor) => {
    setToggling(p.id);
    await fetch('/api/admin/plan', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${secret}` },
      body: JSON.stringify({ proveedorId: p.id, plan: p.plan === 'PRO' ? 'FREE' : 'PRO', meses: 1 }),
    });
    await fetchData();
    setToggling(null);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.refresh();
  };

  const filtered = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <svg width="20" height="25" viewBox="0 0 28 36" fill="none">
                <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
                <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 20, fontWeight: 800, color: 'white' }}>
                Panel Admin
              </span>
            </div>
            <p style={{ margin: 0, fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              TuServicioHoy · Gestión interna
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 36 }}>
            {[
              { label: 'Proveedores', value: stats.totalProveedores, accent: false },
              { label: 'Plan PRO', value: stats.proCount, accent: true },
              { label: 'Plan Free', value: stats.freeCount, accent: false },
              { label: 'Usuarios', value: stats.totalUsers, accent: false },
              { label: 'Turnos totales', value: stats.totalTurnos, accent: false },
            ].map(s => (
              <div key={s.label} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 22px' }}>
                <div style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 30, fontWeight: 800, color: s.accent ? '#E8673A' : 'white', letterSpacing: '-1px' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Buscar por nombre o categoría…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inp, maxWidth: 360 }}
          />
        </div>

        {/* Table */}
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
              Cargando…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
              No hay resultados
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Negocio', 'Categoría', 'Turnos', 'Plan', 'Alta', 'Acción'].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.activo ? '#4CAF50' : '#666', flexShrink: 0 }}/>
                        <span style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 13, fontWeight: 600, color: 'white' }}>{p.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{p.categoria.nombre}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{p._count.turnos}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999,
                        fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 11, fontWeight: 700,
                        background: p.plan === 'PRO' ? 'rgba(232,103,58,0.15)' : 'rgba(255,255,255,0.05)',
                        color: p.plan === 'PRO' ? '#E8673A' : 'rgba(255,255,255,0.35)',
                        border: `1px solid ${p.plan === 'PRO' ? 'rgba(232,103,58,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                        {p.plan}
                        {p.plan === 'PRO' && p.planVence && (
                          <span style={{ marginLeft: 4, fontWeight: 400, opacity: 0.6 }}>
                            · vence {new Date(p.planVence).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                        {new Date(p.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        onClick={() => togglePlan(p)}
                        disabled={toggling === p.id}
                        style={{
                          padding: '6px 14px', borderRadius: 8, border: 'none',
                          fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 12, fontWeight: 700,
                          cursor: toggling === p.id ? 'not-allowed' : 'pointer',
                          opacity: toggling === p.id ? 0.4 : 1,
                          background: p.plan === 'PRO' ? 'rgba(255,255,255,0.08)' : '#E8673A',
                          color: p.plan === 'PRO' ? 'rgba(255,255,255,0.5)' : 'white',
                        }}
                      >
                        {toggling === p.id ? '…' : p.plan === 'PRO' ? 'Quitar PRO' : 'Activar PRO'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
