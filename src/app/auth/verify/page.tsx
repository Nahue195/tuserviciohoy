import Link from 'next/link';

export default function VerifyPage() {
  return (
    <div style={{ background: '#F5EDDE', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#FFFBF3', borderRadius: 24, padding: 32, border: '1px solid #EFE5D0', boxShadow: '0 8px 32px rgba(60,40,20,0.08)', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E3EFE8', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
          ✉️
        </div>
        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 24, color: '#2A2420', marginBottom: 12 }}>
          Revisá tu email
        </div>
        <p style={{ fontFamily: 'inherit', fontSize: 15, color: '#5C5048', lineHeight: 1.6, marginBottom: 24 }}>
          Te enviamos un link mágico. Hacé clic en él para ingresar a tu cuenta.
        </p>
        <Link href="/auth/login" style={{ fontFamily: 'inherit', fontSize: 14, color: '#C4532A', textDecoration: 'none' }}>
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
