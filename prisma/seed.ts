import { PrismaClient, Role, EstadoTurno } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Categorías ──────────────────────────────────────────────────────────────
  const cats = await Promise.all([
    prisma.categoria.upsert({ where: { slug: 'belleza' }, update: {}, create: { nombre: 'Belleza', slug: 'belleza', icono: 'scissors', color: '#D9634A', tint: '#FBE6DD' } }),
    prisma.categoria.upsert({ where: { slug: 'salud' }, update: {}, create: { nombre: 'Salud', slug: 'salud', icono: 'heart', color: '#0F6E4E', tint: '#E3EFE8' } }),
    prisma.categoria.upsert({ where: { slug: 'legal' }, update: {}, create: { nombre: 'Legal', slug: 'legal', icono: 'scale', color: '#3F4C7A', tint: '#E3E5EF' } }),
    prisma.categoria.upsert({ where: { slug: 'hogar' }, update: {}, create: { nombre: 'Hogar', slug: 'hogar', icono: 'wrench', color: '#D69A2A', tint: '#F7ECD0' } }),
    prisma.categoria.upsert({ where: { slug: 'mascotas' }, update: {}, create: { nombre: 'Mascotas', slug: 'mascotas', icono: 'paw', color: '#7A8968', tint: '#EAEEE2' } }),
    prisma.categoria.upsert({ where: { slug: 'educacion' }, update: {}, create: { nombre: 'Educación', slug: 'educacion', icono: 'book', color: '#B85C3A', tint: '#F4DFD1' } }),
    prisma.categoria.upsert({ where: { slug: 'bienestar' }, update: {}, create: { nombre: 'Bienestar', slug: 'bienestar', icono: 'lotus', color: '#A5436B', tint: '#F1DDE4' } }),
    prisma.categoria.upsert({ where: { slug: 'autos' }, update: {}, create: { nombre: 'Autos', slug: 'autos', icono: 'car', color: '#4A5759', tint: '#E1E4E4' } }),
  ]);

  const [belleza, salud, legal, hogar, mascotas, educacion, bienestar] = cats;

  // ─── Usuarios de prueba ───────────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'marta@example.com' }, update: {}, create: { name: 'Marta Gallardo', email: 'marta@example.com', role: Role.PROVEEDOR } }),
    prisma.user.upsert({ where: { email: 'ricardo@example.com' }, update: {}, create: { name: 'Ricardo Fernández', email: 'ricardo@example.com', role: Role.PROVEEDOR } }),
    prisma.user.upsert({ where: { email: 'lucia@example.com' }, update: {}, create: { name: 'Lucía Paladino', email: 'lucia@example.com', role: Role.PROVEEDOR } }),
    prisma.user.upsert({ where: { email: 'matias@example.com' }, update: {}, create: { name: 'Matías Ruiz', email: 'matias@example.com', role: Role.PROVEEDOR } }),
    prisma.user.upsert({ where: { email: 'romina@example.com' }, update: {}, create: { name: 'Romina Caballero', email: 'romina@example.com', role: Role.PROVEEDOR } }),
    prisma.user.upsert({ where: { email: 'soledad@example.com' }, update: {}, create: { name: 'Soledad Ibáñez', email: 'soledad@example.com', role: Role.PROVEEDOR } }),
    prisma.user.upsert({ where: { email: 'joaquin@example.com' }, update: {}, create: { name: 'Joaquín Salerno', email: 'joaquin@example.com', role: Role.PROVEEDOR } }),
    prisma.user.upsert({ where: { email: 'anahi@example.com' }, update: {}, create: { name: 'Anahí Torres', email: 'anahi@example.com', role: Role.PROVEEDOR } }),
    // Clientes
    prisma.user.upsert({ where: { email: 'carolina@example.com' }, update: {}, create: { name: 'Carolina Méndez', email: 'carolina@example.com', phone: '+54 9 2627 40-1234', role: Role.CLIENTE } }),
    prisma.user.upsert({ where: { email: 'agustin@example.com' }, update: {}, create: { name: 'Agustín Sosa', email: 'agustin@example.com', phone: '+54 9 2627 40-5678', role: Role.CLIENTE } }),
    prisma.user.upsert({ where: { email: 'valentina@example.com' }, update: {}, create: { name: 'Valentina Ríos', email: 'valentina@example.com', phone: '+54 9 2627 40-9012', role: Role.CLIENTE } }),
  ]);

  const [uMarta, uRicardo, uLucia, uMatias, uRomina, uSoledad, uJoaquin, uAnahi, uCarolina, uAgustin, uValentina] = users;

  // ─── Proveedores ──────────────────────────────────────────────────────────────
  const proveedorMarta = await prisma.proveedor.upsert({
    where: { userId: uMarta.id },
    update: {},
    create: {
      userId: uMarta.id,
      nombre: 'Peluquería Doña Marta',
      descripcion: 'Atendemos hace 22 años en el mismo lugar, frente a la plaza. Cortes de dama, peinados para eventos, coloración y tratamientos de keratina. Atención personalizada, sin apuro.',
      categoriaId: belleza.id,
      neighborhood: 'Centro',
      distanceKm: 0.4,
      precioDesde: 8500,
      hours: 'Lun a Sáb · 9:00 — 19:00',
      since: 2003,
      tags: ['Corte', 'Color', 'Peinado', 'Keratina'],
    },
  });

  const proveedorRicardo = await prisma.proveedor.upsert({
    where: { userId: uRicardo.id },
    update: {},
    create: {
      userId: uRicardo.id,
      nombre: 'Dr. Fernández — Odontología',
      descripcion: 'Consulta odontológica general, estética dental y urgencias. Consultorio con equipamiento digital. Obras sociales: OSDE, Swiss Medical, Galeno.',
      categoriaId: salud.id,
      neighborhood: 'Barrio Norte',
      distanceKm: 1.2,
      precioDesde: 15000,
      hours: 'Lun a Vie · 8:30 — 18:00',
      since: 2011,
      tags: ['Consulta', 'Limpieza', 'Urgencias', 'Estética'],
    },
  });

  const proveedorLucia = await prisma.proveedor.upsert({
    where: { userId: uLucia.id },
    update: {},
    create: {
      userId: uLucia.id,
      nombre: 'Estudio Jurídico Paladino',
      descripcion: 'Derecho laboral, familia y sucesiones. Primera consulta sin cargo. Atención presencial y por videollamada.',
      categoriaId: legal.id,
      neighborhood: 'Centro',
      distanceKm: 0.8,
      precioDesde: 20000,
      hours: 'Lun a Vie · 9:00 — 17:00',
      since: 2015,
      tags: ['Laboral', 'Familia', 'Sucesiones', 'Consulta gratis'],
    },
  });

  const proveedorMatias = await prisma.proveedor.upsert({
    where: { userId: uMatias.id },
    update: {},
    create: {
      userId: uMatias.id,
      nombre: 'Electricista Matías R.',
      descripcion: 'Instalaciones, reparaciones, tableros y luminarias. Trabajo con factura y garantía escrita. Presupuesto sin cargo a domicilio.',
      categoriaId: hogar.id,
      neighborhood: 'San Martín',
      distanceKm: 2.1,
      precioDesde: 6000,
      hours: 'Lun a Sáb · 8:00 — 20:00',
      since: 2018,
      tags: ['Instalación', 'Reparación', 'Urgencias', 'Presupuesto gratis'],
    },
  });

  const proveedorRomina = await prisma.proveedor.upsert({
    where: { userId: uRomina.id },
    update: {},
    create: {
      userId: uRomina.id,
      nombre: 'Veterinaria Patitas',
      descripcion: 'Consulta clínica, vacunación, cirugías menores y peluquería canina. Atención a domicilio disponible los sábados.',
      categoriaId: mascotas.id,
      neighborhood: 'Centro',
      distanceKm: 0.6,
      precioDesde: 9000,
      hours: 'Lun a Sáb · 9:00 — 20:00',
      since: 2009,
      tags: ['Consulta', 'Vacunas', 'Peluquería', 'A domicilio'],
    },
  });

  const proveedorSoledad = await prisma.proveedor.upsert({
    where: { userId: uSoledad.id },
    update: {},
    create: {
      userId: uSoledad.id,
      nombre: 'Lic. Soledad Ibáñez — Nutrición',
      descripcion: 'Nutrición clínica y deportiva. Planes personalizados, seguimiento quincenal. Atención presencial y online.',
      categoriaId: salud.id,
      neighborhood: 'Villa Unión',
      distanceKm: 1.8,
      precioDesde: 12000,
      hours: 'Mar y Jue · 10:00 — 18:00',
      since: 2019,
      tags: ['Nutrición', 'Plan alimentario', 'Online'],
    },
  });

  const proveedorJoaquin = await prisma.proveedor.upsert({
    where: { userId: uJoaquin.id },
    update: {},
    create: {
      userId: uJoaquin.id,
      nombre: 'Profesor Joaquín — Matemática',
      descripcion: 'Clases particulares secundario y primer año de universidad. Grupales e individuales.',
      categoriaId: educacion.id,
      neighborhood: 'Centro',
      distanceKm: 1.0,
      precioDesde: 5500,
      hours: 'Lun a Vie · 16:00 — 21:00',
      since: 2020,
      tags: ['Secundario', 'Universidad', 'Grupal'],
    },
  });

  const proveedorAnahi = await prisma.proveedor.upsert({
    where: { userId: uAnahi.id },
    update: {},
    create: {
      userId: uAnahi.id,
      nombre: 'Estudio Yoga Anahí',
      descripcion: 'Clases de hatha yoga, meditación y respiración. Grupos reducidos, todos los niveles.',
      categoriaId: bienestar.id,
      neighborhood: 'Barrio Norte',
      distanceKm: 1.5,
      precioDesde: 7000,
      hours: 'Lun a Vie · 8:00 — 21:00',
      since: 2016,
      tags: ['Yoga', 'Meditación', 'Principiantes'],
    },
  });

  // ─── Disponibilidad semanal ───────────────────────────────────────────────────
  // Marta: Lun-Sáb 9-19
  for (const dia of [1, 2, 3, 4, 5, 6]) {
    await prisma.disponibilidad.upsert({
      where: { id: `disp-marta-${dia}` },
      update: {},
      create: { id: `disp-marta-${dia}`, proveedorId: proveedorMarta.id, diaSemana: dia, horaInicio: '09:00', horaFin: '19:00', intervaloMinutos: 30 },
    });
  }
  // Ricardo: Lun-Vie 8:30-18
  for (const dia of [1, 2, 3, 4, 5]) {
    await prisma.disponibilidad.upsert({
      where: { id: `disp-ricardo-${dia}` },
      update: {},
      create: { id: `disp-ricardo-${dia}`, proveedorId: proveedorRicardo.id, diaSemana: dia, horaInicio: '08:30', horaFin: '18:00', intervaloMinutos: 30 },
    });
  }
  // Lucía: Lun-Vie 9-17
  for (const dia of [1, 2, 3, 4, 5]) {
    await prisma.disponibilidad.upsert({
      where: { id: `disp-lucia-${dia}` },
      update: {},
      create: { id: `disp-lucia-${dia}`, proveedorId: proveedorLucia.id, diaSemana: dia, horaInicio: '09:00', horaFin: '17:00', intervaloMinutos: 60 },
    });
  }
  // Matías: Lun-Sáb 8-20
  for (const dia of [1, 2, 3, 4, 5, 6]) {
    await prisma.disponibilidad.upsert({
      where: { id: `disp-matias-${dia}` },
      update: {},
      create: { id: `disp-matias-${dia}`, proveedorId: proveedorMatias.id, diaSemana: dia, horaInicio: '08:00', horaFin: '20:00', intervaloMinutos: 60 },
    });
  }
  // Romina: Lun-Sáb 9-20
  for (const dia of [1, 2, 3, 4, 5, 6]) {
    await prisma.disponibilidad.upsert({
      where: { id: `disp-romina-${dia}` },
      update: {},
      create: { id: `disp-romina-${dia}`, proveedorId: proveedorRomina.id, diaSemana: dia, horaInicio: '09:00', horaFin: '20:00', intervaloMinutos: 30 },
    });
  }
  // Soledad: Mar y Jue 10-18
  for (const dia of [2, 4]) {
    await prisma.disponibilidad.upsert({
      where: { id: `disp-soledad-${dia}` },
      update: {},
      create: { id: `disp-soledad-${dia}`, proveedorId: proveedorSoledad.id, diaSemana: dia, horaInicio: '10:00', horaFin: '18:00', intervaloMinutos: 60 },
    });
  }
  // Joaquín: Lun-Vie 16-21
  for (const dia of [1, 2, 3, 4, 5]) {
    await prisma.disponibilidad.upsert({
      where: { id: `disp-joaquin-${dia}` },
      update: {},
      create: { id: `disp-joaquin-${dia}`, proveedorId: proveedorJoaquin.id, diaSemana: dia, horaInicio: '16:00', horaFin: '21:00', intervaloMinutos: 60 },
    });
  }
  // Anahí: Lun-Vie 8-21
  for (const dia of [1, 2, 3, 4, 5]) {
    await prisma.disponibilidad.upsert({
      where: { id: `disp-anahi-${dia}` },
      update: {},
      create: { id: `disp-anahi-${dia}`, proveedorId: proveedorAnahi.id, diaSemana: dia, horaInicio: '08:00', horaFin: '21:00', intervaloMinutos: 60 },
    });
  }

  // ─── Turnos de ejemplo ────────────────────────────────────────────────────────
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const turnoData = [
    { proveedorId: proveedorMarta.id, clienteId: uCarolina.id, fecha: hoy, horaInicio: '09:00', horaFin: '10:00', estado: EstadoTurno.CONFIRMADO, servicio: 'Corte + peinado', precio: 8500 },
    { proveedorId: proveedorMarta.id, clienteId: uAgustin.id, fecha: hoy, horaInicio: '10:30', horaFin: '11:00', estado: EstadoTurno.CONFIRMADO, servicio: 'Corte de caballero', precio: 8500 },
    { proveedorId: proveedorMarta.id, clienteId: uValentina.id, fecha: hoy, horaInicio: '11:30', horaFin: '13:30', estado: EstadoTurno.CONFIRMADO, servicio: 'Coloración + mechas', precio: 13600 },
    { proveedorId: proveedorMarta.id, clienteId: uCarolina.id, fecha: hoy, horaInicio: '14:00', horaFin: '15:30', estado: EstadoTurno.PENDIENTE, servicio: 'Tratamiento keratina', precio: 20400 },
    { proveedorId: proveedorRicardo.id, clienteId: uAgustin.id, fecha: hoy, horaInicio: '09:00', horaFin: '09:30', estado: EstadoTurno.CONFIRMADO, servicio: 'Consulta', precio: 15000 },
    { proveedorId: proveedorLucia.id, clienteId: uValentina.id, fecha: hoy, horaInicio: '10:00', horaFin: '11:00', estado: EstadoTurno.CONFIRMADO, servicio: 'Consulta laboral', precio: 20000 },
  ];

  for (const t of turnoData) {
    await prisma.turno.create({ data: t });
  }

  // ─── Reseñas ──────────────────────────────────────────────────────────────────
  const turnos = await prisma.turno.findMany({ where: { proveedorId: proveedorMarta.id, estado: EstadoTurno.CONFIRMADO }, take: 3 });
  for (const [i, turno] of turnos.entries()) {
    const ratings = [5, 5, 4];
    const comments = [
      'Excelente atención, Marta es un amor. Quedé feliz con el corte y me hicieron lugar el mismo día.',
      'Vengo hace años. Siempre puntuales, siempre bien. Es un clásico del pueblo.',
      'El local es chico y en horas pico se llena, pero vale la pena esperar. La keratina me duró meses.',
    ];
    await prisma.resena.create({
      data: {
        proveedorId: proveedorMarta.id,
        clienteId: turno.clienteId,
        turnoId: turno.id,
        rating: ratings[i] ?? 5,
        comentario: comments[i],
      },
    });
  }

  console.log('✅ Seed completo!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
