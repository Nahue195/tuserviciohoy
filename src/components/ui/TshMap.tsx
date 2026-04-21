'use client';

import { useEffect, useRef } from 'react';

export interface MapPin {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  priceFrom?: number;
  categoriaColor?: string;
}

interface TshMapProps {
  pins: MapPin[];
  height?: string;
  zoom?: number;
  singlePin?: boolean;
  scrollWheel?: boolean;
}

const DEFAULT_CENTER: [number, number] = [-36.0, -62.73];

export function TshMap({ pins, height = '400px', zoom, singlePin = false, scrollWheel = false }: TshMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then(({ default: L }) => {
      if (!containerRef.current || mapRef.current) return;

      const validPins = pins.filter(p => p.lat && p.lng);
      const center: [number, number] = validPins.length > 0
        ? [validPins[0].lat, validPins[0].lng]
        : DEFAULT_CENTER;

      const map = L.map(containerRef.current!, {
        center,
        zoom: zoom ?? (singlePin ? 15 : 13),
        scrollWheelZoom: scrollWheel,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      validPins.forEach((pin, i) => {
        const isHighlighted = i === 0 || singlePin;
        const color = isHighlighted ? '#E8673A' : (pin.categoriaColor ?? '#8B7D6B');

        const icon = L.divIcon({
          html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.28))">
            <div style="background:${color};color:white;font-family:sans-serif;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap;border:2px solid white">
              ${pin.priceFrom ? `$${Math.round(pin.priceFrom / 1000)}k` : pin.nombre.slice(0, 14)}
            </div>
            <div style="width:2px;height:6px;background:${color}"></div>
            <div style="width:7px;height:7px;border-radius:50%;background:${color};border:2px solid white"></div>
          </div>`,
          className: '',
          iconSize: [80, 40],
          iconAnchor: [40, 40],
          popupAnchor: [0, -42],
        });

        const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map as L.Map);

        if (!singlePin) {
          marker.bindPopup(`
            <div style="font-family:sans-serif;min-width:160px;padding:2px 0">
              <div style="font-weight:700;font-size:13px;color:#1A1208;margin-bottom:4px">${pin.nombre}</div>
              ${pin.priceFrom ? `<div style="font-size:12px;color:#8B7D6B;margin-bottom:8px">Desde $${pin.priceFrom.toLocaleString('es-AR')}</div>` : ''}
              <a href="/proveedor/${pin.id}" style="display:inline-block;background:#E8673A;color:white;font-size:11px;font-weight:700;padding:5px 12px;border-radius:8px;text-decoration:none">Ver perfil →</a>
            </div>
          `, { maxWidth: 220 });
        } else {
          marker.bindPopup(`<div style="font-family:sans-serif;font-weight:700;font-size:13px;color:#1A1208">${pin.nombre}</div>`);
        }
      });

      if (validPins.length > 1 && !singlePin) {
        const bounds = L.latLngBounds(validPins.map(p => [p.lat, p.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });

    return () => {
      if (mapRef.current) {
        (mapRef.current as L.Map).remove();
        mapRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} style={{ height, width: '100%', borderRadius: 'inherit' }} />;
}
