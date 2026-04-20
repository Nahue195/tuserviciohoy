// TuServicioHoy — Search / Results screen

const TshSearchMobile = ({ onNav }) => {
  const [activeFilter, setActiveFilter] = React.useState('hoy');
  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 14px', position: 'sticky', top: 0, background: '#F5EDDE', zIndex: 10, borderBottom: '1px solid #EADFC5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button onClick={() => onNav('home')} style={{ width: 36, height: 36, borderRadius: 9999, border: '1px solid #E5D9C2', background: '#FFFBF3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <TshIcon name="chevronL" size={16} color="#2A2420"/>
          </button>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: '#FFFBF3', borderRadius: 9999, border: '1px solid #E5D9C2', padding: '9px 14px',
          }}>
            <TshIcon name="search" size={16} color="#8B7D6B"/>
            <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, color: '#2A2420', fontWeight: 500 }}>Peluquería</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
          {[
            { id: 'hoy', label: 'Disponible hoy', icon: 'clock' },
            { id: 'near', label: 'Cerca (< 2km)', icon: 'pin' },
            { id: 'rating', label: '4+ estrellas', icon: 'star' },
            { id: 'cat', label: 'Categoría', icon: 'filter' },
            { id: 'price', label: 'Precio', icon: null },
          ].map(f => (
            <div key={f.id} onClick={() => setActiveFilter(f.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '7px 12px', borderRadius: 9999,
              background: activeFilter === f.id ? '#2A2420' : '#FFFBF3',
              color: activeFilter === f.id ? '#F5EDDE' : '#2A2420',
              border: `1px solid ${activeFilter === f.id ? '#2A2420' : '#E5D9C2'}`,
              fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, fontWeight: 600,
              whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
            }}>
              {f.icon && <TshIcon name={f.icon} size={12} color={activeFilter === f.id ? '#F5EDDE' : '#2A2420'}/>}
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ padding: '16px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#5C5048' }}>
          <span style={{ color: '#2A2420', fontWeight: 700 }}>8 resultados</span> en Villa San Rafael
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#C4532A', fontWeight: 600, cursor: 'pointer' }}>
          Ordenar
          <TshIcon name="chevronD" size={12} color="#C4532A"/>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TSH_PROVIDERS.map(p => (
          <TshProviderCard key={p.id} provider={p} onClick={() => onNav('profile', p.id)}/>
        ))}
      </div>
    </div>
  );
};

