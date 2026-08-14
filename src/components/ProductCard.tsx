import React, { useState } from 'react';
import { Edit2, Trash2, Box, Package, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onAddToCart?: (p: Product, size?: string) => void;
  showControls?: boolean;
  isPublic?: boolean;
  catalog?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  onAddToCart,
  showControls = true, 
  isPublic = false 
}) => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  const displaySizes = isPublic && product.sizes && product.sizes.length > 0 
    ? [...product.sizes, 'Otros'] 
    : product.sizes || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group glass rounded-[32px] overflow-hidden border-white/5 hover:border-white/20 transition-all duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col h-full bg-white/[0.02]"
    >
      <div className="aspect-square relative overflow-hidden transition-all duration-1000">
        <img 
          src={product.image || 'https://via.placeholder.com/300?text=GS-PRODUCT'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          <div className="px-2 py-1 bg-white/10 text-black text-[7px] font-black uppercase tracking-[0.15em] rounded-md backdrop-blur-sm border border-black/5">
            {product.status === 'active' ? '● En Venta' : '○ Pausado'}
          </div>
        </div>

        {showControls && !isPublic && (
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-10">
            <div className="flex flex-col gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-3.5 bg-black/90 backdrop-blur-md text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/20 hover:border-white/40"
                title="Editar"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-3.5 bg-red-600/20 text-red-400 hover:scale-110 active:scale-95 transition-all border border-red-500/30 hover:bg-red-500 hover:text-white rounded-2xl shadow-2xl"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="space-y-2">
          <h4 className="text-md font-black text-white uppercase italic tracking-tighter leading-tight group-hover:translate-x-2 transition-transform duration-500 line-clamp-2">
            {product.name}
          </h4>
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {displaySizes.map(size => (
                <button 
                  key={size}
                  onClick={() => { if (isPublic) setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]) }}
                  disabled={!isPublic}
                  className={`px-1.5 py-0.5 border rounded text-[8px] font-black transition-all ${
                    selectedSizes.includes(size) 
                      ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                      : `bg-white/5 border-white/5 text-white/50 ${isPublic ? "hover:bg-white/20 hover:text-white cursor-pointer" : ""}`
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">
              {isPublic ? 'Precio USD' : 'Precio Final'}
            </span>
            <span className="text-xl font-black italic text-white tracking-tighter">
              {isPublic ? '$' : 'S/'} {product.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
          </div>
          {isPublic ? (
            <button 
              onClick={() => {
                if (displaySizes.length > 0 && selectedSizes.length === 0) {
                  alert('Por favor selecciona una talla antes de añadir al carrito.');
                  return;
                }
                if (displaySizes.length === 0) {
                  onAddToCart?.(product);
                } else {
                  selectedSizes.forEach(s => onAddToCart?.(product, s));
                }
                setSelectedSizes([]);
              }}
              disabled={!onAddToCart}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg ${
                onAddToCart 
                  ? 'bg-white text-black hover:scale-110 active:scale-95 shadow-white/10' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5 shadow-none'
              }`}
            >
              <ShoppingCart size={18} />
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 cursor-pointer">
              <Box size={18} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
