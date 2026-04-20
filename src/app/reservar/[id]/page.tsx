'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { BookingFlow } from '@/components/screens/BookingFlow';
import type { ProveedorCard, DayOption } from '@/types';

export default function ReservarPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [proveedor, setProveedor] = useState<ProveedorCard | null>(null);
  const [loading, setLoading] = useState(true);

  // Read optional slot/date from query params (passed from profile availability picker)
  const initialSlot = searchParams.get('slot') ?? undefined;
  const fechaStr = searchParams.get('fecha');

  const initialDay: DayOption | undefined = fechaStr ? (() => {
    const date = new Date(fechaStr + 'T12:00:00');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    return {
      key: fechaStr,
      date,
      dayName: dayNames[date.getDay()] ?? '',
      dayNum: date.getDate(),
      month: date.getMonth(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isToday: date.toDateString() === today.toDateString(),
      isTomorrow: date.toDateString() === tomorrow.toDateString(),
    };
  })() : undefined;

  useEffect(() => {
    fetch(`/api/proveedores/${id}`)
      .then(r => r.json())
      .then((data: ProveedorCard) => { setProveedor(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="font-sans text-[15px]" style={{ background: '#140E08', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,237,222,0.4)' }}>
        Cargando…
      </div>
    );
  }

  if (!proveedor) return null;

  return <BookingFlow proveedor={proveedor} initialSlot={initialSlot} initialDay={initialDay} variant="page"/>;
}
