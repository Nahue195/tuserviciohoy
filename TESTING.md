# Guía de Pruebas de Usabilidad — TuServicioHoy

## Preparación

### Cuentas necesarias
Antes de empezar, creá las siguientes cuentas de prueba:

| Rol | Email | Cómo crearla |
|-----|-------|-------------|
| **Cliente** | cualquier email tuyo | Magic link en `/auth/login` |
| **Proveedor** | otro email tuyo | Magic link → completar `/registrar-negocio` |
| **Admin** | — | Acceder a `/admin` con la contraseña `ADMIN_SECRET` |

> Tip: usá dos navegadores distintos (ej. Chrome + Firefox) para estar logueado como cliente y proveedor al mismo tiempo.

### Dispositivos a probar
- [ ] Desktop (1280px o más)
- [ ] Mobile (375px — iPhone SE)
- [ ] Tablet (768px)

---

## FLUJO 1 — Visitante sin cuenta

### 1.1 Home page
- [ ] Carga sin errores visibles
- [ ] Hero muestra los proveedores activos en el contador
- [ ] Las categorías se ven y tienen ícono + color
- [ ] Las cards de proveedores se muestran (con foto si tienen)
- [ ] Buscar un servicio en la barra de búsqueda → lleva a `/buscar`
- [ ] Hacer clic en una categoría → filtra en `/buscar`
- [ ] Hacer clic en "Empezar gratis" → lleva a registro/login
- [ ] El footer se ve completo

### 1.2 Búsqueda
- [ ] `/buscar` carga con todos los proveedores
- [ ] Filtrar por categoría (pills) funciona
- [ ] Filtrar "Disponible hoy" funciona
- [ ] Buscar por texto (ej. "pelo") filtra correctamente
- [ ] Hacer clic en una card → abre el perfil del proveedor
- [ ] En mobile: botón "Mapa / Lista" alterna las vistas
- [ ] En desktop: el mapa se muestra a la derecha con los pins

### 1.3 Perfil del proveedor (modo turno)
- [ ] Foto, nombre, categoría, rating, descripción visibles
- [ ] Tags se muestran como pills
- [ ] Horario de atención visible
- [ ] Selector de días funciona (pasar días con flechas)
- [ ] Los slots horarios se cargan
- [ ] Hacer clic en un slot abre el modal de reserva
- [ ] El modal pide nombre, email, teléfono (si no está logueado)
- [ ] Confirmar el turno → mensaje de éxito
- [ ] Revisar el email del cliente: llegó la confirmación

### 1.4 Perfil del proveedor (modo WhatsApp / presupuesto)
- [ ] En vez del slot picker, aparece el botón verde de WhatsApp
- [ ] El mensaje pre-armado se ve correcto al abrir WhatsApp
- [ ] El texto diferencia "coordinar" vs "pedir presupuesto"

### 1.5 Para negocios
- [ ] `/para-negocios` carga sin errores
- [ ] Hero, pasos, features, testimoniales y CTA visibles
- [ ] "Crear perfil gratis" → lleva a registro
- [ ] "Ver planes" → lleva a `/precios`
- [ ] Link de WhatsApp abre correctamente

### 1.6 Precios
- [ ] `/precios` carga correctamente
- [ ] Plan Starter y Pro se ven claramente
- [ ] El botón Pro abre WhatsApp con mensaje pre-armado
- [ ] FAQ se ve completo

---

## FLUJO 2 — Cliente registrado

### 2.1 Registro / Login
- [ ] Ir a `/auth/login`
- [ ] Ingresar email → botón "Continuar"
- [ ] Llega el magic link al email
- [ ] Hacer clic en el link → queda logueado y redirige
- [ ] Login con Google funciona (si está configurado)

### 2.2 Reserva con cuenta
- [ ] Logueado, ir al perfil de un proveedor
- [ ] Seleccionar día y horario
- [ ] El formulario de reserva ya viene con el nombre/email del usuario
- [ ] Confirmar → turno creado
- [ ] Llega email de confirmación

### 2.3 Mis turnos
- [ ] Ir a `/mis-turnos`
- [ ] Se ven los turnos reservados con fecha, hora, proveedor
- [ ] El estado (Pendiente / Confirmado) se muestra

### 2.4 Menú de usuario
- [ ] Avatar en navbar → dropdown con nombre
- [ ] "Mi panel" lleva al dashboard
- [ ] "Mis turnos" lleva a `/mis-turnos`
- [ ] "Cerrar sesión" desloguea y redirige al home

---

## FLUJO 3 — Proveedor (negocio)

### 3.1 Registro del negocio
- [ ] Ir a `/registrar-negocio`
- [ ] Completar: nombre, categoría, descripción, dirección, WhatsApp, precio, tags
- [ ] Enviar → redirige al dashboard
- [ ] El perfil público ya existe en `/proveedor/[id]`

