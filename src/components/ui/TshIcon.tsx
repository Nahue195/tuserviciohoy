'use client';

interface TshIconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function TshIcon({ name, size = 20, color = 'currentColor', strokeWidth = 1.6 }: TshIconProps) {
  const p = { stroke: color, strokeWidth, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  const paths: Record<string, React.ReactNode> = {
    search: <g {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></g>,
    pin: <g {...p}><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></g>,
    star: <path d="M12 2.5 14.6 8l6 .9-4.4 4.2 1.1 6.1L12 16.3 6.7 19.2l1.1-6.1L3.4 8.9 9.4 8z" fill={color} stroke="none"/>,
    starLine: <path d="M12 2.5 14.6 8l6 .9-4.4 4.2 1.1 6.1L12 16.3 6.7 19.2l1.1-6.1L3.4 8.9 9.4 8z" {...p}/>,
    calendar: <g {...p}><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></g>,
    clock: <g {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></g>,
    check: <path d="m4 12 5 5 11-11" {...p}/>,
    chevronR: <path d="m9 5 7 7-7 7" {...p}/>,
    chevronL: <path d="m15 5-7 7 7 7" {...p}/>,
    chevronD: <path d="m5 9 7 7 7-7" {...p}/>,
    plus: <path d="M12 5v14M5 12h14" {...p}/>,
    minus: <path d="M5 12h14" {...p}/>,
    close: <path d="M6 6l12 12M18 6 6 18" {...p}/>,
    filter: <g {...p}><path d="M4 6h16M7 12h10M10 18h4"/></g>,
    heart: <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z" {...p}/>,
    heartFill: <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z" fill={color} stroke={color} strokeWidth="1"/>,
    user: <g {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8"/></g>,
    share: <g {...p}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></g>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" {...p}/>,
    msg: <g {...p}><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H6a2 2 0 0 1-2-2z"/></g>,
    map: <g {...p}><path d="M3 6.5 9 4l6 2.5 6-2.5v13l-6 2.5-6-2.5L3 19.5z"/><path d="M9 4v15M15 6.5v15"/></g>,
    scissors: <g {...p}><circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.5 8.5 20 17M8.5 15.5 20 7"/></g>,
    scale: <g {...p}><path d="M12 4v16M4 20h16M8 8l-4 6a4 4 0 0 0 8 0zM16 8l-4 6a4 4 0 0 0 8 0z"/></g>,
    wrench: <path d="M14.7 6.3a4 4 0 0 1 5 5L17 14l3 3-3 3-3-3-2.7 2.7a4 4 0 0 1-5-5L10 12 6 8l2-2 4 4z" {...p}/>,
    paw: <g {...p}><ellipse cx="6" cy="10" rx="1.8" ry="2.4"/><ellipse cx="10" cy="6" rx="1.8" ry="2.4"/><ellipse cx="14" cy="6" rx="1.8" ry="2.4"/><ellipse cx="18" cy="10" rx="1.8" ry="2.4"/><path d="M12 11a4 4 0 0 0-4 4c0 2 1.5 3 2.5 3.5s1 1.5 1.5 1.5 1-1 2-1.5 2.5-1.5 2.5-3.5a4 4 0 0 0-4-4z"/></g>,
    book: <g {...p}><path d="M4 5v14l8-3 8 3V5l-8 3z"/><path d="M12 8v11"/></g>,
    lotus: <g {...p}><path d="M12 20c-4 0-7-3-7-6 2 0 4 1 5 3M12 20c4 0 7-3 7-6-2 0-4 1-5 3M12 20V10M12 10c-3 0-5-2-5-5 2 0 5 2 5 5zM12 10c3 0 5-2 5-5-2 0-5 2-5 5z"/></g>,
    car: <g {...p}><path d="M3 14l2-6a2 2 0 0 1 2-1.5h10a2 2 0 0 1 2 1.5l2 6v4a1 1 0 0 1-1 1h-2v-2H6v2H4a1 1 0 0 1-1-1z"/><circle cx="7" cy="15" r="1.2" fill={color}/><circle cx="17" cy="15" r="1.2" fill={color}/></g>,
    home: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" {...p}/>,
    calendar2: <g {...p}><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h2M12 14h2M16 14h2M8 17h2M12 17h2"/></g>,
    chart: <g {...p}><path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="6" rx="0.5" fill={color}/><rect x="12" y="8" width="3" height="10" rx="0.5" fill={color}/><rect x="17" y="14" width="3" height="4" rx="0.5" fill={color}/></g>,
    bell: <g {...p}><path d="M6 10a6 6 0 0 1 12 0v4l1.5 3h-15L6 14z"/><path d="M10 20a2 2 0 0 0 4 0"/></g>,
    settings: <g {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></g>,
    sparkle: <g {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/></g>,
    menu: <g {...p}><path d="M4 7h16M4 12h16M4 17h10"/></g>,
    arrowR: <path d="M5 12h14m-5-5 5 5-5 5" {...p}/>,
    arrowL: <path d="M19 12H5m5-5-5 5 5 5" {...p}/>,
    dot: <circle cx="12" cy="12" r="3" fill={color} stroke="none"/>,
    bolt: <path d="M13 2L4 14h7v8l9-12h-7z" fill={color} stroke="none"/>,
    droplet: <path d="M12 2.5C12 2.5 5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5z" {...p}/>,
    camera: <g {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><circle cx="12" cy="14" r="3.5"/><path d="M8 7V5.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1V7"/></g>,
    monitor: <g {...p}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></g>,
    broom: <g {...p}><path d="M18 3 7 14M7 14l-2 5 5-2M7 14l-3 3"/><path d="M15 6l3 3"/></g>,
    music: <g {...p}><path d="M9 18V6l12-3v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="15" r="3"/></g>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      {paths[name] ?? null}
    </svg>
  );
}
