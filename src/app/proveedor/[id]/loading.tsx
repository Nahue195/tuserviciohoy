export default function Loading() {
  return (
    <div style={{ background: '#F5EDDE', minHeight: '100vh' }}>
      <div style={{ height: 280, background: '#EFE5D0', animation: 'pulse 1.4s ease-in-out infinite' }}/>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ height: 32, width: 240, background: '#EFE5D0', borderRadius: 8, marginBottom: 12, animation: 'pulse 1.4s ease-in-out infinite' }}/>
        <div style={{ height: 16, width: 160, background: '#EFE5D0', borderRadius: 8, marginBottom: 24, animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '0.1s' }}/>
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 32, width: 80, background: '#EFE5D0', borderRadius: 9999, animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i*0.1}s` }}/>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ height: 40, width: 72, background: '#EFE5D0', borderRadius: 9999, animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i*0.06}s` }}/>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}
