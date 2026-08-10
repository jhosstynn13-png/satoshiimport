import React, { useState } from 'react';
import { X, Save, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<Partial<Product> | null>(null);
  const [form, setForm] = useState({
    name: product.name || '',
    sku: product.sku || '',
    image: product.image || '',
    price: product.price?.toString() || '',
    sizes: (product.sizes || []).join(', '),
    status: (product.status || 'active') as 'active' | 'discontinued',
    description: product.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let priceVal = Number(form.price);
    if (isNaN(priceVal)) {
      priceVal = 0;
    }

    const data = {
      name: form.name,
      sku: form.sku,
      image: form.image,
      price: priceVal,
      sizes: form.sizes.split(',').map(s => s.trim()).filter(s => s),
      status: form.status,
      description: form.description
    };

    console.log("✅ Cambios guardados exitosamente en terminal:", data);
    setSuccessData(data);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md shadow-2xl"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          className="relative w-full max-w-2xl glass-rich rounded-[60px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-10 border border-white/10"
        >
          <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Editar Master</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.25em] font-black mt-1">Ref: {product.sku || 'N/A'}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-[24px] transition-all hover:rotate-90"
            >
              <X size={24} className="text-white/60" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar" noValidate>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">Denominación del Ítem</label>
              <input 
                type="text" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] outline-none focus:bg-white/10 focus:border-white transition-all text-xs font-bold uppercase tracking-widest"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">SKU Reference</label>
                <input 
                  type="text" 
                  value={form.sku}
                  onChange={e => setForm({...form, sku: e.target.value})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] outline-none focus:bg-white/10 focus:border-white transition-all text-xs font-mono font-bold uppercase tracking-wider"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">Valor Comercial (S/)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] outline-none focus:bg-white/10 focus:border-white transition-all text-xs font-black italic tracking-tighter"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">Tallas Disponibles (Sep. Coma)</label>
                <input 
                  type="text" 
                  value={form.sizes}
                  onChange={e => setForm({...form, sizes: e.target.value})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] outline-none focus:bg-white/10 focus:border-white transition-all text-xs font-black uppercase tracking-widest"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">Estado del Canal</label>
                <select 
                  value={form.status}
                  onChange={e => setForm({...form, status: e.target.value as any})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-black uppercase tracking-widest italic"
                >
                  <option value="active" className="bg-black text-white">Activo en Ventas</option>
                  <option value="discontinued" className="bg-black text-white">Descontinuado</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">Source URL Asset</label>
              <div className="flex gap-2">
                <div className="flex-1 relative group">
                  <input 
                    type="text" 
                    value={form.image}
                    onChange={e => setForm({...form, image: e.target.value})}
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest italic"
                  />
                  {form.image && (
                    <div className="absolute bottom-16 right-0 z-50 p-2 bg-black/95 border border-white/10 rounded-2xl shadow-2xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-all scale-95 group-focus-within:scale-100">
                      <img 
                        src={form.image} 
                        alt="Previsualización" 
                        className="w-32 h-32 object-cover rounded-xl"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-center px-8 bg-white/5 border border-white/10 rounded-[28px] hover:bg-white/10 cursor-pointer transition-all group active:scale-95">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setForm({...form, image: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Upload size={20} className="text-white/40 group-hover:text-white transition-colors" />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">Descripción Técnica</label>
              <textarea 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[32px] outline-none focus:bg-white/10 focus:border-white transition-all min-h-[160px] resize-none text-[10px] font-black uppercase tracking-[0.25em] leading-relaxed"
              />
            </div>

            <div className="flex gap-6 pt-6">
              <button 
                type="button"
                onClick={onClose}
                className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-black rounded-[28px] transition-all uppercase tracking-widest text-[10px] italic"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 py-5 bg-white text-black font-black rounded-[28px] transition-all shadow-[0_15px_40px_rgba(255,255,255,0.15)] active:scale-95 flex items-center justify-center gap-4 uppercase tracking-widest text-[10px] italic"
              >
                <Save size={20} />
                Guardar Cambios
              </button>
            </div>
          </form>
        </motion.div>

        {/* Modal de Validación de Errores */}
        <AnimatePresence>
          {error && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setError(null)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-[#1A1A1A] border border-red-500/30 p-8 rounded-[40px] shadow-2xl max-w-sm w-full text-center z-10"
              >
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h4 className="text-white font-black text-xl mb-2 uppercase tracking-tight">Error de Validación</h4>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-8 leading-relaxed">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="w-full py-4 bg-white hover:bg-gray-200 text-black font-black rounded-[20px] transition-all uppercase tracking-widest text-xs"
                >
                  Entendido
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal de Éxito al Guardar */}
        <AnimatePresence>
          {successData && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-[#1A1A1A] border border-green-500/30 p-8 rounded-[40px] shadow-2xl max-w-sm w-full text-center z-10"
              >
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h4 className="text-white font-black text-xl mb-2 uppercase tracking-tight">Cambios Guardados</h4>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-8 leading-relaxed">
                  El producto se ha actualizado correctamente.
                </p>
                <button 
                  onClick={() => {
                    onSave(successData);
                    setSuccessData(null);
                  }}
                  className="w-full py-4 bg-white hover:bg-gray-200 text-black font-black rounded-[20px] transition-all uppercase tracking-widest text-xs"
                >
                  Continuar
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
