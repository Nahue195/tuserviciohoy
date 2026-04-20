import type { CSSProperties } from 'react';

interface TshPlaceholderProps {
  label?: string;
  seed?: number;
  style?: CSSProperties;
  rounded?: number;
}

const palettes: [string, string][] = [
  ['#E8C9A0', '#D4A574'],
  ['#E4B8A0', '#C4907A'],
  ['#C9D4B5', '#9AA889'],
  ['#DFC8D8', '#B696A8'],
  ['#D4C3A0', '#A8936B'],
  ['#B8CDC4', '#86A395'],
];

export function TshPlaceholder({ label = 'foto', seed = 1, style = {}, rounded = 16 }: TshPlaceholderProps) {
  const [a, b] = palettes[seed % palettes.length] ?? palettes[0]!;
  const id = `ph-${seed}-${label.replace(/\s/g, '')}`;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: rounded, background: a, ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="8" height="8" fill={a}/>
            <rect width="4" height="8" fill={b} opacity="0.55"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#${id})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 10, letterSpacing: 0.5, color: 'rgba(42,36,32,0.5)',
        textTransform: 'lowercase',
      }}>{label}</div>
    </div>
  );
}
