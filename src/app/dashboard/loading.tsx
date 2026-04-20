export default function Loading() {
  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      <div className="w-56 shrink-0 bg-[#0A0A0A] border-r border-white/[0.05]"/>
      <div className="flex-1 px-8 py-7">
        <div className="h-9 w-72 bg-white/[0.06] rounded-xl mb-7 animate-pulse"/>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[100px] bg-white/[0.04] rounded-2xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}/>
          ))}
        </div>
        <div className="h-[420px] bg-white/[0.04] rounded-2xl animate-pulse"/>
      </div>
    </div>
  );
}
