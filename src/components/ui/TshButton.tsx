'use client';

import { TshIcon } from './TshIcon';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface TshButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'terra' | 'emerald' | 'secondary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconRight?: string;
  full?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses = {
  primary:   'bg-ink text-cream border-transparent hover:opacity-90',
  terra:     'bg-terra text-paper border-transparent hover:opacity-90',
  emerald:   'bg-emerald text-paper border-transparent hover:opacity-90',
  secondary: 'bg-transparent text-ink border-ink hover:bg-[#F5EDDE]',
  ghost:     'bg-transparent text-ink border-transparent hover:bg-[#EFE5D0]',
  soft:      'bg-[#FAF4E8] text-ink border-[#E5D9C2] hover:bg-[#F0E7D5]',
};

const sizeClasses = {
  sm: 'h-[34px] px-[14px] text-[13px] gap-[6px]',
  md: 'h-[46px] px-[20px] text-[15px] gap-[8px]',
  lg: 'h-[56px] px-[24px] text-[16px] gap-[10px]',
};

const iconColors = {
  primary: '#F5EDDE',
  terra: '#FFFBF3',
  emerald: '#FFFBF3',
  secondary: '#2A2420',
  ghost: '#2A2420',
  soft: '#2A2420',
};

const iconSizes = { sm: 14, md: 16, lg: 18 };

export function TshButton({
  children, variant = 'primary', size = 'md', icon, iconRight,
  full, onClick, className, disabled, type = 'button',
}: TshButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-sans font-semibold tracking-[0.01em] rounded-full border transition-all duration-150 active:scale-[0.98] outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        full && 'w-full',
        className,
      )}
    >
      {icon && <TshIcon name={icon} size={iconSizes[size]} color={iconColors[variant]}/>}
      {children}
      {iconRight && <TshIcon name={iconRight} size={iconSizes[size]} color={iconColors[variant]}/>}
    </button>
  );
}
