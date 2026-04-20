export default function Loading() {
  return <PageSkeleton/>;
}

function PageSkeleton() {
  return (
    <div style={{ background: '#F5EDDE', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ height: 60, background: '#EFE5D0', borderRadius: 12, marginBottom: 32, animation: 'tsh-pulse 1.4s ease-in-out infinite' }}/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 200, background: '#EFE5D0', borderRadius: 20, animation: 'tsh-pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}/>
          ))}
        </div>
      </div>
      <style>{`@keyframes tsh-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
