// TuServicioHoy — Mock data (Argentine names, local services, ARS prices)

const TSH_CITY = 'Villa San Rafael';

const TSH_PROVIDERS = [
  {
    id: 'p1',
    name: 'Peluquería Doña Marta',
    person: 'Marta Gallardo',
    category: 'belleza',
    rating: 4.9, reviews: 184,
    priceFrom: 8500,
    neighborhood: 'Centro',
    distanceKm: 0.4,
    nextSlot: 'Hoy 15:30',
    availableToday: true,
    avatarSeed: 3,
    coverSeed: 1,
    description: 'Atendemos hace 22 años en el mismo lugar, frente a la plaza. Cortes de dama, peinados para eventos, coloración y tratamientos de keratina. Atención personalizada, sin apuro.',
    tags: ['Corte', 'Color', 'Peinado', 'Keratina'],
    hours: 'Lun a Sáb · 9:00 — 19:00',
    since: 2003,
  },
  {
    id: 'p2',
    name: 'Dr. Fernández — Odontología',
    person: 'Ricardo Fernández',
    category: 'salud',
    rating: 4.8, reviews: 96,
    priceFrom: 15000,
    neighborhood: 'Barrio Norte',
    distanceKm: 1.2,
    nextSlot: 'Mañana 10:00',
    availableToday: false,
    avatarSeed: 4,
    coverSeed: 2,
    description: 'Consulta odontológica general, estética dental y urgencias. Consultorio con equipamiento digital. Obras sociales: OSDE, Swiss Medical, Galeno.',
    tags: ['Consulta', 'Limpieza', 'Urgencias', 'Estética'],
    hours: 'Lun a Vie · 8:30 — 18:00',
    since: 2011,
  },
  {
    id: 'p3',
    name: 'Estudio Jurídico Paladino',
    person: 'Lucía Paladino',
    category: 'legal',
    rating: 4.7, reviews: 42,
    priceFrom: 20000,
    neighborhood: 'Centro',
    distanceKm: 0.8,
    nextSlot: 'Hoy 17:00',
    availableToday: true,
    avatarSeed: 2,
    coverSeed: 3,
    description: 'Derecho laboral, familia y sucesiones. Primera consulta sin cargo. Atención presencial y por videollamada.',
    tags: ['Laboral', 'Familia', 'Sucesiones', 'Consulta gratis'],
    hours: 'Lun a Vie · 9:00 — 17:00',
    since: 2015,
  },
  {
    id: 'p4',
    name: 'Electricista Matías R.',
    person: 'Matías Ruiz',
    category: 'hogar',
    rating: 5.0, reviews: 67,
    priceFrom: 6000,
    neighborhood: 'San Martín',
    distanceKm: 2.1,
    nextSlot: 'Hoy 18:00',
    availableToday: true,
    avatarSeed: 0,
    coverSeed: 4,
    description: 'Instalaciones, reparaciones, tableros y luminarias. Trabajo con factura y garantía escrita. Presupuesto sin cargo a domicilio.',
    tags: ['Instalación', 'Reparación', 'Urgencias', 'Presupuesto gratis'],
    hours: 'Lun a Sáb · 8:00 — 20:00',
    since: 2018,
  },
  {
    id: 'p5',
    name: 'Veterinaria Patitas',
    person: 'Dra. Romina Caballero',
    category: 'mascotas',
    rating: 4.9, reviews: 231,
    priceFrom: 9000,
    neighborhood: 'Centro',
    distanceKm: 0.6,
    nextSlot: 'Hoy 16:00',
    availableToday: true,
    avatarSeed: 1,
    coverSeed: 5,
    description: 'Consulta clínica, vacunación, cirugías menores y peluquería canina. Atención a domicilio disponible los sábados.',
    tags: ['Consulta', 'Vacunas', 'Peluquería', 'A domicilio'],
    hours: 'Lun a Sáb · 9:00 — 20:00',
    since: 2009,
  },
  {
    id: 'p6',
    name: 'Lic. Soledad Ibáñez — Nutrición',
    person: 'Soledad Ibáñez',
    category: 'salud',
    rating: 4.8, reviews: 58,
    priceFrom: 12000,
    neighborhood: 'Villa Unión',
    distanceKm: 1.8,
    nextSlot: 'Jueves 11:00',
    availableToday: false,
    avatarSeed: 5,
    coverSeed: 0,
    description: 'Nutrición clínica y deportiva. Planes personalizados, seguimiento quincenal. Atención presencial y online.',
    tags: ['Nutrición', 'Plan alimentario', 'Online'],
    hours: 'Mar y Jue · 10:00 — 18:00',
    since: 2019,
  },
  {
    id: 'p7',
    name: 'Profesor Joaquín — Matemática',
    person: 'Joaquín Salerno',
    category: 'educacion',
    rating: 4.9, reviews: 34,
    priceFrom: 5500,
    neighborhood: 'Centro',
    distanceKm: 1.0,
    nextSlot: 'Hoy 19:00',
    availableToday: true,
    avatarSeed: 2,
    coverSeed: 3,
    description: 'Clases particulares secundario y primer año de universidad. Grupales e individuales.',
    tags: ['Secundario', 'Universidad', 'Grupal'],
    hours: 'Lun a Vie · 16:00 — 21:00',
    since: 2020,
  },
  {
    id: 'p8',
    name: 'Estudio Yoga Anahí',
    person: 'Anahí Torres',
    category: 'bienestar',
    rating: 4.9, reviews: 128,
    priceFrom: 7000,
    neighborhood: 'Barrio Norte',
    distanceKm: 1.5,
    nextSlot: 'Hoy 18:30',
    availableToday: true,
    avatarSeed: 4,
    coverSeed: 2,
    description: 'Clases de hatha yoga, meditación y respiración. Grupos reducidos, todos los niveles.',
    tags: ['Yoga', 'Meditación', 'Principiantes'],
    hours: 'Lun a Vie · 8:00 — 21:00',
    since: 2016,
  },
];

