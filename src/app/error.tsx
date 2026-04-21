'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ background: '#F5EDDE', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{ width: 64, height: 64, background: '#FFF0EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>
          ⚠️
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1208', margin: '0 0 10px', letterSpacing: '-0.4px' }}>
          Algo salió mal
        </h1>
        <p style={{ fontSize: 14, color: '#8B7D6B', margin: '0 0 28px', lineHeight: 1.6, maxWidth: 320 }}>
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 24px', background: '#E8673A', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 24px', background: 'transparent', color: '#1A1208', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1.5px solid #E5D9C2' }}
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
