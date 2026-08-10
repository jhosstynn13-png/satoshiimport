import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Trash2, Plus, Minus, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function FloatingCart({ onCheckout }: { onCheckout?: () => void }) {
  const { items, removeItem, addItem, totalItems, totalPrice, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-72 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-2xl p-5 mb-4 overflow-hidden flex flex-col max-h-[70vh]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white text-black rounded-xl flex items-center justify-center text-[10px] font-black">
                  {totalItems}
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest italic">Mi Carrito</h3>
                  <p className="text-[7px] text-white/40 font-black uppercase tracking-widest leading-tight">Protocolo de Cotización</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all font-black uppercase tracking-widest italic"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-2 no-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 p-2 bg-white/5 border border-white/5 rounded-2xl group">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image || `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop`} 
                      alt={item.name}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-white/80 leading-tight mb-1 truncate">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black italic text-emerald-400">$ {(item.price * item.quantity).toLocaleString()}</span>
                      <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg px-1.5 py-0.5">
                        <button onClick={() => removeItem(item.id)} className="text-white/40 hover:text-white"><Minus size={10} /></button>
                        <span className="text-[9px] font-black">{item.quantity}</span>
                        <button onClick={() => addItem(item)} className="text-white/40 hover:text-white"><Plus size={10} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Total Estimado</span>
                <span className="text-xl font-black italic tracking-tighter text-white leading-none">$ {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={clearCart}
                  className="p-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all font-black uppercase tracking-widest italic"
                >
                  <Trash2 size={14} />
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onCheckout?.();
                  }}
                  className="flex-grow bg-white text-black font-black uppercase italic tracking-widest text-[9px] py-3 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard size={14} />
                  Enviar Pedido
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`relative w-20 h-20 rounded-[30px] flex items-center justify-center transition-all duration-500 ${
          isOpen ? 'bg-white text-black' : 'bg-black/80 backdrop-blur-xl border border-white/20 text-white'
        } shadow-2xl`}
      >
        <ShoppingCart size={28} />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-black text-[12px] font-black italic rounded-full flex items-center justify-center border-4 border-black">
          {totalItems}
        </div>
      </motion.button>
    </div>
  );
}
