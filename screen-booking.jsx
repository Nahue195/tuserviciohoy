// TuServicioHoy — Booking flow (bottom sheet on mobile, side drawer on desktop)

const TshBookingFlow = ({ providerId, initialSlot, initialDay, onClose, onDone, variant = 'sheet' }) => {
  const p = TSH_PROVIDERS.find(x => x.id === providerId) || TSH_PROVIDERS[0];
  const c = tshCat(p.category);
  const [step, setStep] = React.useState(1);
  const [slot, setSlot] = React.useState(initialSlot || '15:30');
  const [day, setDay] = React.useState(initialDay || TSH_DAYS[0]);
  const [selectedService, setSelectedService] = React.useState(0);
  const [name, setName] = React.useState('Sofía Pérez');
  const [phone, setPhone] = React.useState('+54 9 2627 45-8921');
  const [notes, setNotes] = React.useState('');
  const confirmCode = 'TSH-' + Math.random().toString(36).slice(2, 7).toUpperCase();

  const services = [
    { name: p.tags[0] || 'Consulta', dur: 30, price: p.priceFrom },
    { name: p.tags[1] || 'Sesión extendida', dur: 60, price: Math.round(p.priceFrom * 1.6) },
    { name: p.tags[2] || 'Paquete completo', dur: 120, price: Math.round(p.priceFrom * 2.4) },
  ];

  const Header = () => (
    <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid #EFE5D0', position: 'relative' }}>
      {variant === 'sheet' && (
        <div style={{ width: 36, height: 4, borderRadius: 9999, background: '#EADFC5', position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)' }}/>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: variant === 'sheet' ? 8 : 0 }}>
        {step > 1 && step < 4 && (
          <button onClick={() => setStep(step - 1)} style={{ width: 32, height: 32, borderRadius: 9999, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8 }}>
            <TshIcon name="chevronL" size={16} color="#2A2420"/>
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>
            {step === 4 ? 'Turno confirmado' : `Paso ${step} de 3`}
          </div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, color: '#2A2420', letterSpacing: -0.3, marginTop: 2 }}>
            {step === 1 ? 'Elegí fecha y hora' : step === 2 ? 'Tus datos' : step === 3 ? 'Confirmar reserva' : `¡Listo, ${name.split(' ')[0]}!`}
          </div>
        </div>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9999, background: '#FAF4E8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TshIcon name="close" size={14} color="#2A2420"/>
        </button>
      </div>
      {/* Progress */}
      {step < 4 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ flex: 1, height: 3, borderRadius: 9999, background: n <= step ? '#C4532A' : '#EADFC5', transition: 'background 200ms' }}/>
          ))}
        </div>
      )}
    </div>
  );

  // Provider summary bar (shown on steps 1-3)
  const ProviderSummary = () => (
    <div style={{ padding: '14px 20px', background: '#FAF4E8', display: 'flex', alignItems: 'center', gap: 12 }}>
      <TshAvatar name={p.person} seed={p.avatarSeed} size={40}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 14, color: '#2A2420', letterSpacing: -0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', marginTop: 1 }}>
          {c.label} · {p.neighborhood}
        </div>
      </div>
      <TshStars rating={p.rating} reviews={p.reviews} size={11} muted="#5C5048"/>
    </div>
  );

  // STEP 1
  const Step1 = () => {
    const disabled = TSH_DISABLED[day.key] || [];
    return (
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 }}>Servicio</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {services.map((s, i) => {
            const active = selectedService === i;
            return (
              <div key={i} onClick={() => setSelectedService(i)} style={{
                padding: 14, borderRadius: 14,
                background: active ? '#FFFBF3' : '#FFFBF3',
                border: `1.5px solid ${active ? '#C4532A' : '#E5D9C2'}`,
                cursor: 'pointer', transition: 'all 140ms',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${active ? '#C4532A' : '#E5D9C2'}`,
                  background: active ? '#C4532A' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFBF3' }}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: '#2A2420' }}>{s.name}</div>
                  <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', marginTop: 2 }}>{s.dur} min</div>
                </div>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 500, color: '#2A2420', letterSpacing: -0.2 }}>{tshFmtPrice(s.price)}</div>
              </div>
            );
          })}
        </div>

        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 }}>Fecha</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none', marginBottom: 18 }}>
          {TSH_DAYS.slice(0, 10).map(d => {
            const active = d.key === day.key;
            const closed = (TSH_DISABLED[d.key] || []).includes('all');
            return (
              <div key={d.key} onClick={() => !closed && setDay(d)} style={{
                flexShrink: 0, width: 56, padding: '10px 8px',
                borderRadius: 14, textAlign: 'center', cursor: closed ? 'not-allowed' : 'pointer',
                background: active ? '#2A2420' : '#FFFBF3',
                border: `1px solid ${active ? '#2A2420' : '#E5D9C2'}`,
                color: active ? '#F5EDDE' : (closed ? '#C9BDA5' : '#2A2420'),
                opacity: closed ? 0.5 : 1,
              }}>
                <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, opacity: 0.7 }}>
                  {d.isToday ? 'hoy' : d.isTomorrow ? 'mañ' : d.dayName}
                </div>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 20, lineHeight: 1.1, marginTop: 2 }}>{d.dayNum}</div>
              </div>
            );
          })}
        </div>

        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 }}>Hora disponible</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[...TSH_SLOTS_MORNING, ...TSH_SLOTS_AFTER].map(s => {
            const isOff = disabled.includes(s);
            const active = s === slot;
            return (
              <div key={s} onClick={() => !isOff && setSlot(s)} style={{
                padding: '9px 15px', borderRadius: 9999,
                background: active ? '#C4532A' : (isOff ? '#F5EDDE' : '#FFFBF3'),
                border: `1px solid ${active ? '#C4532A' : (isOff ? '#EADFC5' : '#E5D9C2')}`,
                color: active ? '#FFFBF3' : (isOff ? '#C9BDA5' : '#2A2420'),
                textDecoration: isOff ? 'line-through' : 'none',
                fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600,
                cursor: isOff ? 'not-allowed' : 'pointer', transition: 'all 140ms',
              }}>{s}</div>
            );
          })}
        </div>
      </div>
    );
  };

  // STEP 2
  const Step2 = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 }}>Nombre completo</label>
          <input value={name} onChange={e => setName(e.target.value)} style={{
            width: '100%', padding: '14px 16px', borderRadius: 12,
            border: '1.5px solid #E5D9C2', background: '#FFFBF3', boxSizing: 'border-box',
            fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 15, color: '#2A2420',
            outline: 'none',
          }}/>
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 }}>Teléfono</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} style={{
            width: '100%', padding: '14px 16px', borderRadius: 12,
            border: '1.5px solid #E5D9C2', background: '#FFFBF3', boxSizing: 'border-box',
            fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 15, color: '#2A2420',
            outline: 'none',
          }}/>
          <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', marginTop: 4 }}>
            Te enviamos el recordatorio por WhatsApp
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 }}>Notas para el profesional <span style={{ textTransform: 'none', fontWeight: 500, color: '#8B7D6B' }}>(opcional)</span></label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Cualquier detalle que nos quieras contar…" style={{
            width: '100%', padding: '12px 16px', borderRadius: 12,
            border: '1.5px solid #E5D9C2', background: '#FFFBF3', boxSizing: 'border-box',
            fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, color: '#2A2420',
            outline: 'none', resize: 'vertical',
          }}/>
        </div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '12px 14px', background: '#FAF4E8', borderRadius: 12, border: '1px solid #EFE5D0', marginTop: 4 }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid #0F6E4E', background: '#0F6E4E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <TshIcon name="check" size={12} color="#FFFBF3" strokeWidth={2.5}/>
          </div>
          <div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#2A2420' }}>Recordarme por WhatsApp</div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#5C5048', marginTop: 2 }}>24h y 1h antes del turno</div>
          </div>
        </label>
      </div>
    </div>
  );

  // STEP 3 — review
  const Step3 = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ background: '#FFFBF3', border: '1px solid #EFE5D0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px', display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid #EFE5D0' }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: '#C4532A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TshIcon name="calendar" size={20} color="#FFFBF3"/>
          </div>
          <div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 18, color: '#2A2420', letterSpacing: -0.3 }}>
              {day.isToday ? 'Hoy' : day.isTomorrow ? 'Mañana' : day.dayName} {day.dayNum} · {slot}
            </div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', marginTop: 2 }}>{services[selectedService].dur} minutos</div>
          </div>
        </div>
        {[
          ['Profesional', p.name],
          ['Servicio', services[selectedService].name],
          ['A nombre de', name],
          ['Teléfono', phone],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EFE5D0' }}>
            <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', fontWeight: 500 }}>{k}</span>
            <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#2A2420', fontWeight: 600, textAlign: 'right', maxWidth: '65%' }}>{v}</span>
          </div>
        ))}
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAF4E8' }}>
          <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#2A2420', fontWeight: 600 }}>Total</span>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 20, fontWeight: 500, color: '#2A2420', letterSpacing: -0.3 }}>{tshFmtPrice(services[selectedService].price)}</span>
        </div>
      </div>
      <div style={{ padding: '12px 14px', background: '#E3EFE8', borderRadius: 12, marginTop: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <TshIcon name="check" size={14} color="#0F6E4E" strokeWidth={2.5}/>
        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#0F6E4E', lineHeight: 1.5 }}>
          <strong>Sin cargo por reservar.</strong> Se paga en el local. Podés cancelar gratis hasta 2h antes.
        </div>
      </div>
    </div>
  );

  // STEP 4 — confirmation
  const Step4 = () => (
    <div style={{ padding: '28px 20px', textAlign: 'center' }}>
      {/* Animated success */}
      <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#E3EFE8', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: '#0F6E4E', opacity: 0.15, animation: 'tsh-pulse 2s ease-out infinite' }}/>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0F6E4E', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <TshIcon name="check" size={32} color="#FFFBF3" strokeWidth={3}/>
        </div>
      </div>
      <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 26, color: '#2A2420', letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 8, textWrap: 'pretty' }}>
        Tu turno está <span style={{ fontStyle: 'italic', color: '#0F6E4E' }}>confirmado</span>
      </div>
      <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 14, color: '#5C5048', marginBottom: 20 }}>
        Te esperamos el {day.isToday ? 'día de hoy' : day.isTomorrow ? 'día de mañana' : day.dayName + ' ' + day.dayNum} a las {slot}
      </div>

      <div style={{ background: '#FFFBF3', border: '1px dashed #E5D9C2', borderRadius: 16, padding: 16, marginBottom: 20, textAlign: 'left' }}>
        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>Código de turno</div>
        <div style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 24, fontWeight: 600, color: '#C4532A', letterSpacing: 2, textAlign: 'center', marginBottom: 12 }}>{confirmCode}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12, borderTop: '1px dashed #EADFC5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TshAvatar name={p.person} seed={p.avatarSeed} size={32}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#2A2420' }}>{p.name}</div>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: '#8B7D6B' }}>{p.neighborhood}, Villa San Rafael</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <TshButton variant="primary" size="lg" full icon="calendar">Agregar al calendario</TshButton>
        <TshButton variant="secondary" size="md" full icon="map">Cómo llegar</TshButton>
        <div onClick={onDone} style={{ padding: '12px', textAlign: 'center', fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 13, color: '#8B7D6B', cursor: 'pointer', fontWeight: 500 }}>
          Volver al inicio
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <style>{`@keyframes tsh-pulse { 0% { transform: scale(1); opacity: 0.4 } 100% { transform: scale(1.6); opacity: 0 } }`}</style>
      <Header/>
      {step < 4 && <ProviderSummary/>}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {step === 1 && <Step1/>}
        {step === 2 && <Step2/>}
        {step === 3 && <Step3/>}
        {step === 4 && <Step4/>}
      </div>
      {step < 4 && (
        <div style={{ padding: '14px 20px 20px', borderTop: '1px solid #EFE5D0', background: '#FFFBF3', display: 'flex', gap: 10, alignItems: 'center' }}>
          {step < 3 && (
            <div style={{ flex: '0 0 auto' }}>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>Total</div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 18, fontWeight: 500, color: '#2A2420' }}>{tshFmtPrice(services[selectedService].price)}</div>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <TshButton variant="terra" size="lg" full iconRight={step === 3 ? 'check' : 'arrowR'} onClick={() => setStep(step + 1)}>
              {step === 1 ? 'Continuar' : step === 2 ? 'Revisar' : 'Confirmar turno'}
            </TshButton>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { TshBookingFlow });
