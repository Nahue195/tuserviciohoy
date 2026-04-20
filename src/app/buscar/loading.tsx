export default function Loading() {
  return (
    <div style={{ background: '#F5EDDE', minHeight: '100vh', padding: '24px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ height: 48, background: '#EFE5D0', borderRadius: 14, marginBottom: 20, animation: 'pulse 1.4s ease-in-out infinite' }}/>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'hidden' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 36, width: 100, flexShrink: 0, background: '#EFE5D0', borderRadius: 9999, animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i*0.08}s` }}/>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 220, background: '#EFE5D0', borderRadius: 20, animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i*0.07}s` }}/>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}
