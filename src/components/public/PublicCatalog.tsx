import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, Info, X, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductCard from '../ProductCard';

export default function PublicCatalog({ catalog, initialCategoryName = null }: { catalog: any, initialCategoryName?: string | null }) {
  const { categories } = catalog.data;
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategoryName);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with initialCategoryName from Layout (Navbar clicks)
  useEffect(() => {
    if (initialCategoryName) {
      setActiveCategory(initialCategoryName);
      setActiveSubcategory(null);
      setActiveModel(null);
    }
  }, [initialCategoryName]);

  // Extract all products from categories with hierarchical filtering
  const allProducts = (categories || []).flatMap((cat: any) => {
    if (activeCategory && cat.name !== activeCategory) return [];
    
    return (cat.subcategories || []).flatMap((sub: any) => {
      if (activeSubcategory && sub.name !== activeSubcategory) return [];
      
      return (sub.models || []).flatMap((mod: any) => {
        if (activeModel && mod.name !== activeModel) return [];
        
        return (mod.products || []).map((p: any) => ({
          ...p,
          categoryName: cat.name,
          subcategoryName: sub.name,
          modelName: mod.name
        }));
      });
    });
  }).filter((p: any) => p && p.status === 'active');

  const filteredProducts = allProducts.filter((p: any) => {
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(t => t.length > 0);
    if (searchTerms.length === 0) return true;

    const searchableText = `${p.name} ${p.sku} ${p.categoryName} ${p.subcategoryName} ${p.modelName}`.toLowerCase();
    return searchTerms.every(term => searchableText.includes(term));
  });

  const activeCategoryObj = categories?.find((c: any) => c.name === activeCategory);
  const subcategories = activeCategoryObj?.subcategories || [];
  const activeSubcategoryObj = subcategories.find((s: any) => s.name === activeSubcategory);
  const models = activeSubcategoryObj?.models || [];

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
    setActiveModel(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-8 py-6 px-6 md:px-12 min-h-screen">
      {/* Sticky Header: Search and Filters */}
      <div className="sticky top-[58px] z-30 bg-black/90 backdrop-blur-3xl -mx-6 md:-mx-12 px-6 md:px-12 py-6 border-b border-white/5 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Catálogo <span className="text-white/20">Studio</span></h2>
            {/* Breadcrumbs for Context */}
            <div className="flex items-center gap-2 mt-2">
               <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 italic">Navegando:</span>
               <div className="flex items-center gap-1">
                 <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${!activeCategory ? 'text-white' : 'text-white/30'}`}>Inicio</span>
                 {activeCategory && (
                   <>
                     <ChevronRight size={8} className="text-white/20" />
                     <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${!activeSubcategory ? 'text-white' : 'text-white/30'}`}>{activeCategory}</span>
                   </>
                 )}
                 {activeSubcategory && (
                   <>
                     <ChevronRight size={8} className="text-white/20" />
                     <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${!activeModel ? 'text-white' : 'text-white/30'}`}>{activeSubcategory}</span>
                   </>
                 )}
                 {activeModel && (
                   <>
                     <ChevronRight size={8} className="text-white/20" />
                     <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">{activeModel}</span>
                   </>
                 )}
               </div>
            </div>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={18} />
              <input 
                type="text"
                placeholder="BUSCAR CALZADO, TALLA O MARCA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-4 bg-white/5 border border-white/10 rounded-[20px] outline-none focus:bg-white/10 focus:border-white/30 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-white/20"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {(activeCategory || searchQuery) && (
              <button 
                onClick={clearFilters}
                className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[20px] hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 group"
                title="Limpiar Filtros"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform" />
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest leading-none">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Hierarchical Filter Bar */}
        <div className="space-y-6">
          {/* Main Categories Level - Hidden if browsing from a specific Navbar link */}
          {!initialCategoryName && (
            <div className="space-y-2">
              <p className="text-[7px] font-black uppercase tracking-[0.5em] text-white/20 ml-2">Seleccionar Categoría</p>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                <button 
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveSubcategory(null);
                    setActiveModel(null);
                  }}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${!activeCategory ? 'bg-white text-black border-white shadow-xl shadow-white/10 scale-105' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'}`}
                >
                  TODO EL STOCK
                </button>
                {(categories || []).map((cat: any) => (
                  <button 
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      setActiveSubcategory(null);
                      setActiveModel(null);
                    }}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat.name ? 'bg-white text-black border-white shadow-xl shadow-white/10 scale-105' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeCategory && subcategories.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`space-y-2 ${!initialCategoryName ? 'border-t border-white/5 pt-4' : ''}`}
              >
                <p className="text-[7px] font-black uppercase tracking-[0.5em] text-white/20 ml-2">Filtrar por Marca</p>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                  {subcategories.map((sub: any) => (
                    <button 
                      key={sub.id}
                      onClick={() => {
                        setActiveSubcategory(activeSubcategory === sub.name ? null : sub.name);
                        setActiveModel(null);
                      }}
                      className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeSubcategory === sub.name ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeSubcategory && models.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2 border-t border-white/5 pt-4"
              >
                <p className="text-[7px] font-black uppercase tracking-[0.5em] text-white/20 ml-2">Variante / Modelo Específico</p>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                  {models.map((mod: any) => (
                    <button 
                      key={mod.id}
                      onClick={() => setActiveModel(activeModel === mod.name ? null : mod.name)}
                      className={`px-5 py-2 rounded-md text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeModel === mod.name ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/5 text-white/30 border-white/10 hover:bg-white/10'}`}
                    >
                      {mod.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product: any) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard 
                product={product} 
                onEdit={() => {}} // Not usable here
                onDelete={() => {}} // Not usable here
                catalog={catalog}
                onAddToCart={(!catalog.currentUser || catalog.currentUser.id === 'guest') ? undefined : (p) => addItem(p)}
                isPublic={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-32 text-center">
          <div className="text-6xl font-black text-white/5 uppercase italic mb-4">No resultsFound</div>
          <p className="text-white/40 uppercase tracking-widest text-[10px] font-black">Pruebe con otros parámetros de búsqueda</p>
        </div>
      )}
    </div>
  );
}
