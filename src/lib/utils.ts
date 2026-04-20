import type { DayOption } from '@/types';

export function fmtPrice(n: number): string {
  return 'ARS ' + n.toLocaleString('es-AR');
}

export function getNextDays(count = 14): DayOption[] {
  const days: DayOption[] = [];
  const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      key: `${d.getMonth() + 1}-${d.getDate()}`,
      dayName: dayNames[d.getDay()] ?? 'lun',
      dayNum: d.getDate(),
      month: d.getMonth() + 1,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isToday: i === 0,
      isTomorrow: i === 1,
      date: d,
    });
  }
  return days;
}

export function generateConfirmCode(): string {
  return 'TSH-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

