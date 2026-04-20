// TuServicioHoy — Provider dashboard (desktop focus, mobile condensed)

const TshDashboardDesktop = ({ onNav }) => {
  const hours = Array.from({ length: 10 }, (_, i) => 9 + i); // 9 to 18
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const today = 0; // Mon

  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%', display: 'grid', gridTemplateColumns: '240px 1fr' }}>
      {/* Sidebar */}
      <aside style={{ background: '#2A2420', padding: '24px 20px', color: '#F5EDDE', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div onClick={() => onNav('home')} style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, letterSpacing: -0.4, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
          Tu<span style={{ color: '#E88A5F', fontStyle: 'italic' }}>Servicio</span>Hoy
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid rgba(245,237,222,0.12)', borderBottom: '1px solid rgba(245,237,222,0.12)' }}>
          <TshAvatar name="Marta Gallardo" seed={3} size={36}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Peluquería Doña Marta</div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, opacity: 0.6 }}>Plan gratuito</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { id: 'agenda', label: 'Agenda', icon: 'calendar2', active: true },
            { id: 'clientes', label: 'Clientes', icon: 'user' },
            { id: 'servicios', label: 'Servicios y precios', icon: 'sparkle' },
            { id: 'perfil', label: 'Mi perfil público', icon: 'home' },
            { id: 'stats', label: 'Estadísticas', icon: 'chart' },
            { id: 'config', label: 'Configuración', icon: 'settings' },
          ].map(item => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10,
              background: item.active ? 'rgba(245,237,222,0.1)' : 'transparent',
              cursor: 'pointer',
              fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13.5, fontWeight: item.active ? 600 : 500,
              color: item.active ? '#F5EDDE' : 'rgba(245,237,222,0.7)',
            }}>
              <TshIcon name={item.icon} size={16} color="currentColor"/>
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: 14, background: '#C4532A', borderRadius: 14 }}>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 500, letterSpacing: -0.2, marginBottom: 4 }}>Mejorá a Pro</div>
          <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, opacity: 0.9, marginBottom: 10, lineHeight: 1.4 }}>Reportes avanzados y recordatorios automáticos</div>
          <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            Ver planes <TshIcon name="arrowR" size={12} color="#F5EDDE"/>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ padding: '28px 36px 40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 6 }}>Sábado 18 de abril</div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 38, color: '#2A2420', margin: 0, letterSpacing: -0.8, textWrap: 'pretty' }}>
              Hola, <span style={{ fontStyle: 'italic', color: '#C4532A' }}>Marta</span>. Tenés 6 turnos hoy.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button style={{ width: 40, height: 40, borderRadius: 9999, background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <TshIcon name="bell" size={16} color="#2A2420"/>
              <div style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#C4532A', border: '2px solid #FFFBF3' }}/>
            </button>
            <TshButton variant="secondary" size="sm" icon="close">Bloquear horario</TshButton>
            <TshButton variant="primary" size="sm" icon="plus">Nuevo turno</TshButton>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Turnos hoy', value: '6', sub: '4 confirmados · 1 pendiente', color: '#2A2420', trend: null },
            { label: 'Esta semana', value: '34', sub: '+12% vs semana anterior', color: '#0F6E4E', trend: 'up' },
            { label: 'Clientes nuevos', value: '8', sub: 'este mes', color: '#C4532A', trend: null },
            { label: 'Calificación', value: '4.9', sub: '184 reseñas', color: '#D69A2A', trend: null, isStar: true },
          ].map(s => (
            <div key={s.label} style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 18, padding: 18 }}>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 }}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 40, fontWeight: 500, color: s.color, letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
                {s.isStar && <TshIcon name="star" size={18} color="#D69A2A"/>}
                {s.trend === 'up' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: '2px 7px', borderRadius: 9999, background: '#E3EFE8', color: '#0F6E4E', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, fontWeight: 700 }}>
                    <TshIcon name="arrowR" size={10} color="#0F6E4E" strokeWidth={2.5}/>
                    +12%
                  </span>
                )}
              </div>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Week calendar */}
          <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 22, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #EFE5D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', letterSpacing: -0.3 }}>Agenda semanal</div>
                <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', marginTop: 2 }}>14 — 19 de abril</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ width: 32, height: 32, borderRadius: 9, background: 'transparent', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <TshIcon name="chevronL" size={12} color="#2A2420"/>
                </button>
                <div style={{ padding: '0 14px', height: 32, borderRadius: 9, background: '#FAF4E8', border: '1px solid #E5D9C2', display: 'inline-flex', alignItems: 'center', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: '#2A2420' }}>Hoy</div>
                <button style={{ width: 32, height: 32, borderRadius: 9, background: 'transparent', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <TshIcon name="chevronR" size={12} color="#2A2420"/>
                </button>
              </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '52px repeat(6, 1fr)', position: 'relative' }}>
              {/* Top: day labels */}
              <div/>
              {days.map((d, i) => (
                <div key={d} style={{ padding: '12px 8px 10px', textAlign: 'center', borderBottom: '1px solid #EFE5D0', borderLeft: '1px solid #EFE5D0', background: i === today ? '#FAF4E8' : 'transparent' }}>
                  <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>{d.slice(0, 3)}</div>
                  <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: i === today ? '#C4532A' : '#2A2420', marginTop: 2, letterSpacing: -0.3 }}>{13 + i + 1}</div>
                </div>
              ))}

              {/* Hour rows */}
              {hours.map((h, hi) => (
                <React.Fragment key={h}>
                  <div style={{ padding: '4px 6px 0 12px', textAlign: 'right', borderBottom: '1px dashed #F0E6CE', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, color: '#8B7D6B', fontWeight: 600, height: 52 }}>
                    {String(h).padStart(2, '0')}:00
                  </div>
                  {days.map((_, di) => (
                    <div key={di} style={{
                      height: 52, borderBottom: '1px dashed #F0E6CE', borderLeft: '1px solid #EFE5D0',
                      position: 'relative', background: di === today ? '#FAF4E8' : 'transparent',
                    }}/>
                  ))}
                </React.Fragment>
              ))}

              {/* Appointment blocks — absolutely positioned overlay */}
              {TSH_WEEK_SCHEDULE.map((a, i) => {
                const colWidth = `calc((100% - 52px) / 6)`;
                const left = `calc(52px + ${colWidth} * ${a.day} + 4px)`;
                const width = `calc(${colWidth} - 8px)`;
                const top = `${41 + (a.start - 9) * 52}px`; // 41 = header row height
                const height = `${(a.end - a.start) * 52 - 4}px`;
                const bg = a.color === '#D9634A' ? '#FBE6DD' : '#E3EFE8';
                const fg = a.color === '#D9634A' ? '#A03E1B' : '#0F6E4E';
                return (
                  <div key={i} style={{
                    position: 'absolute', left, width, top, height,
                    background: bg, borderLeft: `3px solid ${a.color}`, borderRadius: 7,
                    padding: '5px 8px', overflow: 'hidden',
                    fontFamily: 'Instrument Sans, system-ui, sans-serif',
                    cursor: 'pointer',
                    transition: 'transform 140ms ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: fg, lineHeight: 1.2 }}>{String(Math.floor(a.start)).padStart(2, '0')}:{a.start % 1 ? '30' : '00'}</div>
                    <div style={{ fontSize: 11, color: fg, opacity: 0.85, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.client}</div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ padding: '12px 22px', borderTop: '1px solid #EFE5D0', display: 'flex', gap: 18, alignItems: 'center', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#5C5048' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: '#D9634A', borderRadius: 3 }}/> Corte / Peinado
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: '#0F6E4E', borderRadius: 3 }}/> Color / Tratamiento
              </div>
              <div style={{ marginLeft: 'auto', color: '#8B7D6B' }}>
                9:00 — 19:00 · Lun a Sáb
              </div>
            </div>
          </div>

          {/* Today's appointments */}
          <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 22, padding: '18px 20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', letterSpacing: -0.3 }}>Turnos de hoy</div>
                <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', marginTop: 2 }}>Próximo en 45 min</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TSH_TODAY_APPTS.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '12px 12px', background: '#FAF4E8',
                  borderRadius: 12, border: '1px solid #EFE5D0',
                  position: 'relative',
                }}>
                  {i === 1 && (
                    <div style={{ position: 'absolute', top: -1, bottom: -1, left: -1, width: 3, background: '#C4532A', borderRadius: '2px 0 0 2px' }}/>
                  )}
                  <div style={{ width: 48, textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 17, fontWeight: 500, color: '#2A2420', letterSpacing: -0.3, lineHeight: 1 }}>{a.time}</div>
                    <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, color: '#8B7D6B', fontWeight: 600, marginTop: 2 }}>{a.duration}min</div>
                  </div>
                  <div style={{ width: 1, background: '#EADFC5' }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <TshAvatar name={a.client} seed={a.avatarSeed} size={22}/>
                      <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#2A2420', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.client}</span>
                    </div>
                    <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#5C5048', marginBottom: 6 }}>{a.service}</div>
                    <TshStatusPill status={a.status}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '10px', textAlign: 'center', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#C4532A', fontWeight: 600, cursor: 'pointer' }}>
              Ver agenda completa
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const TshDashboardMobile = ({ onNav }) => {
  return (
    <div style={{ background: '#F5EDDE', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TshAvatar name="Marta Gallardo" seed={3} size={36}/>
            <div>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>Sábado 18</div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 16, color: '#2A2420', letterSpacing: -0.2 }}>Hola, Marta</div>
            </div>
          </div>
          <button style={{ width: 40, height: 40, borderRadius: 9999, background: '#FFFBF3', border: '1px solid #E5D9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <TshIcon name="bell" size={16} color="#2A2420"/>
            <div style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#C4532A', border: '2px solid #FFFBF3' }}/>
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: '#2A2420', borderRadius: 16, padding: 14, color: '#F5EDDE' }}>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, opacity: 0.7 }}>Turnos hoy</div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 38, fontWeight: 500, letterSpacing: -1, lineHeight: 1, marginTop: 4 }}>6</div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, opacity: 0.7, marginTop: 4 }}>Próximo 9:00</div>
          </div>
          <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 16, padding: 14 }}>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>Semana</div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 38, fontWeight: 500, color: '#0F6E4E', letterSpacing: -1, lineHeight: 1, marginTop: 4 }}>34</div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#0F6E4E', marginTop: 4, fontWeight: 600 }}>↑ +12%</div>
          </div>
        </div>

        {/* Rating card */}
        <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: '#F7ECD0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TshIcon name="star" size={20} color="#D69A2A"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', fontWeight: 600 }}>Calificación promedio</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, fontWeight: 500, color: '#2A2420', letterSpacing: -0.3 }}>4.9</span>
              <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B' }}>· 184 reseñas</span>
            </div>
          </div>
          <TshIcon name="chevronR" size={16} color="#8B7D6B"/>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <TshButton variant="primary" size="sm" icon="plus" style={{ flex: 1 }}>Nuevo turno</TshButton>
          <TshButton variant="soft" size="sm" icon="close" style={{ flex: 1 }}>Bloquear</TshButton>
        </div>

        {/* Today's list */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', margin: 0, letterSpacing: -0.3 }}>Turnos de hoy</h2>
          <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', fontWeight: 600 }}>6 confirmados</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 80 }}>
          {TSH_TODAY_APPTS.map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: 12, background: '#FFFBF3',
              borderRadius: 14, border: '1px solid #EFE5D0',
              alignItems: 'center',
            }}>
              <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 44 }}>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 500, color: '#2A2420', letterSpacing: -0.3, lineHeight: 1 }}>{a.time}</div>
                <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 9, color: '#8B7D6B', fontWeight: 600, marginTop: 2 }}>{a.duration}min</div>
              </div>
              <div style={{ width: 1, height: 36, background: '#EADFC5' }}/>
              <TshAvatar name={a.client} seed={a.avatarSeed} size={32}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#2A2420', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.client}</div>
                <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#5C5048', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.service}</div>
              </div>
              <TshStatusPill status={a.status}/>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 34, background: 'rgba(255,251,243,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #EADFC5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0 6px' }}>
          {[
            { icon: 'calendar2', label: 'Agenda', active: true },
            { icon: 'user', label: 'Clientes' },
            { icon: 'chart', label: 'Stats' },
            { icon: 'settings', label: 'Ajustes' },
          ].map(n => (
            <div key={n.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: n.active ? '#C4532A' : '#8B7D6B' }}>
              <TshIcon name={n.icon} size={22} color="currentColor"/>
              <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, fontWeight: 600 }}>{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { TshDashboardDesktop, TshDashboardMobile });
