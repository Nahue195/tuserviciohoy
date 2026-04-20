import { TshIcon } from './TshIcon';

interface TshStarsProps {
  rating?: number;
  size?: number;
  color?: string;
  showNumber?: boolean;
  reviews?: number;
  muted?: string;
}

export function TshStars({ rating = 4.8, size = 12, color = '#C4532A', showNumber = true, reviews, muted = '#8B7D6B' }: TshStarsProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <TshIcon name="star" size={size} color={color}/>
      <span style={{ fontFamily: 'inherit', fontSize: size + 1, fontWeight: 600, color: '#2A2420' }}>{rating.toFixed(1)}</span>
      {showNumber && reviews !== undefined && (
        <span style={{ fontFamily: 'inherit', fontSize: size, color: muted }}>({reviews})</span>
      )}
    </div>
  );
}
