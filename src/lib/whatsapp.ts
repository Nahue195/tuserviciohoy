interface WhatsAppPayload {
  to: string; // número con código de país: "5492627401234"
  proveedorNombre: string;
  fecha: string;
  hora: string;
  codigo: string;
}

async function sendMessage(to: string, body: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM ?? 'whatsapp:+14155238886';

  if (!accountSid || !authToken) return; // silently skip if not configured

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: from,
        To: `whatsapp:+${to.replace(/\D/g, '')}`,
        Body: body,
      }).toString(),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error('[WhatsApp] Error Twilio:', err);
  }
}

export async function sendWhatsAppConfirmacion(payload: WhatsAppPayload): Promise<void> {
  await sendMessage(
    payload.to,
    `¡Tu turno en *${payload.proveedorNombre}* está confirmado! 📅 ${payload.fecha} a las ${payload.hora}hs.\nCódigo: *${payload.codigo}*`
  );
}

export async function sendWhatsAppRecordatorio(payload: WhatsAppPayload): Promise<void> {
  await sendMessage(
    payload.to,
    `⏰ Recordatorio: mañana tenés turno en *${payload.proveedorNombre}* a las ${payload.hora}hs.\nCódigo: *${payload.codigo}*`
  );
}

export async function sendWhatsAppCancelacion(
  payload: Pick<WhatsAppPayload, 'to' | 'proveedorNombre' | 'codigo'>
): Promise<void> {
  await sendMessage(
    payload.to,
    `Tu turno en *${payload.proveedorNombre}* fue cancelado. Código: *${payload.codigo}*`
  );
}
