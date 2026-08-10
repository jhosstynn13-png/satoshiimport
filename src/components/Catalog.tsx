import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Filter, 
  ChevronRight, 
  Tag, 
  Layers, 
  Box,
  Search,
  MoreVertical,
  Upload
} from 'lucide-react';
import { useCatalog } from '../hooks/useCatalog';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { Product } from '../types';

interface CatalogProps {
  catalog: ReturnType<typeof useCatalog>;
  searchQuery: string;
}

export default function Catalog({ catalog, searchQuery }: CatalogProps) {
  const { 
    data, 
    selectedCategoryId, 
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
    selectedModelId,
    setSelectedModelId,
    selectedCategory,
    selectedSubcategory,
    selectedModel,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    addModel,
    deleteModel,
    addProduct,
    updateProduct,
    deleteProduct,
    allProducts,
    currentUser
  } = catalog;

  const isStaff = currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin';

  const [newCatName, setNewCatName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [sortOrder, setSortOrder] = useState<'new' | 'name' | 'priceAsc' | 'priceDesc'>('new');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    // If there's a search query, search in ALL products across the entire catalog
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      let products = allProducts.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );

      if (sortOrder === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
      if (sortOrder === 'priceAsc') products.sort((a, b) => a.price - b.price);
      if (sortOrder === 'priceDesc') products.sort((a, b) => b.price - a.price);
      if (sortOrder === 'new') products.sort((a, b) => b.createdAt - a.createdAt);

      return products;
    }

    // Otherwise, show only products from the selected model
    if (!selectedModel) return [];
    let products = [...selectedModel.products];

    if (sortOrder === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOrder === 'priceAsc') products.sort((a, b) => a.price - b.price);
    if (sortOrder === 'priceDesc') products.sort((a, b) => b.price - a.price);
    if (sortOrder === 'new') products.sort((a, b) => b.createdAt - a.createdAt);

    return products;
  }, [selectedSubcategory, searchQuery, sortOrder, allProducts]);

  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    image: '',
    price: '',
    sizes: '',
    description: ''
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModelId) return alert("Selecciona un modelo");
    addProduct(selectedModelId, {
      name: productForm.name,
      sku: productForm.sku,
      image: productForm.image,
      price: Number(productForm.price),
      sizes: productForm.sizes.split(',').map(s => s.trim()).filter(s => s),
      description: productForm.description,
      status: 'active'
    });
    setProductForm({ name: '', sku: '', image: '', price: '', sizes: '', description: '' });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[280px_280px_280px_1fr] gap-6">
      {/* Categories Column */}
      <div className="glass rounded-[48px] p-8 flex flex-col h-[calc(100vh-250px)] shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white text-black rounded-2xl shadow-xl shadow-white/10">
            <Tag size={20} />
          </div>
          <h3 className="font-black uppercase italic tracking-tighter text-lg">Categorías</h3>
        </div>
        
        {isStaff && (
          <form 
            onSubmit={(e) => { e.preventDefault(); if(newCatName) { addCategory(newCatName); setNewCatName(''); } }}
            className="flex gap-2 mb-8"
          >
            <input 
              type="text" 
              placeholder="CREAR..." 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/30"
            />
            <button className="p-4 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              <Plus size={20} />
            </button>
          </form>
        )}

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
          {data.categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                setSelectedSubcategoryId(cat.subcategories[0]?.id || null);
                setSelectedModelId(cat.subcategories[0]?.models[0]?.id || null);
              }}
              className={`group flex items-center justify-between p-5 rounded-[24px] cursor-pointer transition-all duration-500 border ${
                selectedCategoryId === cat.id 
                  ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] border-white ring-1 ring-white/20' 
                  : 'bg-white/5 border-transparent hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-xs font-black uppercase italic tracking-widest truncate flex-1">{cat.name}</span>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-1 rounded-lg font-black ${selectedCategoryId === cat.id ? 'bg-black/10 text-black' : 'bg-white/10 text-white/50'}`}>
                  {cat.subcategories.reduce((acc, s) => acc + (s.models?.reduce((mAcc, m) => mAcc + (m.products?.length || 0), 0) || 0), 0)}
                </span>
                {isAdmin && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('¿Eliminar categoría?')) deleteCategory(cat.id); }}
                    className={`p-1.5 rounded-lg transition-all ${selectedCategoryId === cat.id ? 'hover:bg-black/10 text-black/60 hover:text-black' : 'opacity-0 group-hover:opacity-100 text-white/40 hover:text-white hover:bg-white/10'}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subcategories Column */}
      <div className="glass rounded-[48px] p-8 flex flex-col h-[calc(100vh-250px)] shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white text-black rounded-2xl shadow-xl shadow-white/10">
            <Layers size={20} />
          </div>
          <h3 className="font-black uppercase italic tracking-tighter text-lg">Marcas / Sub-Líneas</h3>
        </div>

        {selectedCategory ? (
          <>
            {isStaff && (
              <form 
                onSubmit={(e) => { e.preventDefault(); if(newSubName) { addSubcategory(selectedCategory.id, newSubName); setNewSubName(''); } }}
                className="flex gap-2 mb-8"
              >
                <input 
                  type="text" 
                  placeholder="AÑADIR..." 
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="flex-1 px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/30"
                />
                <button className="p-4 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
                  <Plus size={20} />
                </button>
              </form>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
              {selectedCategory.subcategories.map((sub) => (
                <div 
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubcategoryId(sub.id);
                    setSelectedModelId(sub.models[0]?.id || null);
                  }}
                  className={`group flex items-center justify-between p-5 rounded-[24px] cursor-pointer transition-all duration-500 border ${
                    selectedSubcategoryId === sub.id 
                      ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] border-white ring-1 ring-white/20' 
                      : 'bg-white/5 border-transparent hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="text-xs font-black uppercase italic tracking-widest truncate flex-1">{sub.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-black ${selectedSubcategoryId === sub.id ? 'bg-black/10 text-black' : 'bg-white/10 text-white/50'}`}>
                      {sub.models.reduce((acc, m) => acc + m.products.length, 0)}
                    </span>
                    {isAdmin && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); if(confirm('¿Eliminar subcategoría?')) deleteSubcategory(selectedCategory.id, sub.id); }}
                        className={`p-1.5 rounded-lg transition-all ${selectedSubcategoryId === sub.id ? 'hover:bg-black/10 text-black/60 hover:text-black' : 'opacity-0 group-hover:opacity-100 text-white/40 hover:text-white hover:bg-white/10'}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {selectedCategory.subcategories.length === 0 && (
                <div className="text-center py-24 text-white/10 text-[10px] uppercase font-black italic tracking-widest">Sin Selección Virtual</div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/5 text-center px-8">
            <Box size={80} className="mb-6 opacity-40 rotate-12" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Elige la matriz superior</p>
          </div>
        )}
      </div>

      {/* Models Column */}
      <div className="glass rounded-[48px] p-8 flex flex-col h-[calc(100vh-250px)] shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white text-black rounded-2xl shadow-xl shadow-white/10">
            <MoreVertical size={20} />
          </div>
          <h3 className="font-black uppercase italic tracking-tighter text-lg">Modelos</h3>
        </div>

        {selectedSubcategory ? (
          <>
            {isStaff && (
              <form 
                onSubmit={(e) => { e.preventDefault(); if(newModelName) { addModel(selectedCategory!.id, selectedSubcategory.id, newModelName); setNewModelName(''); } }}
                className="flex gap-2 mb-8"
              >
                <input 
                  type="text" 
                  placeholder="CREAR..." 
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  className="flex-1 px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/30"
                />
                <button className="p-4 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
                  <Plus size={20} />
                </button>
              </form>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
              {selectedSubcategory.models.map((mod) => (
                <div 
                  key={mod.id}
                  onClick={() => setSelectedModelId(mod.id)}
                  className={`group flex items-center justify-between p-5 rounded-[24px] cursor-pointer transition-all duration-500 border ${
                    selectedModelId === mod.id 
                      ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] border-white ring-1 ring-white/20' 
                      : 'bg-white/5 border-transparent hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="text-xs font-black uppercase italic tracking-widest truncate flex-1">{mod.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-black ${selectedModelId === mod.id ? 'bg-black/10 text-black' : 'bg-white/10 text-white/50'}`}>
                      {mod.products.length}
                    </span>
                    {isAdmin && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); if(confirm('¿Eliminar modelo?')) deleteModel(selectedCategory!.id, selectedSubcategory.id, mod.id); }}
                        className={`p-1.5 rounded-lg transition-all ${selectedModelId === mod.id ? 'hover:bg-black/10 text-black/60 hover:text-black' : 'opacity-0 group-hover:opacity-100 text-white/40 hover:text-white hover:bg-white/10'}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {selectedSubcategory.models.length === 0 && (
                <div className="text-center py-24 text-white/10 text-[10px] uppercase font-black italic tracking-widest">Sin Modelos</div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/5 text-center px-8">
            <Box size={80} className="mb-6 opacity-40 rotate-12" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Elige la sub-línea</p>
          </div>
        )}
      </div>

      {/* Main Product Area */}
      <div className="space-y-12">
        {/* Product Add Form */}
        {isStaff && (
          <div className="glass rounded-[60px] p-12 shadow-3xl relative overflow-hidden bg-white/5 border-white/10 group">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-2xl bg-white text-black">
                <Plus size={24} />
              </div>
              <div>
                <h3 className="font-black text-2xl uppercase italic tracking-tighter">Crear Producto</h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Registro directo al catálogo maestro</p>
              </div>
            </div>
            
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <div className="md:col-span-3">
                <input 
                  type="text" 
                  placeholder="DENOMINACIÓN COMERCIAL" 
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-xs font-bold tracking-widest uppercase placeholder:text-white/30"
                />
              </div>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  placeholder="SKU REF" 
                  value={productForm.sku}
                  onChange={e => setProductForm({...productForm, sku: e.target.value})}
                  className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-xs font-mono font-bold tracking-widest uppercase placeholder:text-white/30"
                />
              </div>
              <div className="md:col-span-1">
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-black text-[10px] uppercase italic">S/</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0" 
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({...productForm, price: e.target.value})}
                    className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-xs font-black italic text-right"
                  />
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative group">
                    <input 
                      type="text" 
                      placeholder="URL SOURCE IMAGEN" 
                      value={productForm.image}
                      onChange={e => setProductForm({...productForm, image: e.target.value})}
                      className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-[10px] font-black tracking-widest italic uppercase placeholder:text-white/30"
                    />
                    {productForm.image && (
                      <div className="absolute top-16 left-0 z-50 p-2 bg-black/90 border border-white/10 rounded-2xl shadow-2xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-all scale-95 group-focus-within:scale-100">
                        <img 
                          src={productForm.image} 
                          alt="Previsualización" 
                          className="w-40 h-40 object-cover rounded-xl"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <p className="text-[8px] text-center mt-2 text-white/50 uppercase font-black">Vista Previa</p>
                      </div>
                    )}
                  </div>
                  <label className="flex items-center justify-center px-6 bg-white/5 border border-white/5 rounded-[24px] hover:bg-white/10 cursor-pointer transition-all group active:scale-95">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProductForm({...productForm, image: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Upload size={20} className="text-white/40 group-hover:text-white transition-colors" />
                  </label>
                </div>
              </div>
              <div className="md:col-span-1">
                <input 
                  type="text" 
                  placeholder="TALLAS (SEP. COMA)" 
                  value={productForm.sizes}
                  onChange={e => setProductForm({...productForm, sizes: e.target.value})}
                  className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-[10px] font-black tracking-widest italic uppercase placeholder:text-white/30"
                />
              </div>
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  className="w-full h-full py-5 bg-white text-black font-black rounded-[24px] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4 uppercase italic italic tracking-tighter"
                >
                  <Plus size={24} />
                  <span>Registrar</span>
                </button>
              </div>
              <div className="md:col-span-6">
                <textarea 
                  placeholder="ESPECIFICACIONES DEL PRODUCTO Y DETALLES TÉCNICOS..." 
                  value={productForm.description}
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-8 py-6 bg-white/5 border border-white/5 rounded-[32px] outline-none focus:bg-white/10 focus:border-white/20 transition-all min-h-[140px] resize-none text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed placeholder:text-white/5"
                />
              </div>
            </form>
          </div>
        )}

        {/* Product List Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/5 border border-white/10 rounded-[28px] shadow-lg">
              <Box size={28} className="text-white/60" />
            </div>
            <div>
              <h3 className="font-black text-2xl text-white uppercase italic tracking-tighter">
                Inventario <span className="text-white/40">/</span> {selectedModel?.name || '...'}
              </h3>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-1">{filteredProducts.length} Ítems Virtuales</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
              <select 
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as any)}
                className="pl-13 pr-8 py-4 bg-white/5 border border-white/10 rounded-[24px] text-[10px] font-black uppercase italic tracking-widest text-white/80 outline-none hover:bg-white/10 focus:border-white focus:text-white appearance-none cursor-pointer min-w-[240px] transition-all"
              >
                <option value="new">Orden Cronológico</option>
                <option value="name">Alfabético [A-Z]</option>
                <option value="priceAsc">Menor Valor</option>
                <option value="priceDesc">Mayor Valor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 pb-40">
          <AnimatePresence initial={false}>
            {filteredProducts.map((p: Product) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onEdit={() => setEditingProduct(p)}
                onDelete={() => {
                  if (confirm('¿Eliminar producto definitivamente?')) {
                    // If we are searching, we pass null to delete from any model it's in
                    deleteProduct(searchQuery ? null : selectedModelId, p.id);
                  }
                }}
                showControls={isStaff}
              />
            ))}
          </AnimatePresence>
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-40 glass rounded-[60px] flex flex-col items-center justify-center text-white/10 border-dashed border-white/5">
              <Search size={100} className="mb-10 opacity-5 rotate-12" />
              <p className="font-black uppercase italic tracking-[0.3em] text-lg">Cero Resultados</p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Ajusta los parámetros de visualización</p>
            </div>
          )}
        </div>
      </div>

      {editingProduct && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onSave={(data) => {
            updateProduct(selectedModelId!, editingProduct.id, data);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
