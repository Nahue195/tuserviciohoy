import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? 'TuServicioHoy <onboarding@resend.dev>';

function formatFecha(fecha: string) {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export async function sendConfirmacionCliente({
  to, clienteNombre, proveedorNombre, proveedorDireccion, fecha, hora, servicio, codigo,
}: {
  to: string; clienteNombre: string; proveedorNombre: string; proveedorDireccion?: string | null;
  fecha: string; hora: string; servicio?: string | null; codigo: string;
}) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Tu turno en ${proveedorNombre} está confirmado`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;background:#FFFBF3;border-radius:16px;overflow:hidden;border:1px solid #EFE5D0">
        <div style="background:#E8673A;padding:28px 32px">
          <div style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.4px">TuServicioHoy</div>
          <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px">Tu turno está confirmado</div>
        </div>
        <div style="padding:32px">
          <p style="margin:0 0 24px;font-size:16px;color:#2A2420">Hola <strong>${clienteNombre}</strong>, tu reserva fue registrada exitosamente.</p>

          <div style="background:#fff;border:1px solid #EFE5D0;border-radius:12px;overflow:hidden;margin-bottom:24px">
            <div style="padding:16px 20px;border-bottom:1px solid #EFE5D0;display:flex;align-items:center;gap:12px">
              <div style="width:42px;height:42px;background:#E8673A;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <span style="color:#fff;font-size:20px">📅</span>
              </div>
              <div>
                <div style="font-size:17px;font-weight:700;color:#2A2420;letter-spacing:-0.3px">${formatFecha(fecha)} · ${hora}</div>
                <div style="font-size:13px;color:#8B7D6B;margin-top:2px">${servicio ?? 'Consulta'}</div>
              </div>
            </div>
            ${[
              ['Profesional', proveedorNombre],
              ...(proveedorDireccion ? [['Dirección', proveedorDireccion]] : []),
            ].map(([k, v]) => `
              <div style="padding:12px 20px;border-bottom:1px solid #EFE5D0;display:flex;justify-content:space-between">
                <span style="font-size:13px;color:#8B7D6B">${k}</span>
                <span style="font-size:13px;font-weight:600;color:#2A2420">${v}</span>
              </div>
            `).join('')}
            <div style="padding:14px 20px;background:#FAF4E8">
              <div style="font-size:11px;color:#8B7D6B;text-transform:uppercase;letter-spacing:0.8px;font-weight:700;text-align:center;margin-bottom:6px">Código de turno</div>
              <div style="font-size:24px;font-weight:700;color:#E8673A;letter-spacing:3px;text-align:center;font-family:monospace">${codigo}</div>
            </div>
          </div>

          <div style="background:#E3EFE8;border-radius:10px;padding:14px 16px;margin-bottom:24px">
            <p style="margin:0;font-size:13px;color:#0F6E4E;line-height:1.5">
              <strong>Sin cargo por reservar.</strong> Se paga en el local. Podés cancelar gratis hasta 2 horas antes.
            </p>
          </div>

          <p style="margin:0;font-size:13px;color:#8B7D6B;text-align:center">
            Si tenés alguna duda, respondé este email y te ayudamos.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendNuevoTurnoProveedor({
  to, proveedorNombre, clienteNombre, clienteTelefono, fecha, hora, servicio, notas, codigo,
}: {
  to: string; proveedorNombre: string; clienteNombre: string; clienteTelefono?: string | null;
  fecha: string; hora: string; servicio?: string | null; notas?: string | null; codigo: string;
}) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Nuevo turno — ${clienteNombre} el ${formatFecha(fecha)} a las ${hora}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;background:#FFFBF3;border-radius:16px;overflow:hidden;border:1px solid #EFE5D0">
        <div style="background:#1C1C1C;padding:28px 32px">
          <div style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.4px">TuServicioHoy</div>
          <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px">Panel de ${proveedorNombre}</div>
        </div>
        <div style="padding:32px">
          <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#2A2420;letter-spacing:-0.3px">Nuevo turno agendado</p>
          <p style="margin:0 0 24px;font-size:15px;color:#5C5048">Un cliente reservó en tu agenda.</p>

          <div style="background:#fff;border:1px solid #EFE5D0;border-radius:12px;overflow:hidden;margin-bottom:20px">
            <div style="padding:16px 20px;border-bottom:1px solid #EFE5D0;background:#FAF4E8">
              <div style="font-size:18px;font-weight:700;color:#E8673A;letter-spacing:-0.3px">${formatFecha(fecha)} · ${hora}</div>
              <div style="font-size:13px;color:#8B7D6B;margin-top:3px">${servicio ?? 'Consulta'}</div>
            </div>
            ${[
              ['Cliente', clienteNombre],
              ...(clienteTelefono ? [['Teléfono', clienteTelefono]] : []),
              ['Código', codigo],
              ...(notas ? [['Notas', notas]] : []),
            ].map(([k, v]) => `
              <div style="padding:12px 20px;border-bottom:1px solid #EFE5D0;display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:13px;color:#8B7D6B">${k}</span>
                <span style="font-size:13px;font-weight:600;color:#2A2420;max-width:60%;text-align:right">${v}</span>
              </div>
            `).join('')}
          </div>

          <a href="${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/dashboard"
             style="display:block;text-align:center;background:#E8673A;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:-0.2px">
            Ver en mi panel →
          </a>
        </div>
      </div>
    `,
  });
}
