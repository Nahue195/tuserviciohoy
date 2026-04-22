'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0D0D0D',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 360,
        background: '#161616', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24, padding: 40,
      }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <svg width="22" height="28" viewBox="0 0 28 36" fill="none">
              <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#E8673A"/>
              <path d="M8 14.5L12.5 19L20.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 16, fontWeight: 700, color: 'white' }}>
              TuServicioHoy <span style={{ color: '#E8673A' }}>Admin</span>
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            Ingresá la contraseña de administrador
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            placeholder="Contraseña admin"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
              color: 'white', fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{ margin: 0, fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: 13, color: '#E8673A' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px', borderRadius: 10,
              background: '#E8673A', color: 'white', border: 'none',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Verificando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
