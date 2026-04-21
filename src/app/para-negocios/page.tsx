import type { Metadata } from 'next';
import { TshNavBar } from '@/components/ui/TshNavBar';

export const metadata: Metadata = {
  title: 'Para negocios | TuServicioHoy',
  description: 'Sumá tu negocio a TuServicioHoy y conseguí clientes nuevos todos los días. Gratis para arrancar, sin comisiones.',
  openGraph: {
    title: 'Para negocios | TuServicioHoy',
    description: 'Plataforma de gestión de turnos y vitrina digital para negocios locales.',
    siteName: 'TuServicioHoy',
    locale: 'es_AR',
    type: 'website',
  },
};

const STEPS = [
  {
    num: '01',
    title: 'Creá tu perfil',
    desc: 'Contanos quién sos, qué ofrecés y dónde estás. En 5 minutos tenés tu página publicada y visible en la ciudad.',
  },
  {
    num: '02',
    title: 'Clientes te encuentran',
    desc: 'Aparecés en búsquedas locales y en el mapa. Los clientes ven tu disponibilidad en tiempo real y reservan solos.',
  },
  {
    num: '03',
    title: 'Crecé sin esfuerzo',
    desc: 'Confirmaciones automáticas, reseñas reales y estadísticas de tu negocio. Todo en un panel simple.',
  },
];

const FEATURES = [
  {
    icon: '📅',
    title: 'Agenda online 24/7',
    desc: 'Tus clientes reservan cuando quieren, sin llamadas ni mensajes de WhatsApp. La agenda se actualiza sola.',
  },
  {
    icon: '⭐',
    title: 'Reseñas verificadas',
    desc: 'Solo clientes reales pueden opinar. Tu reputación habla sola y te diferencia de la competencia.',
  },
  {
    icon: '🗺️',
    title: 'Mapa interactivo',
    desc: 'Aparecés en el mapa de la ciudad. Clientes que buscan cerca tuyo te encuentran primero.',
  },
  {
    icon: '📊',
    title: 'Panel de control',
    desc: 'Mirá tus turnos, ingresos estimados y estadísticas en un solo lugar. Sin planillas ni papeles.',
  },
  {
    icon: '💬',
    title: 'Recordatorios automáticos',
    desc: 'El sistema avisa a tus clientes antes del turno. Menos ausencias, más tiempo bien aprovechado.',
  },
  {
    icon: '🏆',
    title: 'Badge verificado',
    desc: 'Destacate con el sello de negocio verificado. Más confianza, más conversiones.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Laura M.',
    role: 'Peluquería',
    text: 'Desde que me uní, lleno la agenda sin gastar en publicidad. Mis clientas me encuentran solas en el mapa.',
    initial: 'L',
    color: '#E4B8A0',
    fg: '#A03E1B',
  },
  {
    name: 'Carlos R.',
    role: 'Kinesiología',
    text: 'Mis pacientes reservan turno a cualquier hora. Menos llamadas al celular, más tiempo con los que ya están.',
    initial: 'C',
    color: '#B8CDC4',
    fg: '#2A5548',
  },
  {
    name: 'Sofía G.',
    role: 'Estética',
    text: 'Las reseñas me trajeron muchos clientes nuevos. La gente confía cuando ve comentarios reales de vecinos.',
    initial: 'S',
    color: '#DFC8D8',
    fg: '#7A3A5A',
  },
];

const STATS = [
  { value: '0%', label: 'de comisión' },
  { value: '5 min', label: 'para configurar' },
  { value: '24/7', label: 'reservas automáticas' },
  { value: 'Gratis', label: 'para arrancar' },
];

