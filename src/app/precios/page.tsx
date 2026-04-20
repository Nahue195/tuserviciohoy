import { TshNavBar } from '@/components/ui/TshNavBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planes y precios | TuServicioHoy',
  description: 'Comenzá gratis con hasta 20 turnos por mes, o suscribite al Plan Pro para turnos ilimitados, destacarte en búsquedas y obtener el badge verificado.',
  openGraph: {
    title: 'Planes y precios | TuServicioHoy',
    description: 'Plan Starter gratuito o Plan Pro con todas las funciones para hacer crecer tu negocio.',
    siteName: 'TuServicioHoy',
    locale: 'es_AR',
    type: 'website',
  },
};

const FREE_FEATURES = [
  { text: 'Perfil público en TuServicioHoy', ok: true },
  { text: 'Hasta 20 turnos por mes', ok: true },
  { text: 'Gestión de servicios y precios', ok: true },
  { text: 'Página de agenda básica', ok: true },
  { text: 'Estadísticas avanzadas', ok: false },
  { text: 'Aparecés destacado en búsquedas', ok: false },
  { text: 'Badge verificado ✓', ok: false },
  { text: 'Publicidad en redes sociales', ok: false },
];

const PRO_FEATURES = [
  { text: 'Todo lo del plan Starter', ok: true },
  { text: 'Turnos ilimitados', ok: true },
  { text: 'Estadísticas completas de negocio', ok: true },
  { text: 'Destacado en búsquedas y categorías', ok: true },
  { text: 'Badge verificado ✓ en tu perfil', ok: true },
  { text: 'Publicidad en Instagram y Facebook', ok: true },
  { text: 'Soporte prioritario por WhatsApp', ok: true },
  { text: '1 mes gratis si pagás el año', ok: true },
];

const FAQ = [
  {
    q: '¿Cuándo me cobran?',
    a: 'El pago es mensual, desde el día que activás el plan. Podés cancelar en cualquier momento sin penalidades.',
  },
  {
    q: '¿Qué pasa cuando llego a 20 turnos en el plan gratuito?',
    a: 'Tus clientes todavía pueden ver tu perfil, pero no pueden reservar nuevos turnos hasta que upgrades o empiece el mes siguiente.',
  },
  {
    q: '¿Cómo funciona la publicidad en redes?',
    a: 'El equipo de TuServicioHoy crea y publica una story o post con tu negocio en nuestra cuenta de Instagram y Facebook una vez por mes.',
  },
  {
    q: '¿Puedo probar Pro antes de pagar?',
    a: 'Sí, contactanos y te damos 15 días gratis sin tarjeta.',
  },
];

