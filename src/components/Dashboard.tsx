import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Layers,
  FolderTree,
  Box,
  ArrowUpRight,
  Zap,
  Clock
} from 'lucide-react';
import { Category, Subcategory, Model, Product } from '../types';

export default function Dashboard({ catalog }: { catalog: any }) {
  const { data, allProducts } = catalog;
  
  const stats = useMemo(() => {
    const categoriesCount = data.categories.length;
    let subcategoriesCount = 0;
    let modelsCount = 0;
    
    data.categories.forEach((cat: Category) => {
      subcategoriesCount += cat.subcategories.length;
      cat.subcategories.forEach((sub: Subcategory) => {
        modelsCount += sub.models.length;
      });
    });

    return [
      { 
        label: 'Total Productos', 
        value: allProducts.length, 
        icon: Package, 
        trend: 'Catálogo',
      },
      { 
        label: 'Categorías', 
        value: categoriesCount, 
        icon: Layers, 
        trend: 'Secciones',
      },
      { 
        label: 'Subcategorías', 
        value: subcategoriesCount, 
        icon: FolderTree, 
        trend: 'Divisiones',
      },
      { 
        label: 'Modelos', 
        value: modelsCount, 
        icon: Box, 
        trend: 'Agrupaciones',
      },
    ];
  }, [data, allProducts]);

  const recentProducts = useMemo(() => {
    return [...allProducts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  }, [allProducts]);

  const categoryDistribution = useMemo(() => {
    return data.categories.map((cat: Category) => {
      let count = 0;
      cat.subcategories.forEach(sub => {
        sub.models.forEach(mod => {
          mod.submodels.forEach(smod => {
            count += smod.products.length;
          });
        });
      });
      return { name: cat.name, count };
    }).sort((a: any, b: any) => b.count - a.count);
  }, [data]);

  return (
    <div className="space-y-12 pb-20">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[48px] flex flex-col gap-6 group hover:translate-y-[-10px] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 group-hover:bg-white group-hover:text-black transition-all duration-500">
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-white/60 uppercase tracking-widest">
                <ArrowUpRight size={14} />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.25em]">{stat.label}</p>
              <h3 className="text-4xl font-black tracking-tighter text-white mt-1 italic">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Products */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-[60px] p-12 relative overflow-hidden"
        >
          <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4 mb-10">
            <Clock size={28} className="text-white/60" />
            Últimos Agregados
          </h3>
          <div className="space-y-4">
            {recentProducts.length > 0 ? recentProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white transition-all duration-500 group">
                <div className="w-12 h-12 rounded-xl bg-white overflow-hidden p-1 flex-shrink-0">
                  <img src={p.image || 'https://via.placeholder.com/150'} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-sm uppercase italic group-hover:text-black transition-colors truncate">{p.name || 'SIN NOMBRE'}</div>
                  <div className="text-[9px] font-black text-white/40 uppercase group-hover:text-black/40 transition-colors uppercase tracking-[0.2em]">{p.sku || 'SIN SKU'}</div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 group-hover:bg-black/5 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-black/40">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-20 uppercase font-black tracking-widest text-xs border border-dashed border-white/20 rounded-3xl">Sin productos recientes</div>
            )}
          </div>
        </motion.div>

        {/* Categories Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-[60px] p-12 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
              <Layers size={28} className="text-white/60" />
              Distribución por Categoría
            </h3>
          </div>
          <div className="space-y-4">
            {categoryDistribution.length > 0 ? categoryDistribution.map((cat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white/60">
                         <FolderTree size={20} />
                      </div>
                      <div>
                         <div className="font-black text-sm uppercase tracking-tighter italic">{cat.name}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[12px] font-black text-white uppercase tracking-widest">{cat.count} ÍTEMS</div>
                   </div>
                </div>
              </div>
            )) : (
              <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-20 grayscale border border-dashed border-white/20 rounded-3xl">
                 <span className="uppercase font-black tracking-widest text-xs">Sin datos de categorías</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Featured CTA */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }} 
         animate={{ opacity: 1, y: 0 }} 
         className="glass rounded-[60px] p-12 relative overflow-hidden bg-white/5 border-white/10"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-24 h-24 rounded-[40px] bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] flex-shrink-0">
            <Zap size={48} className="text-black" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-tight mb-4">Catálogo Satoshi Master</h3>
            <p className="text-lg text-white/60 leading-relaxed font-bold uppercase tracking-widest max-w-2xl">
              Modo consulta activo. Navega por las categorías, añade sub-modelos e ítems masivamente para mantener el inventario visual al día.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}