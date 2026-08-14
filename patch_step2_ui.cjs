const fs = require('fs');

let code = fs.readFileSync('src/components/public/PaymentView.tsx', 'utf8');

const startMarker = "            /* Payment Section */";
const endMarker = "            </form>\n          )}";

const newSection = `            /* Payment Section */
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
          )}`;

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newSection + code.substring(endIndex);
  fs.writeFileSync('src/components/public/PaymentView.tsx', code);
} else {
  console.log("Could not find markers");
}