// Time slots for booking
const TSH_SLOTS_MORNING = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
const TSH_SLOTS_AFTER   = ['14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];

// Helper: next 14 days
const TSH_DAYS = (() => {
  const days = [];
  const dayNames = ['dom','lun','mar','mié','jue','vie','sáb'];
  const start = new Date(2026, 3, 18); // Sat Apr 18, 2026
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      key: `${d.getMonth()+1}-${d.getDate()}`,
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      month: d.getMonth()+1,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isToday: i === 0,
      isTomorrow: i === 1,
    });
  }
  return days;
})();

// Dashboard: today's appointments for a provider
const TSH_TODAY_APPTS = [
  { time: '09:00', client: 'Carolina Méndez',   service: 'Corte + peinado',       status: 'confirmed', duration: 60, avatarSeed: 3 },
  { time: '10:30', client: 'Agustín Sosa',       service: 'Corte de caballero',    status: 'confirmed', duration: 30, avatarSeed: 0 },
  { time: '11:30', client: 'Valentina Ríos',     service: 'Coloración + mechas',   status: 'confirmed', duration: 120, avatarSeed: 2 },
  { time: '14:00', client: 'Marina Allende',     service: 'Tratamiento keratina',  status: 'pending',   duration: 90, avatarSeed: 1 },
  { time: '15:30', client: 'Josefina Quiroga',   service: 'Corte + peinado',       status: 'confirmed', duration: 60, avatarSeed: 5 },
  { time: '17:00', client: 'Delfina Ponce',      service: 'Corte',                 status: 'confirmed', duration: 30, avatarSeed: 4 },
];

