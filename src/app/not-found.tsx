import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#F5EDDE', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: 80, fontWeight: 800, color: '#E8673A', lineHeight: 1, letterSpacing: '-4px', marginBottom: 8 }}>404</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1208', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
          Página no encontrada
        </h1>
        <p style={{ fontSize: 15, color: '#8B7D6B', margin: '0 0 32px', lineHeight: 1.6, maxWidth: 340 }}>
          La página que buscás no existe o fue movida.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 24px', background: '#E8673A', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
          >
            Ir al inicio
          </Link>
          <Link
            href="/buscar"
            style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 24px', background: 'transparent', color: '#1A1208', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1.5px solid #E5D9C2' }}
          >
            Buscar servicios
          </Link>
        </div>
      </div>
    </div>
  );
}
