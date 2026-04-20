// TODO: Implementar con Twilio WhatsApp API
// Ver .env.example para las variables necesarias

interface WhatsAppPayload {
  to: string;         // número con código de país: "5492627401234"
  proveedorNombre: string;
  fecha: string;
  hora: string;
  codigo: string;
}

export async function sendWhatsAppConfirmacion(payload: WhatsAppPayload): Promise<void> {
  console.log('[WhatsApp STUB] Enviando confirmación de turno:', {
    to: payload.to,
    message: `¡Tu turno en ${payload.proveedorNombre} está confirmado! 📅 ${payload.fecha} a las ${payload.hora}. Código: ${payload.codigo}`,
  });
}

export async function sendWhatsAppRecordatorio(payload: WhatsAppPayload): Promise<void> {
  console.log('[WhatsApp STUB] Enviando recordatorio:', {
    to: payload.to,
    message: `⏰ Recordatorio: mañana tenés turno en ${payload.proveedorNombre} a las ${payload.hora}. Código: ${payload.codigo}`,
  });
}

export async function sendWhatsAppCancelacion(payload: Pick<WhatsAppPayload, 'to' | 'proveedorNombre' | 'codigo'>): Promise<void> {
  console.log('[WhatsApp STUB] Enviando cancelación:', {
    to: payload.to,
    message: `Tu turno en ${payload.proveedorNombre} fue cancelado. Código: ${payload.codigo}`,
  });
}
