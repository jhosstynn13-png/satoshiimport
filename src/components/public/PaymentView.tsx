import { motion } from 'motion/react';
import { ShoppingCart, Smartphone, QrCode, Timer, CheckCircle, ChevronLeft, ArrowRight, Download } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { useCart } from '../../context/CartContext';
import { downloadReceipt, generateReceiptText } from '../../lib/receipt';
import { OrderItem } from '../../types';
import { sendOrderNotification } from '../../services/emailService';

interface PaymentViewProps {
  onBack: () => void;
  catalog: any;
}

export default function PaymentView({ onBack, catalog }: PaymentViewProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { currentUser, addOrder } = catalog;
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [method, setMethod] = useState<'yape' | 'dale'>('yape');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [finalTotal, setFinalTotal] = useState(0); 

  const [form, setForm] = useState({ 
    phone: '', 
    departamento: '',
    localidad: '',
    zip: '',
    calle: '',
    numero: '',
    sinNumero: false,
    piso: '',
    calle1: '',
    calle2: '',
    sinEntrecalles: false,
    indicaciones: '',
    tel: ''
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);

  useEffect(() => {
    let timer: any;
    if (!isSuccess && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isSuccess, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateShipping = () => {
    if (!form.departamento) return alert('Ingresa el departamento.');
    if (!form.localidad) return alert('Ingresa la localidad o barrio.');
    if (!form.calle) return alert('Ingresa la calle.');
    if (!form.numero && !form.sinNumero) return alert('Ingresa el número o marca "Sin número".');
    if (!form.tel) return alert('Ingresa un teléfono de contacto.');
    return true;
  };

  const handleNextStep = () => {
    if (validateShipping()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePayment = (e: FormEvent) => {
    e.preventDefault();
    if (!validateShipping()) return;

    const currentTotal = totalPrice;
    setFinalTotal(currentTotal);

    // Build WhatsApp message
    const waPhone = "51944186522";
    let waMessage = `*NUEVO PEDIDO - SATOSHIMPORT*%0A%0A`;
    waMessage += `*Cliente:* ${currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Invitado'}%0A`;
    if (currentUser?.dni) waMessage += `*DNI:* ${currentUser.dni}%0A`;
    waMessage += `*Teléfono:* ${form.tel}%0A%0A`;
    
    waMessage += `*DATOS DE ENVÍO*%0A`;
    waMessage += `*Dirección:* ${form.calle} ${form.numero || 'S/N'} ${form.piso ? '- ' + form.piso : ''}%0A`;
    waMessage += `*Localidad:* ${form.localidad}, ${form.departamento} ${form.zip ? '(CP: ' + form.zip + ')' : ''}%0A`;
    if (!form.sinEntrecalles) waMessage += `*Entrecalles:* ${form.calle1} y ${form.calle2}%0A`;
    if (form.indicaciones) waMessage += `*Referencia:* ${form.indicaciones}%0A%0A`;
    
    waMessage += `*PRODUCTOS*%0A`;
    items.forEach(item => {
      const name = item.selectedSize ? `${item.name} - Talla ${item.selectedSize}` : item.name;
      waMessage += `- ${item.quantity}x ${name} ($ ${(item.price * item.quantity).toFixed(2)})%0A`;
    });
    waMessage += `%0A*TOTAL:* $ ${currentTotal.toFixed(2)}%0A`;

    // Simular procesamiento
    setTimeout(() => {
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.id,
        name: item.selectedSize ? `${item.name} - Talla ${item.selectedSize}` : item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price
      }));

      const newOrderData = {
        customerId: currentUser?.id || 'guest',
        customerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Invitado',
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
      window.open(`https://wa.me/${waPhone}?text=${waMessage}`, '_blank');

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
              name: item.selectedSize ? `${item.name} - Talla ${item.selectedSize}` : item.name,
              units: item.quantity,
              price: (item.price * item.quantity).toFixed(2)
            })),
            cost: {
              shipping: 'A COORDINAR',
              tax: '0.00', // Send something to avoid empty template tags if they exist
              total: currentTotal.toFixed(2)
            },
            client_details: `
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 4px 0; color: #666;">Cliente:</td><td style="padding: 4px 0; text-align: right;"><strong>${completedOrder.customerName}</strong></td></tr>
                  <tr><td style="padding: 4px 0; color: #666;">DNI:</td><td style="padding: 4px 0; text-align: right;">${currentUser?.dni || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #666;">Teléfono:</td><td style="padding: 4px 0; text-align: right;">${form.tel}</td></tr>
                </table>
                <h4 style="margin: 20px 0 10px 0; text-transform: uppercase; font-size: 12px; color: #888;">Dirección de Entrega</h4>
                <div style="border-left: 3px solid #000; padding-left: 12px;">
                  <p style="margin: 2px 0;"><strong>${form.calle} ${form.numero || 'S/N'}</strong> ${form.piso ? '- ' + form.piso : ''}</p>
                  <p style="margin: 2px 0; font-size: 13px;">${form.localidad}, ${form.departamento} ${form.zip ? '(CP: ' + form.zip + ')' : ''}</p>
                  ${!form.sinEntrecalles ? `<p style="margin: 2px 0; font-size: 12px; color: #666;">Entrecalles: ${form.calle1} y ${form.calle2}</p>` : ''}
                  <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic; color: #444;">Ref: ${form.indicaciones || 'Sin referencia adicional'}</p>
                </div>
                <h4 style="margin: 20px 0 10px 0; text-transform: uppercase; font-size: 12px; color: #888;">Método</h4>
                <p style="margin: 2px 0;">Estado: <strong>SOLICITUD VÍA WHATSAPP</strong></p>
              </div>
            `
          };
          
          await sendOrderNotification(emailData);
          // downloadReceipt(completedOrder, currentUser);
        } catch (err) {
          console.error("Receipt actions failed:", err);
        }
      };

      processPayment();
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-[50px] border-white/5 space-y-8"
        >
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Pedido Confirmado</h2>
            <p className="text-white/40 italic">Tu adquisición ha sido procesada con éxito.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl space-y-4 text-left">
            <div className="flex justify-between border-b border-white/5 pb-2">
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
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              onClick={onBack}
              className="w-full bg-white text-black py-4 rounded-full font-black uppercase tracking-widest italic text-xs shadow-xl active:scale-95 transition-all"
            >
              Volver a la Tienda
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black uppercase tracking-widest text-[9px]"
      >
        <ChevronLeft size={14} /> Volver al Catálogo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Progress Tracker */}
        <div className="lg:col-span-2 flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= 1 ? 'bg-white text-black' : 'bg-white/5 text-white/20'}`}>1</div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 1 ? 'text-white' : 'text-white/20'}`}>Envío</span>
          </div>
          <div className={`w-12 h-px ${step >= 2 ? 'bg-white' : 'bg-white/5'}`} />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= 2 ? 'bg-white text-black' : 'bg-white/5 text-white/20'}`}>2</div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 2 ? 'text-white' : 'text-white/20'}`}>Pedido</span>
          </div>
        </div>

        <section className="space-y-8">
          {step === 1 ? (
            /* Shipping Address Section */
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">Datos de <span className="text-white/20">Envío</span></h1>
                <p className="text-white/40 italic text-sm">Completa tus datos para que podamos hacerte llegar tu pedido lo antes posible.</p>
              </div>

              <div className="glass p-8 rounded-[40px] border-white/5 space-y-6">
                <h3 className="text-lg font-black uppercase italic tracking-wider flex items-center gap-3">
                  <QrCode size={20} className="text-white/20" /> Dirección de Entrega
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-full">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Departamento</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Lima"
                      value={form.departamento}
                      onChange={e => setForm(prev => ({ ...prev, departamento: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Localidad o barrio</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Miraflores"
                      value={form.localidad}
                      onChange={e => setForm(prev => ({ ...prev, localidad: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Código postal</label>
                    <input 
                      type="text" 
                      placeholder="15074"
                      value={form.zip}
                      onChange={e => setForm(prev => ({ ...prev, zip: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2 col-span-full">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Calle</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nombre de la calle"
                      value={form.calle}
                      onChange={e => setForm(prev => ({ ...prev, calle: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Número</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="text" 
                        disabled={form.sinNumero}
                        required={!form.sinNumero}
                        placeholder="123"
                        value={form.numero}
                        onChange={e => setForm(prev => ({ ...prev, numero: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all disabled:opacity-30"
                      />
                      <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <input 
                          type="checkbox"
                          checked={form.sinNumero}
                          onChange={e => setForm(prev => ({ ...prev, sinNumero: e.target.checked, numero: e.target.checked ? '' : prev.numero }))}
                          className="w-4 h-4 rounded bg-white/5 border-white/10 checked:bg-white"
                        />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Sin número</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Piso / Dpto (Opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Dpto 402"
                      value={form.piso}
                      onChange={e => setForm(prev => ({ ...prev, piso: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>

                  <div className="col-span-full border border-white/5 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Entrecalles</h4>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={form.sinEntrecalles}
                          onChange={e => setForm(prev => ({ ...prev, sinEntrecalles: e.target.checked, calle1: '', calle2: '' }))}
                          className="w-4 h-4 rounded bg-white/5 border-white/10 checked:bg-white"
                        />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Sin entrecalles</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        disabled={form.sinEntrecalles}
                        placeholder="Calle 1"
                        value={form.calle1}
                        onChange={e => setForm(prev => ({ ...prev, calle1: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-xs font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all disabled:opacity-30"
                      />
                      <input 
                        type="text" 
                        disabled={form.sinEntrecalles}
                        placeholder="Calle 2"
                        value={form.calle2}
                        onChange={e => setForm(prev => ({ ...prev, calle2: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-xs font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all disabled:opacity-30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 col-span-full">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Indicaciones adicionales (Opcional)</label>
                    <textarea 
                      placeholder="Casa blanca con rejas negras..."
                      value={form.indicaciones}
                      onChange={e => setForm(prev => ({ ...prev, indicaciones: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-[30px] px-6 py-4 text-xs font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-2 col-span-full">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Teléfono de contacto</label>
                    <div className="flex gap-2">
                      <div className="bg-white/5 border border-white/10 rounded-full px-4 py-4 flex items-center gap-2">
                        <span className="text-xs font-black">🇵🇪 +51</span>
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="9XXXXXXXX"
                        value={form.tel}
                        onChange={e => setForm(prev => ({ ...prev, tel: e.target.value.replace(/\D/g, '') }))}
                        className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleNextStep}
                className="w-full bg-white text-black py-5 rounded-full font-black uppercase tracking-[0.3em] italic text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
              >
                Siguiente Paso <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            /* Payment Section */
            <form onSubmit={handlePayment} className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">Confirmar <span className="text-white/20">Pedido</span></h1>
                <p className="text-white/40 italic text-sm">Revisa tu información y envía tu pedido por WhatsApp para coordinar el pago y envío.</p>
              </div>

              <div className="glass p-8 rounded-[40px] border-white/5 space-y-6">
                <h3 className="text-lg font-black uppercase italic tracking-wider flex items-center gap-3">
                  <Smartphone size={20} className="text-white/20" /> Solicitud por WhatsApp
                </h3>
                
                <div className="bg-white/5 border border-dashed border-white/10 p-8 rounded-[30px] text-center space-y-4">
                  <h2 className="text-base font-black uppercase italic tracking-wider">¡Todo Listo!</h2>
                  <p className="text-sm text-white/60">Al confirmar, serás redirigido a WhatsApp con el resumen de tu pedido para coordinar directamente con un vendedor de Satoshimport.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  type="submit"
                  className="w-full bg-emerald-500 text-black py-5 rounded-full font-black uppercase tracking-[0.3em] italic text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Solicitar Pedido por $ {totalPrice.toLocaleString()} <ArrowRight size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[9px] uppercase font-black tracking-widest text-white/20 hover:text-white/40 transition-all"
                >
                  Volver a datos de envío
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Summary Overlay */}
        <aside className="space-y-8">
          <div className="glass p-8 rounded-[40px] border-white/5 h-fit">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
              <ShoppingCart size={20} className="text-white/20" /> Resumen
            </h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {items.map(item => (
                <div key={item.cartItemId} className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-[10px] font-black uppercase tracking-widest italic">{item.name}{item.selectedSize ? ` - Talla ${item.selectedSize}` : ""}</h4>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-0.5">X{item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black italic">$ {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest opacity-40">
                <span>Subtotal</span>
                <span>$ {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-black uppercase tracking-widest opacity-40">
                <span>Envío</span>
                <span>A COORDINAR</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-sm font-black italic uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black italic tracking-tighter text-emerald-400">$ {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-relaxed italic text-center">
                Protocolo de Pago Seguro Activado // SATOSHIMPORT SSL v2.0
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
