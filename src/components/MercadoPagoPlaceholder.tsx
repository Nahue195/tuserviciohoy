// TODO: Integrar MercadoPago cuando se active el cobro online
// Variables necesarias en .env:
//   MERCADOPAGO_ACCESS_TOKEN
//   MERCADOPAGO_PUBLIC_KEY
// SDK: https://www.mercadopago.com.ar/developers

interface MercadoPagoPlaceholderProps {
  amount: number;
  description: string;
  onSuccess?: (paymentId: string) => void;
}

export function MercadoPagoPlaceholder({ amount, description }: MercadoPagoPlaceholderProps) {
  return (
    <div style={{
      padding: 16, borderRadius: 12, border: '2px dashed #E5D9C2',
      background: '#FAF4E8', textAlign: 'center',
      fontFamily: 'inherit',
    }}>
      <div style={{ fontSize: 12, color: '#8B7D6B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
        💳 MercadoPago — No implementado
      </div>
      <div style={{ fontSize: 13, color: '#5C5048' }}>
        Pago de <strong>ARS {amount.toLocaleString('es-AR')}</strong> por {description}
      </div>
      <div style={{ fontSize: 11, color: '#8B7D6B', marginTop: 6 }}>
        El pago se realiza en el local al momento del turno.
      </div>
    </div>
  );
}