const TSH_REVIEWS = [
  { name: 'Laura B.',     rating: 5, date: 'hace 3 días',    text: 'Excelente atención, Marta es un amor. Quedé feliz con el corte y me hicieron lugar el mismo día.' },
  { name: 'Florencia D.', rating: 5, date: 'hace 1 semana',  text: 'Vengo hace años. Siempre puntuales, siempre bien. Es un clásico del pueblo.' },
  { name: 'Paula M.',     rating: 4, date: 'hace 2 semanas', text: 'El local es chico y en horas pico se llena, pero vale la pena esperar. La keratina me duró meses.' },
];

// Weekly schedule blocks for the dashboard
const TSH_WEEK_SCHEDULE = [
  // Each entry: day index 0-5 (Mon-Sat), start hour, end hour, client, cat color
  { day: 0, start: 9,  end: 10,   client: 'Carolina M.', color: '#D9634A' },
  { day: 0, start: 10.5, end: 11, client: 'Agustín S.',  color: '#D9634A' },
  { day: 0, start: 11.5, end: 13.5, client: 'Valentina R.', color: '#0F6E4E' },
  { day: 0, start: 14, end: 15.5, client: 'Marina A.',   color: '#D9634A' },
  { day: 0, start: 15.5, end: 16.5, client: 'Josefina Q.', color: '#D9634A' },
  { day: 0, start: 17, end: 17.5,  client: 'Delfina P.',   color: '#D9634A' },
  { day: 1, start: 9,  end: 10,   client: 'Sofía L.',    color: '#D9634A' },
  { day: 1, start: 10, end: 12,   client: 'Bloque color', color: '#0F6E4E' },
  { day: 1, start: 14, end: 15,   client: 'Elena V.',    color: '#D9634A' },
  { day: 1, start: 16, end: 17.5, client: 'Rocío T.',    color: '#D9634A' },
  { day: 2, start: 9.5, end: 10.5, client: 'Paola B.',   color: '#D9634A' },
  { day: 2, start: 11, end: 12.5, client: 'Julieta M.',  color: '#0F6E4E' },
  { day: 2, start: 15, end: 16,   client: 'Mariana F.',  color: '#D9634A' },
  { day: 3, start: 9,  end: 10.5, client: 'Gabriela H.', color: '#D9634A' },
  { day: 3, start: 11, end: 13,   client: 'Ana S.',      color: '#0F6E4E' },
  { day: 3, start: 14.5, end: 15.5, client: 'Camila D.', color: '#D9634A' },
  { day: 3, start: 16.5, end: 18, client: 'Renata O.',   color: '#D9634A' },
  { day: 4, start: 9,  end: 10,   client: 'Mercedes R.', color: '#D9634A' },
  { day: 4, start: 10, end: 11,   client: 'Ivana Z.',    color: '#D9634A' },
  { day: 4, start: 14, end: 16,   client: 'Graciela C.', color: '#0F6E4E' },
  { day: 4, start: 17, end: 18,   client: 'Noelia A.',   color: '#D9634A' },
  { day: 5, start: 9.5, end: 11,  client: 'Luz F.',      color: '#D9634A' },
  { day: 5, start: 11.5, end: 13, client: 'Sandra P.',   color: '#D9634A' },
];

// Disabled/blocked slots per day (date-key -> string[])
const TSH_DISABLED = {
  '4-18': ['09:00', '09:30', '14:30', '17:30', '18:30', '19:00'],
  '4-19': ['all'], // Sunday closed
  '4-20': ['10:00', '11:00', '15:00', '16:00'],
  '4-21': ['09:30', '14:30', '18:30'],
  '4-22': ['11:00', '15:30', '16:00'],
  '4-23': ['09:00', '10:30', '14:30'],
  '4-24': ['16:30', '17:00', '17:30'],
};

const tshFmtPrice = (n) => 'ARS ' + n.toLocaleString('es-AR');

Object.assign(window, {
  TSH_CITY, TSH_PROVIDERS, TSH_SLOTS_MORNING, TSH_SLOTS_AFTER,
  TSH_DAYS, TSH_TODAY_APPTS, TSH_REVIEWS, TSH_WEEK_SCHEDULE, TSH_DISABLED,
  tshFmtPrice,
});
