// TuServicioHoy — Provider profile screen

const TshAvailabilityStrip = ({ onBook, compact = false }) => {
  const days = TSH_DAYS.slice(0, compact ? 5 : 7);
  const [selectedDay, setSelectedDay] = React.useState(0);
  const dayKey = days[selectedDay].key;
  const disabled = TSH_DISABLED[dayKey] || [];
  const slots = [...TSH_SLOTS_MORNING, ...TSH_SLOTS_AFTER];
  const allBlocked = disabled.includes('all');

  return (
    <div>
      {/* Day strip */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none', marginBottom: 16 }}>
        {days.map((d, i) => {
          const active = i === selectedDay;
          const closed = (TSH_DISABLED[d.key] || []).includes('all');
          return (
            <div key={d.key} onClick={() => !closed && setSelectedDay(i)} style={{
              flexShrink: 0, width: 56, padding: '10px 8px',
              borderRadius: 14, textAlign: 'center', cursor: closed ? 'not-allowed' : 'pointer',
              background: active ? '#2A2420' : '#FFFBF3',
              border: `1px solid ${active ? '#2A2420' : '#E5D9C2'}`,
              color: active ? '#F5EDDE' : (closed ? '#C9BDA5' : '#2A2420'),
              opacity: closed ? 0.5 : 1,
              transition: 'all 160ms',
            }}>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, opacity: 0.7 }}>
                {d.isToday ? 'hoy' : d.isTomorrow ? 'mañ' : d.dayName}
              </div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, lineHeight: 1.1, marginTop: 2, letterSpacing: -0.3 }}>
                {d.dayNum}
              </div>
              {closed && <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 9, marginTop: 2 }}>cerrado</div>}
            </div>
          );
        })}
      </div>

      {allBlocked ? (
        <div style={{ padding: 20, background: '#FAF4E8', borderRadius: 14, border: '1px solid #EFE5D0', textAlign: 'center', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#8B7D6B' }}>
          Cerrado este día
        </div>
      ) : (
        <div>
          <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 }}>Mañana</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {TSH_SLOTS_MORNING.map(s => {
              const isOff = disabled.includes(s);
              return (
                <div key={s} onClick={() => !isOff && onBook(s, days[selectedDay])} style={{
                  padding: '8px 14px', borderRadius: 9999,
                  background: isOff ? '#F5EDDE' : '#FFFBF3',
                  border: `1px solid ${isOff ? '#EADFC5' : '#E5D9C2'}`,
                  color: isOff ? '#C9BDA5' : '#2A2420',
                  textDecoration: isOff ? 'line-through' : 'none',
                  fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600,
                  cursor: isOff ? 'not-allowed' : 'pointer',
                  transition: 'all 140ms',
                }}
                onMouseEnter={e => !isOff && (e.currentTarget.style.background = '#2A2420', e.currentTarget.style.color = '#F5EDDE', e.currentTarget.style.borderColor = '#2A2420')}
                onMouseLeave={e => !isOff && (e.currentTarget.style.background = '#FFFBF3', e.currentTarget.style.color = '#2A2420', e.currentTarget.style.borderColor = '#E5D9C2')}
                >{s}</div>
              );
            })}
          </div>

          <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 }}>Tarde</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TSH_SLOTS_AFTER.map(s => {
              const isOff = disabled.includes(s);
              return (
                <div key={s} onClick={() => !isOff && onBook(s, days[selectedDay])} style={{
                  padding: '8px 14px', borderRadius: 9999,
                  background: isOff ? '#F5EDDE' : '#FFFBF3',
                  border: `1px solid ${isOff ? '#EADFC5' : '#E5D9C2'}`,
                  color: isOff ? '#C9BDA5' : '#2A2420',
                  textDecoration: isOff ? 'line-through' : 'none',
                  fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600,
                  cursor: isOff ? 'not-allowed' : 'pointer',
                  transition: 'all 140ms',
                }}
                onMouseEnter={e => !isOff && (e.currentTarget.style.background = '#2A2420', e.currentTarget.style.color = '#F5EDDE', e.currentTarget.style.borderColor = '#2A2420')}
                onMouseLeave={e => !isOff && (e.currentTarget.style.background = '#FFFBF3', e.currentTarget.style.color = '#2A2420', e.currentTarget.style.borderColor = '#E5D9C2')}
                >{s}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const TshProfileMobile = ({ onNav, providerId, onBook }) => {
  const p = TSH_PROVIDERS.find(x => x.id === providerId) || TSH_PROVIDERS[0];
  const c = tshCat(p.category);
  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%', paddingBottom: 110 }}>
      {/* Cover */}
      <div style={{ position: 'relative', height: 200 }}>
        <TshPlaceholder label={p.category} seed={p.coverSeed} rounded={0} style={{ width: '100%', height: '100%' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,36,32,0.25) 0%, rgba(42,36,32,0) 40%, rgba(245,237,222,0.9) 100%)' }}/>
        <button onClick={() => onNav('search')} style={{ position: 'absolute', top: 52, left: 16, width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,251,243,0.9)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <TshIcon name="chevronL" size={18} color="#2A2420"/>
        </button>
        <div style={{ position: 'absolute', top: 52, right: 16, display: 'flex', gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,251,243,0.9)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <TshIcon name="share" size={16} color="#2A2420"/>
          </button>
          <button style={{ width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,251,243,0.9)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <TshIcon name="heart" size={16} color="#2A2420"/>
          </button>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '0 20px', marginTop: -30, position: 'relative' }}>
        <div style={{ width: 72, height: 72, borderRadius: 16, background: '#FFFBF3', padding: 4, boxShadow: '0 4px 16px rgba(60,40,20,0.15)' }}>
          <TshAvatar name={p.person} seed={p.avatarSeed} size={64}/>
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8, marginBottom: 10 }}>
          <TshCategoryBadge cat={c}/>
          {p.availableToday && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 11px', borderRadius: 9999, background: '#E3EFE8', color: '#0F6E4E',
              fontFamily: 'Instrument Sans, system-ui, sans-serif', fontWeight: 600, fontSize: 12,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F6E4E' }}/>
              Disponible hoy
            </span>
          )}
        </div>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 26, color: '#2A2420', margin: 0, letterSpacing: -0.5, lineHeight: 1.1 }}>
          {p.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
          <TshStars rating={p.rating} reviews={p.reviews} size={13}/>
          <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#8B7D6B', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <TshIcon name="pin" size={12} color="#8B7D6B"/>
            {p.neighborhood} · {p.distanceKm} km
          </span>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: '20px' }}>
        <p style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, color: '#5C5048', lineHeight: 1.6, margin: 0 }}>
          {p.description}
        </p>
      </div>

      {/* Info strip */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#FAF4E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TshIcon name="clock" size={15} color="#2A2420"/>
            </div>
            <div style={{ flex: 1, fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#2A2420' }}>
              <div style={{ fontWeight: 600 }}>Horario</div>
              <div style={{ color: '#8B7D6B', fontSize: 12 }}>{p.hours}</div>
            </div>
          </div>
          <div style={{ height: 1, background: '#EFE5D0' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#FAF4E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TshIcon name="sparkle" size={15} color="#2A2420"/>
            </div>
            <div style={{ flex: 1, fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#2A2420' }}>
              <div style={{ fontWeight: 600 }}>En TuServicioHoy desde</div>
              <div style={{ color: '#8B7D6B', fontSize: 12 }}>{p.since} · {new Date().getFullYear() - p.since} años</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services tags */}
      <div style={{ padding: '0 20px 24px' }}>
        <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 18, color: '#2A2420', margin: '0 0 10px', letterSpacing: -0.2 }}>Servicios</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {p.tags.map(t => (
            <span key={t} style={{ padding: '6px 12px', borderRadius: 9999, background: '#FFFBF3', border: '1px solid #E5D9C2', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#2A2420', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div style={{ padding: '0 20px 24px' }}>
        <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', margin: '0 0 14px', letterSpacing: -0.3 }}>Próximos turnos disponibles</h3>
        <TshAvailabilityStrip onBook={onBook} compact/>
      </div>

      {/* Reviews */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', margin: 0, letterSpacing: -0.3 }}>Reseñas</h3>
          <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#C4532A', fontWeight: 600 }}>Ver todas ({p.reviews})</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TSH_REVIEWS.map((r, i) => (
            <div key={i} style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 14, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TshAvatar name={r.name} seed={i} size={28}/>
                  <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#2A2420', fontWeight: 600 }}>{r.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TshIcon key={j} name={j < r.rating ? 'star' : 'starLine'} size={11} color="#C4532A"/>
                  ))}
                </div>
              </div>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#5C5048', lineHeight: 1.5 }}>{r.text}</div>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', marginTop: 6 }}>{r.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 40px', background: 'linear-gradient(180deg, rgba(245,237,222,0) 0%, rgba(245,237,222,0.95) 30%)',
        display: 'flex', gap: 10, alignItems: 'center', zIndex: 20,
      }}>
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10.5, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>Desde</div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 20, fontWeight: 500, color: '#2A2420', letterSpacing: -0.3 }}>{tshFmtPrice(p.priceFrom)}</div>
        </div>
        <div style={{ flex: 1 }}>
          <TshButton variant="terra" size="lg" full iconRight="arrowR" onClick={() => onBook('15:30', TSH_DAYS[0])}>
            Reservar turno
          </TshButton>
        </div>
      </div>
    </div>
  );
};

const TshProfileDesktop = ({ onNav, providerId, onBook }) => {
  const p = TSH_PROVIDERS.find(x => x.id === providerId) || TSH_PROVIDERS[0];
  const c = tshCat(p.category);
  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%' }}>
      {/* Mini nav */}
      <div style={{ padding: '16px 40px', borderBottom: '1px solid #EADFC5', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div onClick={() => onNav('home')} style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 18, color: '#2A2420', cursor: 'pointer', letterSpacing: -0.3 }}>
          Tu<span style={{ color: '#C4532A', fontStyle: 'italic' }}>Servicio</span>Hoy
        </div>
        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#8B7D6B' }}>
          <span onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>Inicio</span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span onClick={() => onNav('search')} style={{ cursor: 'pointer' }}>Peluquería</span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#2A2420' }}>{p.name}</span>
        </div>
      </div>

      {/* Cover */}
      <div style={{ position: 'relative', height: 280 }}>
        <TshPlaceholder label={p.category} seed={p.coverSeed} rounded={0} style={{ width: '100%', height: '100%' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,36,32,0) 40%, rgba(245,237,222,1) 100%)' }}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, padding: '0 40px 48px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginTop: -80, position: 'relative' }}>
          {/* Header */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', marginBottom: 24 }}>
            <div style={{ width: 140, height: 140, borderRadius: 24, background: '#FFFBF3', padding: 6, boxShadow: '0 8px 32px rgba(60,40,20,0.15)' }}>
              <TshAvatar name={p.person} seed={p.avatarSeed} size={128}/>
            </div>
            <div style={{ paddingBottom: 6, flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <TshCategoryBadge cat={c}/>
                {p.availableToday && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 9999, background: '#E3EFE8', color: '#0F6E4E', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontWeight: 600, fontSize: 12 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F6E4E' }}/>
                    Disponible hoy
                  </span>
                )}
              </div>
              <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 44, color: '#2A2420', margin: 0, letterSpacing: -1, lineHeight: 1 }}>
                {p.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
                <TshStars rating={p.rating} reviews={p.reviews} size={14}/>
                <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#8B7D6B', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <TshIcon name="pin" size={13} color="#8B7D6B"/>
                  {p.neighborhood} · {p.distanceKm} km de tu ubicación
                </span>
                <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#8B7D6B', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <TshIcon name="sparkle" size={13} color="#8B7D6B"/>
                  Atiende hace {new Date().getFullYear() - p.since} años
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
              <button style={{ width: 44, height: 44, borderRadius: 9999, background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <TshIcon name="share" size={16} color="#2A2420"/>
              </button>
              <button style={{ width: 44, height: 44, borderRadius: 9999, background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <TshIcon name="heart" size={16} color="#2A2420"/>
              </button>
            </div>
          </div>

          {/* About */}
          <div style={{ padding: '24px 0', borderTop: '1px solid #EADFC5' }}>
            <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 22, color: '#2A2420', margin: '0 0 12px', letterSpacing: -0.3 }}>Sobre {p.person.split(' ')[0]}</h3>
            <p style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 15, color: '#5C5048', lineHeight: 1.65, margin: 0, maxWidth: 640 }}>
              {p.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
              {p.tags.map(t => (
                <span key={t} style={{ padding: '7px 14px', borderRadius: 9999, background: '#FFFBF3', border: '1px solid #E5D9C2', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#2A2420', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div style={{ padding: '24px 0', borderTop: '1px solid #EADFC5' }}>
            <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 22, color: '#2A2420', margin: '0 0 16px', letterSpacing: -0.3 }}>Elegí tu turno</h3>
            <TshAvailabilityStrip onBook={onBook}/>
          </div>

          {/* Reviews */}
          <div style={{ padding: '24px 0', borderTop: '1px solid #EADFC5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 22, color: '#2A2420', margin: 0, letterSpacing: -0.3 }}>
                Reseñas <span style={{ color: '#8B7D6B', fontWeight: 400 }}>({p.reviews})</span>
              </h3>
              <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#C4532A', fontWeight: 600, cursor: 'pointer' }}>Ver todas</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {TSH_REVIEWS.map((r, i) => (
                <div key={i} style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 16, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <TshAvatar name={r.name} seed={i+2} size={32}/>
                      <div>
                        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#2A2420', fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B' }}>{r.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TshIcon key={j} name={j < r.rating ? 'star' : 'starLine'} size={12} color="#C4532A"/>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#5C5048', lineHeight: 1.55 }}>{r.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky booking card */}
        <aside style={{ marginTop: 24 }}>
          <div style={{ position: 'sticky', top: 24, background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 22, padding: 22, boxShadow: '0 8px 32px rgba(60,40,20,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #EFE5D0' }}>
              <div>
                <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>Desde</div>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, fontWeight: 500, color: '#2A2420', letterSpacing: -0.6, marginTop: 2 }}>{tshFmtPrice(p.priceFrom)}</div>
              </div>
              <TshStars rating={p.rating} reviews={p.reviews} size={12}/>
            </div>

            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 10 }}>Próximo turno</div>
            <div style={{ padding: '14px 16px', borderRadius: 14, background: '#E3EFE8', border: '1px solid #C5DCC9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: '#0F6E4E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TshIcon name="clock" size={16} color="#FFFBF3"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 17, fontWeight: 500, color: '#0F6E4E', letterSpacing: -0.2 }}>{p.nextSlot}</div>
                <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#0F6E4E', opacity: 0.8 }}>Último horario de la tarde</div>
              </div>
            </div>

            <TshButton variant="terra" size="lg" full iconRight="arrowR" onClick={() => onBook('15:30', TSH_DAYS[0])}>
              Reservar turno
            </TshButton>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textAlign: 'center', marginTop: 10 }}>
              Podés cancelar sin cargo hasta 2h antes
            </div>

            <div style={{ height: 1, background: '#EFE5D0', margin: '18px 0' }}/>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TshIcon name="clock" size={14} color="#8B7D6B"/>
                <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#5C5048' }}>{p.hours}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TshIcon name="pin" size={14} color="#8B7D6B"/>
                <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#5C5048' }}>{p.neighborhood}, Villa San Rafael</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TshIcon name="phone" size={14} color="#8B7D6B"/>
                <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#5C5048' }}>+54 9 2627 ···-···</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

Object.assign(window, { TshProfileMobile, TshProfileDesktop, TshAvailabilityStrip });