### 3.2 Dashboard — Agenda
- [ ] `/dashboard` muestra los turnos de la semana
- [ ] Los turnos de hoy aparecen destacados
- [ ] Vista semanal con días y horarios
- [ ] Confirmar un turno → estado cambia
- [ ] Cancelar un turno → estado cambia

### 3.3 Dashboard — Configuración
- [ ] Cambiar nombre, descripción → guardar → refleja en perfil público
- [ ] Subir foto de perfil → aparece en la card y en el perfil público
- [ ] Cambiar dirección → el mapa del perfil se actualiza (puede tardar unos segundos en geocodificar)
- [ ] Selector de modo de contacto: TURNO / WHATSAPP / PRESUPUESTO
  - [ ] Cambiar a WHATSAPP → el perfil público muestra botón verde en vez de slots
  - [ ] Cambiar a PRESUPUESTO → el perfil público muestra "Pedir presupuesto"
  - [ ] Volver a TURNO → el selector de slots vuelve
- [ ] Disponibilidad semanal: activar/desactivar días → los slots del perfil cambian

### 3.4 Dashboard — Servicios y precios
- [ ] Agregar un servicio con nombre, duración y precio
- [ ] El servicio aparece listado
- [ ] Editar y eliminar funcionan

### 3.5 Dashboard — Estadísticas
- [ ] Las 4 tarjetas muestran datos (pueden estar en 0 si es cuenta nueva)
- [ ] El chart de 30 días se renderiza
- [ ] "Servicios más pedidos" aparece cuando hay turnos con servicio cargado
- [ ] "Próximos turnos" muestra los confirmados
- [ ] "Últimas reseñas" muestra reseñas si existen

### 3.6 Dashboard — Mi plan
- [ ] Se muestra el plan actual (Starter / Pro)
- [ ] El botón lleva a la página de precios o contacto

### 3.7 Perfil público como proveedor
- [ ] Abrir el perfil público en otro navegador (o incógnito)
- [ ] Verificar que los cambios de configuración se ven reflejados

---

## FLUJO 4 — Admin

### 4.1 Acceso
- [ ] Ir a `/admin`
- [ ] Ingresar la contraseña correcta → accede
- [ ] Ingresar contraseña incorrecta → muestra error, no accede

### 4.2 Panel
- [ ] Se ven las 5 tarjetas de métricas (providers, PRO, free, usuarios, turnos)
- [ ] La tabla lista todos los proveedores
- [ ] Buscar por nombre filtra la tabla
- [ ] Botón "Activar PRO" → cambia el plan a PRO + se actualiza en la tabla
- [ ] Botón "Quitar PRO" → baja a FREE + se actualiza
- [ ] El punto verde/gris indica si el proveedor está activo

---

## FLUJO 5 — Casos borde

### 5.1 Sin datos
- [ ] Un proveedor sin turnos → estadísticas en 0 sin errores
- [ ] Un proveedor sin disponibilidad cargada → perfil público muestra "sin horarios disponibles" o similar
- [ ] Un proveedor sin foto → muestra el avatar con inicial generado

### 5.2 Errores y límites
- [ ] Intentar reservar un slot ya ocupado → error claro "horario no disponible"
- [ ] Proveedor FREE con 20 turnos → mensaje de límite alcanzado
- [ ] Subir una foto mayor a 5MB → error claro
- [ ] Subir un archivo que no es imagen → error claro
- [ ] Ingresar a `/dashboard` sin estar logueado → redirige a `/auth/login`
- [ ] Acceder a `/admin` sin contraseña → muestra el formulario de login

### 5.3 Navegación
- [ ] `/404` → muestra la página de error personalizada
- [ ] URL inexistente → muestra not-found correcto
- [ ] El botón "atrás" del navegador funciona correctamente en todos los flujos
- [ ] Refrescar la página no pierde la sesión

### 5.4 Mobile — checklist específico
- [ ] Home: búsqueda funciona con teclado en pantalla
- [ ] Home: categorías hacen scroll horizontal
- [ ] Búsqueda: filtros de categorías hacen scroll horizontal
- [ ] Búsqueda: toggle Mapa/Lista funciona
- [ ] Perfil: slot picker es usable con el dedo
- [ ] Dashboard: la navegación inferior es visible y funciona
- [ ] Configuración: el formulario de foto se puede usar en mobile

---

## Qué registrar durante las pruebas

Para cada flujo, anotá:
- ¿Fue fácil de encontrar?
- ¿Algo te confundió?
- ¿Hubo algún error visible?
- ¿Cuánto tardó en cargar?
- ¿El texto era claro?

---

## Funciones pendientes (no probar todavía)
- Pago online (MercadoPago) — no implementado
- Notificaciones WhatsApp automáticas — requiere cuenta Twilio activa
- Cambio de ciudad — "Próximamente"
- Reseñas desde el cliente — flujo no implementado aún
