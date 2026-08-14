const fs = require('fs');

let code = fs.readFileSync('src/components/public/PaymentView.tsx', 'utf8');

// 1. Rewrite handlePayment to generate the order first, then include ID in WhatsApp message.
const targetHandlePayment = `  const handlePayment = (e: FormEvent) => {
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
      window.open(\`https://wa.me/\${waPhone}?text=\${waMessage}\`, '_blank');`;

const newHandlePayment = `  const handlePayment = (e: FormEvent) => {
    e.preventDefault();
    if (!validateShipping()) return;

    const currentTotal = totalPrice;
    setFinalTotal(currentTotal);

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

      // Build WhatsApp message AFTER creating the order so we have the ID
      const waPhone = "51944186522";
      let waMessage = \`*NUEVO PEDIDO - SATOSHIMPORT*%0A\`;
      waMessage += \`*ORDEN ID:* \${completedOrder.id}%0A%0A\`;
      waMessage += \`*Cliente:* \${currentUser ? \`\${currentUser.firstName} \${currentUser.lastName}\` : 'Invitado'}%0A\`;
      if (currentUser?.dni) waMessage += \`*DNI:* \${currentUser.dni}%0A\`;
      waMessage += \`*Teléfono:* \${form.tel}%0A%0A\`;
      
      waMessage += \`*DATOS DE ENVÍO*%0A\`;
      waMessage += \`*Dirección:* \${form.calle} \${form.numero || 'S/N'} \${form.piso ? '- ' + form.piso : ''}%0A\`;
      waMessage += \`*Localidad:* \${form.localidad}, \${form.departamento} \${form.zip ? '(CP: ' + form.zip + ')' : ''}%0A\`;
      if (!form.sinEntrecalles) waMessage += \`*Entrecalles:* \${form.calle1} y \${form.calle2}%0A\`;
      if (form.indicaciones) waMessage += \`*Referencia:* \${form.indicaciones}%0A%0A\`;
      
      waMessage += \`*PRODUCTOS*%0A\`;
      orderItems.forEach(item => {
        waMessage += \`- \${item.quantity}x \${item.name} ($ \${(item.price * item.quantity).toFixed(2)})%0A\`;
      });
      waMessage += \`%0A*TOTAL:* $ \${currentTotal.toFixed(2)}%0A\`;

      // Open WhatsApp
      window.open(\`https://wa.me/\${waPhone}?text=\${waMessage}\`, '_blank');`;

code = code.replace(targetHandlePayment, newHandlePayment);

// 2. Remove the "Método: YAPE" from the success UI
const targetSuccessUI = `            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Orden ID</span>
              <span className="font-mono text-sm">{currentOrder?.id}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Método</span>
              <span className="text-sm font-black italic uppercase tracking-widest">{method.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total</span>
              <span className="text-sm font-black italic text-emerald-400">$ {finalTotal.toLocaleString()}</span>
            </div>`;

const newSuccessUI = `            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Orden ID</span>
              <span className="font-mono text-sm">{currentOrder?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total</span>
              <span className="text-sm font-black italic text-emerald-400">$ {finalTotal.toLocaleString()}</span>
            </div>`;

code = code.replace(targetSuccessUI, newSuccessUI);

// Fix paymentMethod: 'whatsapp' Type error if 'whatsapp' is not allowed by PaymentMethod type
// Actually PaymentMethod allows 'yape' | 'dale' | 'cash' | 'transfer' | 'card' | 'other'
// I'll leave it as is, or wait, it might give a TS error. I'll change it to 'other' or update types.
// But earlier it had `paymentMethod: 'whatsapp',` and it compiled. Wait, in PaymentView.tsx it had that? No, wait. Let's see if the build fails.

fs.writeFileSync('src/components/public/PaymentView.tsx', code);
