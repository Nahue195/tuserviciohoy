interface TshStatusPillProps {
  status: string;
}

const statusMap: Record<string, { bg: string; fg: string; label: string; dot: string }> = {
  CONFIRMADO: { bg: '#E3EFE8', fg: '#0F6E4E', label: 'Confirmado', dot: '#0F6E4E' },
  confirmed:  { bg: '#E3EFE8', fg: '#0F6E4E', label: 'Confirmado', dot: '#0F6E4E' },
  PENDIENTE:  { bg: '#F7ECD0', fg: '#8B6A14', label: 'Pendiente',  dot: '#D69A2A' },
  pending:    { bg: '#F7ECD0', fg: '#8B6A14', label: 'Pendiente',  dot: '#D69A2A' },
  CANCELADO:  { bg: '#F2DAD2', fg: '#A03E1B', label: 'Cancelado',  dot: '#A03E1B' },
  cancelled:  { bg: '#F2DAD2', fg: '#A03E1B', label: 'Cancelado',  dot: '#A03E1B' },
  COMPLETADO: { bg: '#E3EFE8', fg: '#0F6E4E', label: 'Completado', dot: '#0F6E4E' },
};

export function TshStatusPill({ status }: TshStatusPillProps) {
  const m = statusMap[status] ?? statusMap['PENDIENTE']!;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 9999, background: m.bg, color: m.fg,
      fontFamily: 'inherit', fontWeight: 600,
      fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.dot }}/>
      {m.label}
    </span>
  );
}
