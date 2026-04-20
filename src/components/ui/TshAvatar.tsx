interface TshAvatarProps {
  name?: string;
  seed?: number;
  size?: number;
}

const palettes: [string, string][] = [
  ['#E4B8A0', '#A03E1B'],
  ['#C9D4B5', '#3D5530'],
  ['#DFC8D8', '#7A3A5A'],
  ['#D4C3A0', '#7A5A1A'],
  ['#B8CDC4', '#2A5548'],
  ['#F2C6B0', '#A03E1B'],
];

export function TshAvatar({ name = 'A', seed = 0, size = 40 }: TshAvatarProps) {
  const [bg, fg] = palettes[seed % palettes.length] ?? palettes[0]!;
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: fg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500,
      fontSize: size * 0.42, lineHeight: 1,
    }}>{initial}</div>
  );
}
