const fs = require('fs');

let code = fs.readFileSync('src/components/public/PaymentView.tsx', 'utf8');

// Replace the handlePayment function and processPayment function
const replaceCodeStart = "  const handlePayment = (e: FormEvent) => {";
const replaceCodeEnd = "  if (isSuccess) {";

const newHandlePayment = `  const handlePayment = (e: FormEvent) => {
    e.preventDefault();
    if (!validateShipping()) return;

    const currentTotal = totalPrice;
    setFinalTotal(currentTotal);

    // Build WhatsApp message
    const waPhone = "51944186522";
    let waMessage = \`*NUEVO PEDIDO - SATOSHIMPORT*%0A%0A\`;
    waMessage += \`*Cliente:* \${currentUser ? \`\${currentUser.firstName} \${currentUser.lastName}\` : 'Invitado'}%0A\`;
    if (currentUser?.dni) waMessage += \`*DNI:* \${currentUser.dni}%0A\`;
    waMessage += \`*Teléfono:* \${form.tel}%0A%0A\`;
    
    waMessage += \`*DATOS DE ENVÍO*%0A\`;
    waMessage += \`*Dirección:* \${form.calle} \${form.numero || 'S/N'} \${form.piso ? '- ' + form.piso : ''}%0A\`;
    waMessage += \`*Localidad:* \${form.localidad}, \${form.departamento} \${form.zip ? '(CP: ' + form.zip + ')' : ''}%0A\`;
    if (!form.sinEntrecalles) waMessage += \`*Entrecalles:* \${form.calle1} y \${form.calle2}%0A\`;
    if (form.indicaciones) waMessage += \`*Referencia:* \${form.indicaciones}%0A%0A\`;
    
    waMessage += \`*PRODUCTOS*%0A\`;
    items.forEach(item => {
      const name = item.selectedSize ? \`\${item.name} - Talla \${item.selectedSize}\` : item.name;
      waMessage += \`- \${item.quantity}x \${name} ($ \${(item.price * item.quantity).toFixed(2)})%0A\`;
    });
    waMessage += \`%0A*TOTAL:* $ \${currentTotal.toFixed(2)}%0A\`;

    // Simular procesamiento
    setTimeout(() => {
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.id,
        name: item.selectedSize ? \`\${item.name} - Talla \${item.selectedSize}\` : item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price
      }));

      const newOrderData = {
        customerId: currentUser?.id || 'guest',
        customerName: currentUser ? \`\${currentUser.firstName} \${currentUser.lastName}\` : 'Invitado',
        items: orderItems,
        total: currentTotal,
        status: 'pending' as const,
        paymentMethod: 'whatsapp',
        shippingDetails: { ...form },
      };

      const completedOrder = addOrder(newOrderData);
      setCurrentOrder(completedOrder);
      setIsSuccess(true);
      clearCart();

      // Open WhatsApp
      window.open(\`https://wa.me/\${waPhone}?text=\${waMessage}\`, '_blank');

      // Notify owner and Auto download
      const processPayment = async () => {
        try {
          // Prepare data for EmailJS template
          const emailData = {
            order_id: completedOrder.id,
            email: 'IMPORTSATOSHI@HOTMAIL.COM', 
            client_email: currentUser?.email || 'Invitado',
            screenshot_url: '', // No screenshot for WhatsApp request
            orders: items.map(item => ({
              image_url: item.image,
              name: item.selectedSize ? \`\${item.name} - Talla \${item.selectedSize}\` : item.name,
              units: item.quantity,
              price: (item.price * item.quantity).toFixed(2)
            })),
            cost: {
              shipping: 'A COORDINAR',
              tax: '0.00', // Send something to avoid empty template tags if they exist
              total: currentTotal.toFixed(2)
            },
            client_details: \`
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 4px 0; color: #666;">Cliente:</td><td style="padding: 4px 0; text-align: right;"><strong>\${completedOrder.customerName}</strong></td></tr>
                  <tr><td style="padding: 4px 0; color: #666;">DNI:</td><td style="padding: 4px 0; text-align: right;">\${currentUser?.dni || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #666;">Teléfono:</td><td style="padding: 4px 0; text-align: right;">\${form.tel}</td></tr>
                </table>
                <h4 style="margin: 20px 0 10px 0; text-transform: uppercase; font-size: 12px; color: #888;">Dirección de Entrega</h4>
                <div style="border-left: 3px solid #000; padding-left: 12px;">
                  <p style="margin: 2px 0;"><strong>\${form.calle} \${form.numero || 'S/N'}</strong> \${form.piso ? '- ' + form.piso : ''}</p>
                  <p style="margin: 2px 0; font-size: 13px;">\${form.localidad}, \${form.departamento} \${form.zip ? '(CP: ' + form.zip + ')' : ''}</p>
                  \${!form.sinEntrecalles ? \`<p style="margin: 2px 0; font-size: 12px; color: #666;">Entrecalles: \${form.calle1} y \${form.calle2}</p>\` : ''}
                  <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic; color: #444;">Ref: \${form.indicaciones || 'Sin referencia adicional'}</p>
                </div>
                <h4 style="margin: 20px 0 10px 0; text-transform: uppercase; font-size: 12px; color: #888;">Método</h4>
                <p style="margin: 2px 0;">Estado: <strong>SOLICITUD VÍA WHATSAPP</strong></p>
              </div>
            \`
          };
          
          await sendOrderNotification(emailData);
          downloadReceipt(completedOrder, currentUser);
        } catch (err) {
          console.error("Receipt actions failed:", err);
        }
      };

      processPayment();
    }, 1000);
  };

  if (isSuccess) {`;

code = code.substring(0, code.indexOf(replaceCodeStart)) + newHandlePayment + code.substring(code.indexOf(replaceCodeEnd) + "  if (isSuccess) {".length);

fs.writeFileSync('src/components/public/PaymentView.tsx', code);
