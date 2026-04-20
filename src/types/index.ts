import type { EstadoTurno, Role } from '@prisma/client';

export type { EstadoTurno, Role };

export interface CategoriaData {
  id: string;
  nombre: string;
  slug: string;
  icono: string;
  color: string;
  tint: string;
}

export interface ProveedorCard {
  id: string;
  nombre: string;
  person: string;
  categoria: CategoriaData;
  rating: number;
  reviews: number;
  priceFrom: number;
  neighborhood: string;
  distanceKm: number;
  nextSlot: string;
  availableToday: boolean;
  coverSeed: number;
  avatarSeed: number;
  description: string;
  tags: string[];
  hours: string;
  since: number;
  whatsapp?: string;
  isPro?: boolean;
  resenas?: { name: string; rating: number; text: string; date: string }[];
}

export interface SlotDisponible {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export interface TurnoData {
  id: string;
  proveedorId: string;
  clienteId: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  estado: EstadoTurno;
  servicio?: string | null;
  precio?: number | null;
  notas?: string | null;
  codigo: string;
  createdAt: Date;
}

export interface DayOption {
  key: string;
  dayName: string;
  dayNum: number;
  month: number;
  isWeekend: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  date: Date;
}

export interface BookingService {
  name: string;
  dur: number;
  price: number;
}