function Check({ ok }: { ok: boolean }) {
  if (ok) return (
    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#E8673A' }}>
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
  return (
    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#F0E8D6' }}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="#C9BDA5" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-cream">
      <TshNavBar city="Argentina"/>

      <div className="max-w-[960px] mx-auto px-4 md:px-8 py-14 md:py-20">

        {/* Hero */}
        <div className="text-center mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E5D9C2] bg-paper font-sans text-[12px] font-semibold text-[#8B7D6B] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8673A] inline-block"/>
            Planes y precios
          </div>
          <h1 className="font-sans font-bold text-[38px] md:text-[52px] text-ink tracking-[-1.2px] leading-[1.1] mb-4 m-0">
            Crecé sin límites
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] text-[#8B7D6B] leading-[1.65] max-w-[500px] mx-auto m-0">
            Empezá gratis y pasá a Pro cuando estés listo. Sin contratos, sin sorpresas.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[720px] mx-auto mb-16">

          {/* Starter */}
          <div className="bg-paper border border-[#EFE5D0] rounded-3xl p-7 flex flex-col">
            <div className="mb-6">
              <div className="font-sans text-[11px] uppercase tracking-[1px] font-bold text-[#8B7D6B] mb-2">Starter</div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="font-sans font-bold text-[42px] tracking-[-1.5px] text-ink">Gratis</span>
              </div>
              <div className="font-sans text-[13px] text-[#8B7D6B]">Para arrancar y validar</div>
            </div>

            <div className="flex flex-col gap-3 flex-1 mb-7">
              {FREE_FEATURES.map(f => (
                <div key={f.text} className="flex items-center gap-3">
                  <Check ok={f.ok}/>
                  <span className={`font-sans text-[13px] ${f.ok ? 'text-ink' : 'text-[#C9BDA5] line-through'}`}>{f.text}</span>
                </div>
              ))}
            </div>

            <a
              href="/registrar-negocio"
              className="block w-full py-3.5 text-center font-sans font-bold text-[14px] rounded-xl border-2 border-[#E5D9C2] text-[#8B7D6B] no-underline hover:border-terra hover:text-terra transition-colors"
            >
              Empezar gratis
            </a>
          </div>

          {/* Pro */}
          <div className="relative rounded-3xl flex flex-col overflow-hidden" style={{ background: '#1A1208' }}>
            {/* Popular badge */}
            <div className="absolute top-5 right-5">
              <div className="px-3 py-1 rounded-full font-sans text-[11px] font-bold" style={{ background: '#E8673A', color: 'white' }}>
                Más popular
              </div>
            </div>

            <div className="p-7 flex flex-col flex-1">
              <div className="mb-6">
                <div className="font-sans text-[11px] uppercase tracking-[1px] font-bold mb-2" style={{ color: 'rgba(245,237,222,0.4)' }}>Pro</div>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="font-sans font-bold text-[42px] tracking-[-1.5px]" style={{ color: '#F5EDDE' }}>$14.900</span>
                  <span className="font-sans text-[14px]" style={{ color: 'rgba(245,237,222,0.4)' }}>/mes</span>
                </div>
                <div className="font-sans text-[13px]" style={{ color: 'rgba(245,237,222,0.4)' }}>
                  O <strong style={{ color: '#E8673A' }}>$11.900/mes</strong> pagando el año
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1 mb-7">
                {PRO_FEATURES.map(f => (
                  <div key={f.text} className="flex items-center gap-3">
                    <Check ok={f.ok}/>
                    <span className="font-sans text-[13px]" style={{ color: f.ok ? '#F5EDDE' : 'rgba(245,237,222,0.3)' }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/542392617818?text=${encodeURIComponent('Hola! Quiero saber más sobre el plan Pro de TuServicioHoy')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 text-center font-sans font-bold text-[14px] rounded-xl no-underline transition-opacity hover:opacity-85"
                style={{ background: '#E8673A', color: 'white' }}
              >
                Quiero el plan Pro →
              </a>

              <div className="font-sans text-[11px] text-center mt-2.5" style={{ color: 'rgba(245,237,222,0.25)' }}>
                Te contactamos en menos de 24 hs · Sin tarjeta
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="text-center mb-16">
          <div className="font-sans text-[13px] text-[#8B7D6B] mb-4">Negocios que ya usan TuServicioHoy</div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Peluquerías', 'Barberías', 'Kinesiólogos', 'Nutricionistas', 'Psicólogos', 'Estética'].map(cat => (
              <span key={cat} className="px-3.5 py-1.5 rounded-full border border-[#EFE5D0] bg-paper font-sans text-[12px] font-medium text-[#8B7D6B]">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-[600px] mx-auto">
          <div className="font-sans font-bold text-[22px] text-ink tracking-[-0.4px] text-center mb-8">Preguntas frecuentes</div>
          <div className="flex flex-col gap-4">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="bg-paper border border-[#EFE5D0] rounded-2xl px-6 py-5">
                <div className="font-sans font-semibold text-[14px] text-ink mb-2">{q}</div>
                <div className="font-sans text-[13px] text-[#8B7D6B] leading-[1.6]">{a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-paper border border-[#EFE5D0] rounded-3xl px-8 py-12">
          <div className="font-sans font-bold text-[26px] text-ink tracking-[-0.6px] mb-3">¿Tenés dudas?</div>
          <p className="font-sans text-[15px] text-[#8B7D6B] mb-6 m-0">Hablamos por WhatsApp y te explicamos todo sin compromiso</p>
          <a
            href={`https://wa.me/542392617818?text=${encodeURIComponent('Hola! Tengo dudas sobre TuServicioHoy')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl no-underline font-sans font-bold text-[15px] transition-opacity hover:opacity-85"
            style={{ background: '#E8673A', color: 'white' }}
          >
            Escribinos por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