function CheckIcon() {
  return (
    <span
      style={{
        width: 20, height: 20, borderRadius: '50%', background: '#E8673A',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}
    >
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export default function ParaNegociosPage() {
  const city = process.env.NEXT_PUBLIC_CITY_NAME ?? 'Argentina';

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDDE' }}>
      <TshNavBar city={city} darkBg={false}/>

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '72px 24px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 80 }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 16px', borderRadius: 999,
            border: '1px solid #E5D9C2', background: '#FFFBF3',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12, fontWeight: 600, color: '#8B7D6B',
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8673A', display: 'inline-block' }}/>
            Para negocios locales
          </div>

          <h1 style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 'clamp(40px, 7vw, 68px)',
            fontWeight: 800,
            color: '#1A1208',
            lineHeight: 1.05,
            letterSpacing: '-2px',
            margin: '0 0 24px',
            maxWidth: 700,
          }}>
            Tu negocio,<br/>
            <span style={{ color: '#E8673A' }}>siempre lleno</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 18,
            color: '#5C5048',
            lineHeight: 1.65,
            maxWidth: 520,
            margin: '0 0 40px',
          }}>
            Conseguí clientes nuevos todos los días sin pagar comisiones.
            Publicá tu negocio gratis y gestioná tus turnos desde el celular.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="/registrar-negocio"
              style={{
                padding: '14px 32px', borderRadius: 12,
                background: '#E8673A', color: 'white',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 15, fontWeight: 700,
                textDecoration: 'none', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Empezar gratis →
            </a>
            <a
              href={`https://wa.me/542392617818?text=${encodeURIComponent('Hola! Quiero sumar mi negocio a TuServicioHoy')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px 32px', borderRadius: 12,
                border: '1.5px solid #E5D9C2', background: '#FFFBF3',
                color: '#1A1208',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 15, fontWeight: 600,
                textDecoration: 'none', transition: 'border-color 0.15s',
              }}
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>

        {/* ─── Stats bar ─────────────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 1,
          background: '#E5D9C2',
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 96,
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: '#FFFBF3', padding: '28px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <div style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 34, fontWeight: 800,
                color: '#E8673A', letterSpacing: '-1px',
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 13, color: '#8B7D6B',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ─── How it works ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 96 }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 12, fontWeight: 700, letterSpacing: '1.5px',
              textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 14,
            }}>
              Cómo funciona
            </div>
            <h2 style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
              color: '#1A1208', letterSpacing: '-1px', margin: 0,
            }}>
              En tres pasos simples
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{
                background: '#FFFBF3', border: '1px solid #EFE5D0',
                borderRadius: 24, padding: '36px 32px',
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 64, fontWeight: 900,
                  color: '#F0E8D6', lineHeight: 1,
                  position: 'absolute', top: 20, right: 28,
                }}>
                  {step.num}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: '#E8673A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <span style={{ color: 'white', fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 800, fontSize: 16 }}>
                    {i + 1}
                  </span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 18, fontWeight: 700, color: '#1A1208',
                  marginBottom: 12,
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 14, color: '#6B5F52', lineHeight: 1.65,
                }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Features ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 96 }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
              color: '#1A1208', letterSpacing: '-1px', margin: '0 0 14px',
            }}>
              Todo lo que necesitás
            </h2>
            <p style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 16, color: '#8B7D6B', margin: 0,
            }}>
              Una herramienta completa para hacer crecer tu negocio local.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: '#FFFBF3', border: '1px solid #EFE5D0',
                borderRadius: 20, padding: '28px',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <span style={{ fontSize: 28 }}>{f.icon}</span>
                <div style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 15, fontWeight: 700, color: '#1A1208',
                }}>
                  {f.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 13, color: '#6B5F52', lineHeight: 1.65,
                }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Testimonials ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 96 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
              color: '#1A1208', letterSpacing: '-1px', margin: 0,
            }}>
              Lo que dicen los negocios
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{
                background: '#FFFBF3', border: '1px solid #EFE5D0',
                borderRadius: 24, padding: 28,
              }}>
                <div style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 32, color: '#E8673A', lineHeight: 1, marginBottom: 16,
                }}>
                  &ldquo;
                </div>
                <p style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 14, color: '#3D2E22', lineHeight: 1.7,
                  margin: '0 0 20px',
                }}>
                  {t.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: t.color, color: t.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontWeight: 700, fontSize: 15,
                  }}>
                    {t.initial}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-geist-sans), sans-serif',
                      fontSize: 13, fontWeight: 700, color: '#1A1208',
                    }}>
                      {t.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-geist-sans), sans-serif',
                      fontSize: 12, color: '#8B7D6B',
                    }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Pricing CTA ───────────────────────────────────────────────────── */}
        <div style={{
          background: '#1A1208', borderRadius: 32,
          padding: '56px 48px', marginBottom: 24,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 12, fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'rgba(245,237,222,0.35)',
            marginBottom: 16,
          }}>
            Planes y precios
          </div>
          <h2 style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
            color: '#F5EDDE', letterSpacing: '-1.2px', margin: '0 0 16px',
          }}>
            Empezá gratis.<br/>Creció cuando estés listo.
          </h2>
          <p style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 16, color: 'rgba(245,237,222,0.5)',
            margin: '0 0 36px', maxWidth: 420, lineHeight: 1.6,
          }}>
            Plan Starter sin cargo. Plan Pro desde{' '}
            <strong style={{ color: '#E8673A' }}>$14.900/mes</strong>{' '}
            con turnos ilimitados, badge verificado y publicidad en redes.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="/registrar-negocio"
              style={{
                padding: '14px 28px', borderRadius: 12,
                background: '#E8673A', color: 'white',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
              }}
            >
              Crear perfil gratis
            </a>
            <a
              href="/precios"
              style={{
                padding: '14px 28px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.12)', background: 'transparent',
                color: 'rgba(245,237,222,0.6)',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Ver todos los planes
            </a>
          </div>

          <div style={{
            marginTop: 36,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
            width: '100%',
            maxWidth: 560,
          }}>
            {[
              'Sin comisiones por turno',
              'Cancelás cuando querés',
              'Soporte por WhatsApp',
              '15 días Pro gratis',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckIcon/>
                <span style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: 13, color: 'rgba(245,237,222,0.55)',
                }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── WhatsApp CTA ──────────────────────────────────────────────────── */}
        <div style={{
          background: '#FFFBF3', border: '1px solid #EFE5D0',
          borderRadius: 24, padding: '40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 22, fontWeight: 800, color: '#1A1208',
            letterSpacing: '-0.5px', marginBottom: 10,
          }}>
            ¿Tenés dudas? Hablamos.
          </div>
          <p style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: 14, color: '#8B7D6B',
            margin: '0 0 24px', lineHeight: 1.6,
          }}>
            Contanos qué tipo de negocio tenés y te explicamos todo sin compromiso.
            Te respondemos en menos de 24 hs.
          </p>
          <a
            href={`https://wa.me/542392617818?text=${encodeURIComponent('Hola! Quiero sumar mi negocio a TuServicioHoy')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 12,
              background: '#E8673A', color: 'white',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escribinos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