const TshSearchDesktop = ({ onNav }) => {
  const [cats, setCats] = React.useState(new Set(['belleza', 'salud']));
  const [avail, setAvail] = React.useState(true);
  const [minRating, setMinRating] = React.useState(4);
  const [maxDist, setMaxDist] = React.useState(3);

  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%' }}>
      {/* Nav bar compact */}
      <div style={{ padding: '16px 40px', borderBottom: '1px solid #EADFC5', display: 'flex', alignItems: 'center', gap: 24, background: '#F5EDDE' }}>
        <div onClick={() => onNav('home')} style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 18, color: '#2A2420', cursor: 'pointer', letterSpacing: -0.3 }}>
          Tu<span style={{ color: '#C4532A', fontStyle: 'italic' }}>Servicio</span>Hoy
        </div>
        <div style={{
          flex: 1, maxWidth: 560, display: 'flex', alignItems: 'center', gap: 8,
          background: '#FFFBF3', borderRadius: 14, border: '1px solid #E5D9C2', padding: '4px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', flex: 1.2 }}>
            <TshIcon name="search" size={15} color="#8B7D6B"/>
            <input defaultValue="Peluquería" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, padding: '10px 0', color: '#2A2420' }}/>
          </div>
          <div style={{ width: 1, height: 24, background: '#EADFC5' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', flex: 1 }}>
            <TshIcon name="pin" size={14} color="#8B7D6B"/>
            <input defaultValue="Villa San Rafael" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, padding: '10px 0', color: '#2A2420' }}/>
          </div>
          <button style={{ padding: '0 18px', height: 36, borderRadius: 10, background: '#C4532A', border: 'none', color: '#FFFBF3', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Buscar</button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <TshIcon name="heart" size={18} color="#2A2420"/>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TshIcon name="user" size={16} color="#2A2420"/>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 320px', gap: 24, padding: '24px 40px 40px' }}>
        {/* Filters */}
        <aside style={{ background: '#FFFBF3', borderRadius: 18, border: '1px solid #EFE5D0', padding: 20, height: 'fit-content', position: 'sticky', top: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 18, color: '#2A2420', letterSpacing: -0.2 }}>Filtros</div>
            <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#C4532A', fontWeight: 600, cursor: 'pointer' }}>Limpiar</span>
          </div>

          {/* Availability toggle */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#2A2420' }}>Disponible hoy</div>
              <div onClick={() => setAvail(!avail)} style={{ width: 38, height: 22, borderRadius: 9999, background: avail ? '#0F6E4E' : '#E5D9C2', position: 'relative', cursor: 'pointer', transition: 'background 160ms' }}>
                <div style={{ position: 'absolute', top: 2, left: avail ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#FFFBF3', transition: 'left 160ms' }}/>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: '#EFE5D0', margin: '16px 0' }}/>

          {/* Categories */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#2A2420', marginBottom: 10 }}>Categoría</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TSH_CATEGORIES.slice(0, 6).map(c => {
                const checked = cats.has(c.id);
                return (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                    onClick={() => {
                      const next = new Set(cats);
                      if (checked) next.delete(c.id); else next.add(c.id);
                      setCats(next);
                    }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                      border: `1.5px solid ${checked ? c.color : '#E5D9C2'}`,
                      background: checked ? c.color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 140ms',
                    }}>
                      {checked && <TshIcon name="check" size={12} color="#FFFBF3" strokeWidth={2.5}/>}
                    </div>
                    <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#2A2420' }}>{c.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ height: 1, background: '#EFE5D0', margin: '16px 0' }}/>

          {/* Distance slider */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#2A2420' }}>Distancia</div>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#C4532A', fontWeight: 600 }}>{maxDist} km</div>
            </div>
            <input type="range" min={1} max={10} value={maxDist} onChange={e => setMaxDist(+e.target.value)}
              style={{ width: '100%', accentColor: '#C4532A' }}/>
          </div>

          <div style={{ height: 1, background: '#EFE5D0', margin: '16px 0' }}/>

          {/* Rating */}
          <div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#2A2420', marginBottom: 10 }}>Calificación mínima</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[3, 3.5, 4, 4.5].map(r => (
                <div key={r} onClick={() => setMinRating(r)} style={{
                  flex: 1, padding: '8px 0', textAlign: 'center',
                  borderRadius: 10,
                  background: minRating === r ? '#2A2420' : '#FAF4E8',
                  color: minRating === r ? '#F5EDDE' : '#2A2420',
                  border: minRating === r ? '1px solid #2A2420' : '1px solid #EFE5D0',
                  fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer',
                }}>{r}+</div>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 28, color: '#2A2420', letterSpacing: -0.5 }}>
                Peluquería en Villa San Rafael
              </div>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#8B7D6B', marginTop: 4 }}>
                8 resultados · actualizado ahora
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 14px', borderRadius: 10, background: '#FFFBF3', border: '1px solid #E5D9C2', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#2A2420', cursor: 'pointer', fontWeight: 500 }}>
              Relevancia
              <TshIcon name="chevronD" size={12} color="#8B7D6B"/>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TSH_PROVIDERS.map(p => (
              <TshProviderCard key={p.id} provider={p} onClick={() => onNav('profile', p.id)}/>
            ))}
          </div>
        </main>

        {/* Map */}
        <aside style={{ position: 'sticky', top: 24, height: 'calc(100vh - 48px)', minHeight: 600 }}>
          <div style={{ position: 'relative', height: '100%', borderRadius: 18, overflow: 'hidden', border: '1px solid #EFE5D0' }}>
            {/* stylized map */}
            <div style={{ position: 'absolute', inset: 0, background: '#EADFC5' }}/>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 320 640" preserveAspectRatio="none">
              {/* blocks */}
              <rect x="20" y="40" width="100" height="80" rx="6" fill="#D4C4A8"/>
              <rect x="140" y="20" width="120" height="100" rx="6" fill="#D4C4A8"/>
              <rect x="20" y="140" width="140" height="120" rx="6" fill="#D4C4A8"/>
              <rect x="180" y="140" width="100" height="60" rx="6" fill="#D4C4A8"/>
              <rect x="180" y="220" width="100" height="80" rx="6" fill="#D4C4A8"/>
              <rect x="20" y="280" width="80" height="100" rx="6" fill="#D4C4A8"/>
              <rect x="120" y="280" width="160" height="100" rx="6" fill="#D4C4A8"/>
              <rect x="20" y="400" width="140" height="100" rx="6" fill="#D4C4A8"/>
              <rect x="180" y="400" width="100" height="120" rx="6" fill="#D4C4A8"/>
              <rect x="20" y="520" width="100" height="100" rx="6" fill="#D4C4A8"/>
              <rect x="140" y="540" width="140" height="80" rx="6" fill="#D4C4A8"/>
              {/* streets cross */}
              <path d="M 0 130 L 320 130" stroke="#EADFC5" strokeWidth="10"/>
              <path d="M 0 270 L 320 270" stroke="#EADFC5" strokeWidth="10"/>
              <path d="M 0 390 L 320 390" stroke="#EADFC5" strokeWidth="10"/>
              <path d="M 130 0 L 130 640" stroke="#EADFC5" strokeWidth="10"/>
              {/* river */}
              <path d="M 0 560 Q 80 540 160 570 T 320 580" stroke="#A8C4C0" strokeWidth="22" fill="none" opacity="0.6"/>
            </svg>

            {/* Pins */}
            {[
              { x: 55, y: 180, p: TSH_PROVIDERS[0], active: true },
              { x: 200, y: 110, p: TSH_PROVIDERS[1] },
              { x: 85, y: 340, p: TSH_PROVIDERS[2] },
              { x: 220, y: 260, p: TSH_PROVIDERS[3] },
              { x: 160, y: 450, p: TSH_PROVIDERS[4] },
              { x: 60, y: 480, p: TSH_PROVIDERS[5] },
            ].map((pin, i) => {
              const c = tshCat(pin.p.category);
              return (
                <div key={i} style={{
                  position: 'absolute', left: `${pin.x/320*100}%`, top: `${pin.y/640*100}%`,
                  transform: 'translate(-50%, -100%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  zIndex: pin.active ? 5 : 1,
                }}>
                  {pin.active && (
                    <div style={{
                      background: '#FFFBF3', borderRadius: 10, padding: '6px 10px',
                      boxShadow: '0 4px 16px rgba(60,40,20,0.2)',
                      fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, fontWeight: 600, color: '#2A2420',
                      whiteSpace: 'nowrap', marginBottom: 2,
                    }}>
                      {pin.p.name.length > 22 ? pin.p.name.slice(0, 20) + '…' : pin.p.name}
                    </div>
                  )}
                  <div style={{
                    padding: '4px 10px', borderRadius: 9999, background: pin.active ? '#2A2420' : c.color,
                    color: '#FFFBF3', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    {tshFmtPrice(pin.p.priceFrom).replace('ARS ', '$')}
                  </div>
                  <div style={{ width: 2, height: 8, background: pin.active ? '#2A2420' : c.color }}/>
                </div>
              );
            })}

            {/* Map controls */}
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button style={{ width: 36, height: 36, borderRadius: 10, background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <TshIcon name="plus" size={14} color="#2A2420"/>
              </button>
              <button style={{ width: 36, height: 36, borderRadius: 10, background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <TshIcon name="minus" size={14} color="#2A2420"/>
              </button>
            </div>

            <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: 'rgba(255,251,243,0.95)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E5D9C2' }}>
              <TshIcon name="pin" size={14} color="#C4532A"/>
              <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#2A2420', fontWeight: 600 }}>Mapa de Villa San Rafael</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B' }}>6 de 8 visibles</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

Object.assign(window, { TshSearchMobile, TshSearchDesktop });
