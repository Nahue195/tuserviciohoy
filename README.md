# TuServicioHoy

Marketplace de servicios locales con sistema de turnos online para pueblos argentinos.

## Setup rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Crear y migrar la base de datos
npx prisma migrate dev --name init

# 4. Cargar datos de prueba
npm run db:seed

# 5. Iniciar en desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) y vas a ver la app con datos de ejemplo.

## Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js (Google OAuth + Email magic link)
- **Estilos**: CSS inline (design system propio, colores cálidos)
- **Fuentes**: Fraunces (serif) + Instrument Sans (sans-serif)

## Estructura de pantallas

| Ruta | Pantalla |
|------|---------|
| `/` | Home — búsqueda y categorías |
| `/buscar` | Búsqueda con filtros + mapa |
| `/proveedor/[id]` | Perfil del proveedor + disponibilidad |
| `/reservar/[id]` | Flujo de reserva 3 pasos |
| `/dashboard` | Panel del proveedor (requiere auth) |
| `/auth/login` | Login Google + Email |

## API Routes

```
GET  /api/categorias
GET  /api/proveedores?q=&categoria=&disponibleHoy=
POST /api/proveedores
GET  /api/proveedores/[id]
PATCH /api/proveedores/[id]

GET  /api/turnos/disponibilidad?proveedorId=&fecha=
POST /api/turnos
PATCH /api/turnos/[id]
GET  /api/turnos/mis-turnos
```

## Pendientes (placeholders)

- **MercadoPago**: `src/components/MercadoPagoPlaceholder.tsx` + variables en `.env`
- **WhatsApp**: `src/lib/whatsapp.ts` — implementar con Twilio
