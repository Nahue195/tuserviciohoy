'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ProfileScreenDesktop, ProfileScreenMobile } from '@/components/screens/ProfileScreen';
import type { ProveedorCard, DayOption } from '@/types';

export default function ProveedorPageClient() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [proveedor, setProveedor] = useState<ProveedorCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/proveedores/${id}`)
      .then(r => r.json())
      .then((data: ProveedorCard) => { setProveedor(data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  const reviews = (proveedor?.resenas ?? []).map((r, i) => ({
    name: r.name,
    rating: r.rating,
    text: r.text,
    date: new Date(r.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
    seed: i,
  }));

  const handleBook = (slot: string, day: DayOption) => {
    const fecha = day.date.toISOString().split('T')[0];
    router.push(`/reservar/${id}?slot=${encodeURIComponent(slot)}&fecha=${fecha}`);
  };

  if (loading) {
    return (
      <div className="font-sans text-[15px]" style={{ background: '#F5EDDE', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B7D6B' }}>
        Cargando…
      </div>
    );
  }

  if (!proveedor) {
    return (
      <div style={{ background: '#F5EDDE', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="font-sans font-bold text-[24px] mb-3" style={{ color: '#1A1208' }}>Proveedor no encontrado</div>
          <button onClick={() => router.push('/buscar')} className="font-sans text-[14px] bg-transparent border-none cursor-pointer font-semibold" style={{ color: '#E8673A' }}>Volver a la búsqueda</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="profile-desktop" style={{ display: 'none' }}>
        <ProfileScreenDesktop proveedor={proveedor} reviews={reviews} onBook={handleBook} />
      </div>
      <div id="profile-mobile">
        <ProfileScreenMobile proveedor={proveedor} reviews={reviews} onBook={handleBook} />
      </div>
      <style>{`
        @media (min-width: 768px) {
          #profile-mobile { display: none !important; }
          #profile-desktop { display: block !important; }
        }
      `}</style>
    </>
  );
}
