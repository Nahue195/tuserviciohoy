// TuServicioHoy — Home/Landing screen
// Mobile (iOS device) + Desktop variants

const TshHomeMobile = ({ onNav, city }) => {
  const [query, setQuery] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const featured = TSH_PROVIDERS.slice(0, 4);

  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%', paddingBottom: 40 }}>
      {/* Top band: greeting + location */}
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Estás en</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <TshIcon name="pin" size={14} color="#C4532A"/>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 500, color: '#2A2420' }}>{city}</span>
              <TshIcon name="chevronD" size={14} color="#8B7D6B"/>
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TshIcon name="user" size={18} color="#2A2420"/>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '14px 20px 20px' }}>
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400,
          fontSize: 34, lineHeight: 1.04, letterSpacing: -0.8,
          color: '#2A2420', margin: 0, textWrap: 'pretty',
        }}>
          Todo lo que necesitás,{' '}
          <span style={{ fontStyle: 'italic', color: '#C4532A' }}>a la vuelta de tu barrio.</span>
        </h1>
        <p style={{
          fontFamily: 'Instrument Sans, system-ui, sans-serif',
          fontSize: 14, color: '#5C5048', lineHeight: 1.5, marginTop: 10, marginBottom: 0, maxWidth: 320,
        }}>
          Reservá un turno con profesionales de tu pueblo en segundos.
        </p>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#FFFBF3', borderRadius: 18,
          border: `1.5px solid ${focused ? '#C4532A' : '#E5D9C2'}`,
          padding: '14px 16px',
          transition: 'border-color 160ms ease, box-shadow 160ms ease',
          boxShadow: focused ? '0 0 0 4px rgba(196,83,42,0.1)' : 'none',
        }}>
          <TshIcon name="search" size={18} color="#8B7D6B"/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="¿Qué servicio necesitás?"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'Instrument Sans, system-ui, sans-serif',
              fontSize: 15, color: '#2A2420', minWidth: 0,
            }}
          />
          <button onClick={() => onNav('search')} style={{
            width: 34, height: 34, borderRadius: 9999, background: '#2A2420',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <TshIcon name="arrowR" size={16} color="#F5EDDE"/>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 2 }}>
          {['Disponible hoy', 'Mejor puntuados', 'Cerca tuyo', 'Nuevos'].map((t, i) => (
            <div key={t} style={{
              padding: '6px 12px', borderRadius: 9999,
              background: i === 0 ? '#2A2420' : 'transparent',
              color: i === 0 ? '#F5EDDE' : '#5C5048',
              border: i === 0 ? '1px solid #2A2420' : '1px solid #E5D9C2',
              fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, fontWeight: 600,
              whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
            }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', margin: 0, letterSpacing: -0.3 }}>
            Categorías
          </h2>
          <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#C4532A', fontWeight: 600 }}>Ver todas</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {TSH_CATEGORIES.slice(0, 6).map(c => (
            <TshCategoryTile key={c.id} cat={c} count={Math.floor(Math.random() * 12) + 4 + (c.id.length)} onClick={() => onNav('search')}/>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 20px', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', margin: 0, letterSpacing: -0.3 }}>
            Cerca tuyo
          </h2>
          <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#C4532A', fontWeight: 600 }}>Ver todos</span>
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 20px 6px', scrollbarWidth: 'none' }}>
          {featured.map(p => (
            <div key={p.id} style={{ width: 250 }}>
              <TshProviderCard provider={p} variant="featured" onClick={() => onNav('profile', p.id)}/>
            </div>
          ))}
        </div>
      </div>

      {/* CTA — provider signup */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          background: '#2A2420', borderRadius: 22, padding: 22, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: '#C4532A', opacity: 0.28 }}/>
          <div style={{ position: 'absolute', bottom: -30, left: -10, width: 80, height: 80, borderRadius: '50%', background: '#0F6E4E', opacity: 0.3 }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#E5D9C2', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Para comercios</div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, fontSize: 22, color: '#F5EDDE', lineHeight: 1.15, letterSpacing: -0.3, marginBottom: 8, textWrap: 'pretty' }}>
              Sumá tu negocio <span style={{ fontStyle: 'italic', color: '#E88A5F' }}>gratis</span> y llenate de turnos.
            </div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#E5D9C2', marginBottom: 16, lineHeight: 1.5, opacity: 0.85 }}>
              Más de 1.200 profesionales ya reciben reservas por TuServicioHoy.
            </div>
            <TshButton variant="terra" size="md" iconRight="arrowR" onClick={() => onNav('dashboard')}>
              Empezar ahora
            </TshButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Desktop version — wider layout
const TshHomeDesktop = ({ onNav, city }) => {
  const [query, setQuery] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const featured = TSH_PROVIDERS.slice(0, 4);

  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%', position: 'relative' }}>
      {/* Nav */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '22px 56px', borderBottom: '1px solid #EADFC5',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 22, color: '#2A2420', letterSpacing: -0.4, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            Tu<span style={{ color: '#C4532A', fontStyle: 'italic' }}>Servicio</span>Hoy
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4532A', marginLeft: 4, marginBottom: 8 }}/>
          </div>
          <div style={{ display: 'flex', gap: 28, fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, color: '#5C5048', fontWeight: 500 }}>
            <span style={{ color: '#2A2420', cursor: 'pointer' }}>Explorar</span>
            <span style={{ cursor: 'pointer' }}>Categorías</span>
            <span style={{ cursor: 'pointer' }}>Cómo funciona</span>
            <span style={{ cursor: 'pointer' }}>Para comercios</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9999, border: '1px solid #E5D9C2', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#5C5048', cursor: 'pointer' }}>
            <TshIcon name="pin" size={14} color="#C4532A"/>
            {city}
            <TshIcon name="chevronD" size={12} color="#8B7D6B"/>
          </div>
          <TshButton variant="ghost" size="sm">Ingresar</TshButton>
          <TshButton variant="primary" size="sm" onClick={() => onNav('dashboard')}>Sumá tu negocio</TshButton>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '64px 56px 48px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative */}
        <div style={{ position: 'absolute', right: -80, top: 40, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #E88A5F, #C4532A 70%)', opacity: 0.18 }}/>
        <div style={{ position: 'absolute', right: 200, top: 200, width: 120, height: 120, borderRadius: '50%', background: '#0F6E4E', opacity: 0.1 }}/>

        <div style={{ maxWidth: 820, position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9999, background: '#FFFBF3', border: '1px solid #E5D9C2', marginBottom: 24, fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#5C5048', fontWeight: 500 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F6E4E' }}/>
            1.237 profesionales locales disponibles hoy
          </div>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400,
            fontSize: 76, lineHeight: 0.98, letterSpacing: -2.2,
            color: '#2A2420', margin: 0, textWrap: 'balance',
          }}>
            Todo lo que necesitás,<br/>
            <span style={{ fontStyle: 'italic', color: '#C4532A' }}>a la vuelta</span> de tu barrio.
          </h1>
          <p style={{
            fontFamily: 'Instrument Sans, system-ui, sans-serif',
            fontSize: 18, color: '#5C5048', lineHeight: 1.5, marginTop: 20, maxWidth: 540,
          }}>
            Reservá turnos con peluqueros, médicos, abogados y oficios de tu pueblo.
            Sin llamadas, sin esperas, en 30 segundos.
          </p>
        </div>

        {/* Search */}
        <div style={{ maxWidth: 720, marginTop: 36, position: 'relative' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#FFFBF3', borderRadius: 22,
            border: `1.5px solid ${focused ? '#C4532A' : '#E5D9C2'}`,
            padding: 8,
            boxShadow: focused ? '0 0 0 5px rgba(196,83,42,0.08), 0 12px 36px rgba(60,40,20,0.08)' : '0 8px 28px rgba(60,40,20,0.06)',
            transition: 'all 200ms ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', flex: 1.3 }}>
              <TshIcon name="search" size={18} color="#8B7D6B"/>
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                placeholder="¿Qué servicio necesitás?"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 16, color: '#2A2420', minWidth: 0, padding: '14px 0' }}
              />
            </div>
            <div style={{ width: 1, height: 32, background: '#EADFC5' }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', flex: 1 }}>
              <TshIcon name="pin" size={16} color="#8B7D6B"/>
              <input
                defaultValue={city}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 16, color: '#2A2420', minWidth: 0, padding: '14px 0' }}
              />
            </div>
            <button onClick={() => onNav('search')} style={{
              padding: '0 22px', height: 52, borderRadius: 16, background: '#C4532A',
              border: 'none', cursor: 'pointer', color: '#FFFBF3',
              fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 15, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>Buscar <TshIcon name="arrowR" size={16} color="#FFFBF3"/></button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#8B7D6B', marginRight: 4 }}>Popular:</span>
            {['Peluquería', 'Odontólogo', 'Electricista', 'Veterinario', 'Abogado laboral'].map(t => (
              <span key={t} style={{
                padding: '5px 12px', borderRadius: 9999, border: '1px solid #E5D9C2',
                background: '#FFFBF3', fontFamily: 'Instrument Sans, system-ui, sans-serif',
                fontSize: 13, color: '#5C5048', cursor: 'pointer', fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '32px 56px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 36, color: '#2A2420', margin: 0, letterSpacing: -0.8 }}>
            Explorá por categoría
          </h2>
          <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, color: '#C4532A', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Ver todas <TshIcon name="arrowR" size={14} color="#C4532A"/>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {TSH_CATEGORIES.map((c, i) => (
            <div key={c.id} onClick={() => onNav('search')} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 18, background: c.tint, borderRadius: 18, cursor: 'pointer',
              transition: 'transform 180ms cubic-bezier(.2,.8,.2,1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TshIcon name={c.icon} size={22} color={c.color}/>
              </div>
              <div>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 18, color: c.color, lineHeight: 1.1, letterSpacing: -0.3 }}>{c.label}</div>
                <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: c.color, opacity: 0.65, marginTop: 3 }}>{20 + i*3} profesionales</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured providers */}
      <div style={{ padding: '0 56px 56px', background: '#FAF4E8' }}>
        <div style={{ padding: '48px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Disponibles hoy</div>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 36, color: '#2A2420', margin: 0, letterSpacing: -0.8 }}>
              Cerca tuyo en <span style={{ fontStyle: 'italic' }}>{city}</span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #E5D9C2', background: '#FFFBF3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TshIcon name="chevronL" size={14} color="#2A2420"/>
            </button>
            <button style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#2A2420', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TshIcon name="chevronR" size={14} color="#F5EDDE"/>
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {featured.map(p => (
            <TshProviderCard key={p.id} provider={p} variant="featured" onClick={() => onNav('profile', p.id)}/>
          ))}
        </div>
      </div>

      {/* Provider CTA */}
      <div style={{ padding: '64px 56px' }}>
        <div style={{
          background: '#2A2420', borderRadius: 28, padding: '48px 56px', position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40,
        }}>
          <div style={{ position: 'absolute', top: -60, right: 100, width: 240, height: 240, borderRadius: '50%', background: '#C4532A', opacity: 0.3 }}/>
          <div style={{ position: 'absolute', bottom: -60, right: -40, width: 200, height: 200, borderRadius: '50%', background: '#0F6E4E', opacity: 0.35 }}/>
          <div style={{ position: 'relative', maxWidth: 540 }}>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#E5D9C2', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, marginBottom: 14 }}>Para comercios</div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, fontSize: 42, color: '#F5EDDE', lineHeight: 1.05, letterSpacing: -0.8, marginBottom: 16, textWrap: 'pretty' }}>
              Sumá tu negocio <span style={{ fontStyle: 'italic', color: '#E88A5F' }}>gratis</span> y llenate de turnos.
            </div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 16, color: '#E5D9C2', marginBottom: 28, lineHeight: 1.55, opacity: 0.85 }}>
              Tu agenda online, tus clientes reservando solos, tu tiempo para trabajar.
              Más de 1.200 profesionales de pueblos argentinos ya usan TuServicioHoy.
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <TshButton variant="terra" size="lg" iconRight="arrowR" onClick={() => onNav('dashboard')}>
                Crear mi perfil
              </TshButton>
              <TshButton variant="ghost" size="lg" style={{ color: '#F5EDDE', border: '1px solid rgba(245,237,222,0.3)' }}>
                Ver demo
              </TshButton>
            </div>
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 280, height: 280, borderRadius: 24, background: '#FFFBF3', padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', transform: 'rotate(3deg)' }}>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, marginBottom: 8 }}>Esta semana</div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 52, color: '#2A2420', lineHeight: 1, letterSpacing: -1.5 }}>+47</div>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, color: '#5C5048', marginTop: 4 }}>turnos nuevos</div>
              <div style={{ height: 1, background: '#EFE5D0', margin: '20px 0' }}/>
              <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 60 }}>
                {[40, 60, 45, 70, 55, 85, 30].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? '#C4532A' : '#EADFC5', borderRadius: 4 }}/>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, color: '#8B7D6B' }}>
                {['L','M','M','J','V','S','D'].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '32px 56px 48px', borderTop: '1px solid #EADFC5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B' }}>
        <div>© 2026 TuServicioHoy · Hecho en Argentina, para pueblos argentinos</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span>Términos</span><span>Privacidad</span><span>Ayuda</span>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { TshHomeMobile, TshHomeDesktop });
