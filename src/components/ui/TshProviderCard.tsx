'use client';

import { TshPlaceholder } from './TshPlaceholder';
import { TshStars } from './TshStars';
import { TshIcon } from './TshIcon';
import { fmtPrice } from '@/lib/utils';
import type { ProveedorCard } from '@/types';

function VerifiedBadge() {
  return (
    <span title="Profesional verificado" className="shrink-0 w-[16px] h-[16px] rounded-full flex items-center justify-center" style={{ background: '#E8673A' }}>
      <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

interface TshProviderCardProps {
  provider: ProveedorCard;
  onClick?: () => void;
  variant?: 'list' | 'featured';
}

export function TshProviderCard({ provider: p, onClick, variant = 'list' }: TshProviderCardProps) {
  if (variant === 'featured') {
    return (
      <div
        onClick={onClick}
        className="group bg-[#FFFBF3] rounded-[20px] overflow-hidden border border-[#EFE5D0] cursor-pointer flex flex-col transition-all duration-[200ms] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(42,36,32,0.12)] hover:border-[#E5D9C2]"
      >
        {/* Cover */}
        <div className="relative h-[152px] overflow-hidden">
          {p.fotoPerfil ? (
            <img src={p.fotoPerfil} alt={p.nombre} className="w-full h-full object-cover"/>
          ) : (
            <TshPlaceholder label={p.categoria.slug} seed={p.coverSeed} rounded={0} style={{ width: '100%', height: '100%' }}/>
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,18,8,0.45) 0%, transparent 55%)' }}/>
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: p.categoria.color }}/>
          {p.availableToday && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(0,0,0,0.55)] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"/>
              <span className="font-sans font-semibold text-[10px] text-white tracking-[0.3px]">Disponible hoy</span>
            </div>
          )}
          {p.isPro && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: '#E8673A' }}>
              <span className="font-sans font-bold text-[9px] text-white tracking-[0.5px] uppercase">PRO</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="font-sans font-bold text-[15px] text-[#1A1208] leading-[1.2] tracking-[-0.3px] truncate">{p.nombre}</span>
              {p.isPro && <VerifiedBadge/>}
            </div>
            <TshStars rating={p.rating} reviews={p.reviews} size={10}/>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-sans text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: p.categoria.color, background: p.categoria.tint }}>
              {p.categoria.nombre}
            </span>
            <span className="font-sans text-[11px] text-[#8B7D6B] inline-flex items-center gap-0.5">
              <TshIcon name="pin" size={9} color="#8B7D6B"/>
              {p.neighborhood}
            </span>
          </div>

          <div className="flex justify-between items-center mt-auto pt-2.5 border-t border-[#F0E8D8]">
            <div className={`font-sans text-[11px] font-medium inline-flex items-center gap-1.5 ${p.availableToday ? 'text-[#0F6E4E]' : 'text-[#8B7D6B]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${p.availableToday ? 'bg-[#34D399]' : 'bg-[#C9BDA5]'}`}/>
              {p.nextSlot}
            </div>
            <div className="font-sans text-[13px] font-bold text-[#1A1208] tracking-[-0.2px]">
              {fmtPrice(p.priceFrom)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── List variant ─────────────────────────────────────────────────── */
  return (
    <div
      onClick={onClick}
      className="group flex gap-0 bg-[#FFFBF3] rounded-[18px] border border-[#EFE5D0] cursor-pointer transition-all duration-[180ms] hover:shadow-[0_8px_28px_rgba(42,36,32,0.09)] hover:border-[#E5D9C2] hover:-translate-y-px overflow-hidden"
    >
      {/* Category accent stripe */}
      <div className="w-[3px] shrink-0 rounded-l-[18px]" style={{ background: p.categoria.color }}/>

      {/* Photo */}
      <div className="relative shrink-0 overflow-hidden" style={{ width: 84, height: 84, margin: '12px 0 12px 12px', borderRadius: 12 }}>
        {p.fotoPerfil ? (
          <img src={p.fotoPerfil} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        ) : (
          <TshPlaceholder label={p.categoria.slug} seed={p.coverSeed} rounded={12} style={{ width: '100%', height: '100%' }}/>
        )}
        {p.availableToday && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <span className="w-1 h-1 rounded-full bg-[#34D399]"/>
            <span className="font-sans font-semibold text-[8px] text-white whitespace-nowrap">Hoy</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-3 pl-3 pr-4">
        {/* Top row */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-sans font-bold text-[14px] text-[#1A1208] leading-[1.2] tracking-[-0.2px] truncate">{p.nombre}</span>
            {p.isPro && <VerifiedBadge/>}
          </div>
          <TshStars rating={p.rating} reviews={p.reviews} size={10}/>
        </div>

        {/* Category + location */}
        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          <span className="font-sans text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: p.categoria.color, background: p.categoria.tint }}>
            {p.categoria.nombre}
          </span>
          <span className="font-sans text-[10px] text-[#8B7D6B] inline-flex items-center gap-0.5">
            <TshIcon name="pin" size={9} color="#8B7D6B"/>
            {p.distanceKm} km
          </span>
        </div>

        {/* Description */}
        {p.description && (
          <div className="font-sans text-[11px] text-[#5C5048] leading-[1.45] line-clamp-1 mt-1">
            {p.description}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex justify-between items-center mt-1.5">
          <div className="font-sans text-[10px] text-[#8B7D6B]">
            {p.hours?.split('·')[0]?.trim() ?? p.nextSlot}
          </div>
          <div className="font-sans text-[13px] font-bold text-[#1A1208] tracking-[-0.3px]">
            desde {fmtPrice(p.priceFrom)}
          </div>
        </div>
      </div>
    </div>
  );
}
