import { Order, User } from '../types';

export function generateReceiptText(order: Order, user: User | null): string {
  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }) + ` - ${date.toLocaleTimeString('es-PE')}`;

  const clientName = user ? `${user.firstName} ${user.lastName}` : order.customerName;
  const clientDni = user?.dni || 'N/A';
  const clientEmail = user?.email || 'N/A';
  const clientPhone = order.shippingDetails?.tel || user?.phone || 'N/A';
  
  const address = order.shippingDetails 
    ? `${order.shippingDetails.calle} ${order.shippingDetails.sinNumero ? 'S/N' : order.shippingDetails.numero}${order.shippingDetails.piso ? ', ' + order.shippingDetails.piso : ''}, ${order.shippingDetails.localidad}, ${order.shippingDetails.departamento}`
    : 'N/A';

  const itemsContent = order.items.map(item => {
    const code = (item.sku || item.productId.slice(0, 6)).toUpperCase().padEnd(8).slice(0, 8);
    const qty = item.quantity.toString().padEnd(5);
    const name = item.name.padEnd(35).slice(0, 35);
    const price = `S/ ${(item.price * item.quantity).toFixed(2)}`.padStart(12);
    return `${code} | ${qty} | ${name} | ${price}`;
  }).join('\n');

  let receipt = `==========================================================
                      SATOSHIMPORT
==========================================================
               BOLETA DE VENTA ELECTRÓNICA
                     Nro: SAT-${order.id.slice(-7).toUpperCase()}
==========================================================
FECHA DE EMISIÓN: ${formattedDate}
==========================================================

--- DATOS DEL TITULAR ---
Nombre Completo : ${clientName}
DNI             : ${clientDni}
Teléfono        : ${clientPhone}
Dirección       : ${address}
Correo          : ${clientEmail}

--- DETALLE DE ADQUISICIÓN ---
CÓDIGO   | CANT. | ARTÍCULO                            | PRECIO
----------------------------------------------------------
${itemsContent}
----------------------------------------------------------
                                  TOTAL PAGADO: S/ ${order.total.toFixed(2).padStart(8)}

--- REGISTRO DE TRANSACCIÓN ---
Operación: ${order.id.toUpperCase()}
Método: Pasarela Digital (${order.paymentMethod?.toUpperCase() || 'N/A'})
Estado: COMPLETADO / PROPIEDAD TRANSFERIDA

==========================================================
CERTIFICADO DE PROPIEDAD:
Este comprobante certifica que el cliente identificado 
ha liquidado el monto total y es el propietario legal 
y definitivo de los artículos arriba descritos.
==========================================================
`;

  return receipt;
}

export function downloadReceipt(order: Order, user: User | null) {
  if (!order) return;
  const text = generateReceiptText(order, user);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `boleta-satoshimport-${order.id.slice(-7).toUpperCase()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
