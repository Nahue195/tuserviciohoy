import { TshIcon } from './TshIcon';
import type { CategoriaData } from '@/types';

interface TshCategoryBadgeProps {
  cat: CategoriaData;
  size?: 'sm' | 'md';
}

export function TshCategoryBadge({ cat, size = 'md' }: TshCategoryBadgeProps) {
  const sz = size === 'sm'
    ? { padding: '3px 9px', fontSize: 11, iconSize: 11, gap: 4 }
    : { padding: '5px 11px', fontSize: 12, iconSize: 12, gap: 5 };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: sz.gap,
      padding: sz.padding, borderRadius: 9999, background: cat.tint, color: cat.color,
      fontFamily: 'inherit', fontWeight: 600,
      fontSize: sz.fontSize, letterSpacing: 0.1, lineHeight: 1,
    }}>
      <TshIcon name={cat.icono} size={sz.iconSize} color={cat.color}/>
      {cat.nombre}
    </span>
  );
}
