// TuServicioHoy — Shared UI primitives used across screens

// Button
const TshButton = ({ children, variant = 'primary', size = 'md', icon, iconRight, full, onClick, style = {}, disabled }) => {
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13, iconSize: 14, gap: 6, height: 34 },
    md: { padding: '12px 20px', fontSize: 15, iconSize: 16, gap: 8, height: 46 },
    lg: { padding: '16px 24px', fontSize: 16, iconSize: 18, gap: 10, height: 56 },
  };
  const variants = {
    primary:   { bg: '#2A2420', fg: '#F5EDDE', border: 'transparent' },
    terra:     { bg: '#C4532A', fg: '#FFFBF3', border: 'transparent' },
    emerald:   { bg: '#0F6E4E', fg: '#FFFBF3', border: 'transparent' },
    secondary: { bg: 'transparent', fg: '#2A2420', border: '#2A2420' },
    ghost:     { bg: 'transparent', fg: '#2A2420', border: 'transparent' },
    soft:      { bg: '#FAF4E8', fg: '#2A2420', border: '#E5D9C2' },
  };
  const sz = sizes[size]; const v = variants[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: sz.gap, padding: sz.padding, height: sz.height,
      background: v.bg, color: v.fg,
      border: `1px solid ${v.border}`,
      borderRadius: 9999, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'Instrument Sans, system-ui, sans-serif', fontWeight: 600,
      fontSize: sz.fontSize, letterSpacing: 0.1,
      width: full ? '100%' : undefined,
      opacity: disabled ? 0.5 : 1,
      transition: 'transform 140ms ease, box-shadow 140ms ease, background 140ms ease',
      outline: 'none',
      ...style,
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {icon && <TshIcon name={icon} size={sz.iconSize} color={v.fg}/>}
      {children}
      {iconRight && <TshIcon name={iconRight} size={sz.iconSize} color={v.fg}/>}
    </button>
  );
};

// Provider card — horizontal layout, used in home + search
const TshProviderCard = ({ provider, onClick, variant = 'list' }) => {
  const c = tshCat(provider.category);
  if (variant === 'featured') {
    // Vertical, bigger image
    return (
      <div onClick={onClick} style={{
        background: '#FFFBF3', borderRadius: 20, overflow: 'hidden',
        border: '1px solid #EFE5D0', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 180ms cubic-bezier(.2,.8,.2,1), box-shadow 180ms ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(60,40,20,0.06), 0 12px 36px rgba(60,40,20,0.10)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ position: 'relative', height: 140 }}>
          <TshPlaceholder label={provider.category} seed={provider.coverSeed} rounded={0} style={{ width: '100%', height: '100%' }}/>
          {provider.availableToday && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              padding: '4px 9px', borderRadius: 9999,
              background: 'rgba(15,110,78,0.95)', color: '#FFFBF3',
              fontFamily: 'Instrument Sans, system-ui, sans-serif', fontWeight: 600,
              fontSize: 10.5, letterSpacing: 0.4, textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C3E4B9' }}/>
              Disponible hoy
            </div>
          )}
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 17, color: '#2A2420', lineHeight: 1.15, letterSpacing: -0.2 }}>
                {provider.name}
              </div>
              <TshStars rating={provider.rating} reviews={provider.reviews} size={11}/>
            </div>
            <TshCategoryBadge cat={c} size="sm"/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B' }}>
            <TshIcon name="pin" size={12} color="#8B7D6B"/>
            {provider.neighborhood} · {provider.distanceKm} km
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #EFE5D0', paddingTop: 10 }}>
            <div>
              <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 10.5, color: '#8B7D6B', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Próximo turno</div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 14, color: '#2A2420', fontWeight: 500, marginTop: 1 }}>{provider.nextSlot}</div>
            </div>
            <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#2A2420', fontWeight: 600 }}>
              desde {tshFmtPrice(provider.priceFrom)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Horizontal list card
  return (
    <div onClick={onClick} style={{
      display: 'flex', gap: 14, padding: 14, background: '#FFFBF3',
      borderRadius: 18, border: '1px solid #EFE5D0', cursor: 'pointer',
      transition: 'transform 180ms cubic-bezier(.2,.8,.2,1), box-shadow 180ms ease, border-color 180ms ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(60,40,20,0.06), 0 10px 28px rgba(60,40,20,0.08)'; e.currentTarget.style.borderColor = '#E5D9C2'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#EFE5D0'; }}
    >
      <TshPlaceholder label={provider.category} seed={provider.coverSeed} rounded={12} style={{ width: 92, height: 92, flexShrink: 0 }}/>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 16, color: '#2A2420', lineHeight: 1.2, letterSpacing: -0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {provider.name}
          </div>
          <TshStars rating={provider.rating} reviews={provider.reviews} size={11}/>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <TshCategoryBadge cat={c} size="sm"/>
          <span style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#8B7D6B', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <TshIcon name="pin" size={11} color="#8B7D6B"/>
            {provider.distanceKm} km
          </span>
        </div>
        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12.5, color: '#5C5048', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {provider.description}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 4 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: provider.availableToday ? '#0F6E4E' : '#8B7D6B', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: provider.availableToday ? '#0F6E4E' : '#8B7D6B' }}/>
            {provider.nextSlot}
          </div>
          <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 12, color: '#2A2420', fontWeight: 600 }}>
            desde {tshFmtPrice(provider.priceFrom)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Category grid tile
const TshCategoryTile = ({ cat, onClick, count }) => {
  return (
    <div onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      padding: 14, background: cat.tint, borderRadius: 16,
      cursor: 'pointer', aspectRatio: '1 / 1',
      transition: 'transform 180ms cubic-bezier(.2,.8,.2,1), box-shadow 180ms ease',
      justifyContent: 'space-between',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.015)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TshIcon name={cat.icon} size={20} color={cat.color}/>
      </div>
      <div>
        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 17, color: cat.color, lineHeight: 1.1, letterSpacing: -0.2 }}>{cat.label}</div>
        <div style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif', fontSize: 11, color: cat.color, opacity: 0.7, marginTop: 2 }}>{count} locales</div>
      </div>
    </div>
  );
};

// Status pill for appointments
const TshStatusPill = ({ status }) => {
  const map = {
    confirmed: { bg: '#E3EFE8', fg: '#0F6E4E', label: 'Confirmado', dot: '#0F6E4E' },
    pending:   { bg: '#F7ECD0', fg: '#8B6A14', label: 'Pendiente',  dot: '#D69A2A' },
    cancelled: { bg: '#F2DAD2', fg: '#A03E1B', label: 'Cancelado',  dot: '#A03E1B' },
  };
  const m = map[status] || map.confirmed;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 9999, background: m.bg, color: m.fg,
      fontFamily: 'Instrument Sans, system-ui, sans-serif', fontWeight: 600,
      fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.dot }}/>
      {m.label}
    </span>
  );
};

Object.assign(window, {
  TshButton, TshProviderCard, TshCategoryTile, TshStatusPill,
});
