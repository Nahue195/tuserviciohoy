'use client';

import { TshIcon } from './TshIcon';
import type { CategoriaData } from '@/types';

interface TshCategoryTileProps {
  cat: CategoriaData;
  onClick?: () => void;
  count?: number;
}

export function TshCategoryTile({ cat, onClick, count }: TshCategoryTileProps) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      padding: 14, background: cat.tint, borderRadius: 16,
      cursor: 'pointer', aspectRatio: '1 / 1',
      transition: 'transform 180ms cubic-bezier(.2,.8,.2,1)',
      justifyContent: 'space-between',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.015)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TshIcon name={cat.icono} size={20} color={cat.color}/>
      </div>
      <div>
        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 17, color: cat.color, lineHeight: 1.1, letterSpacing: -0.2 }}>{cat.nombre}</div>
        {count !== undefined && (
          <div style={{ fontFamily: 'inherit', fontSize: 11, color: cat.color, opacity: 0.7, marginTop: 2 }}>{count} locales</div>
        )}
      </div>
    </div>
  );
}
