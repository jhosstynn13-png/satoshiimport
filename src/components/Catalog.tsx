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
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { Product } from '../types';

interface CatalogProps {
  catalog: ReturnType<typeof useCatalog>;
  searchQuery: string;
}

export default function Catalog({ catalog, searchQuery }: CatalogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const { 
    data, 
    selectedCategoryId, 
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
    selectedModelId,
    setSelectedModelId,
    selectedSubmodelId,
    setSelectedSubmodelId,
    selectedCategory,
    selectedSubcategory,
    selectedModel,
    selectedSubmodel,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    addModel,
    deleteModel,
    addSubmodel,
    deleteSubmodel,
    addProduct,
    addProductsBulk,
    updateProduct,
    deleteProduct,
    allProducts,
    currentUser
  } = catalog;

  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const [newCatName, setNewCatName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newSubmodelName, setNewSubmodelName] = useState('');
  const [sortOrder, setSortOrder] = useState<'new' | 'name' | 'priceAsc' | 'priceDesc'>('new');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

    // Filter by the selected hierarchy level
    let products = allProducts;
    if (selectedCategoryId) {
      products = products.filter(p => p.category === selectedCategory?.name);
    }
    if (selectedSubcategoryId) {
      products = products.filter(p => p.subcategory === selectedSubcategory?.name);
    }
    if (selectedModelId) {
      products = products.filter(p => p.model === selectedModel?.name);
    }
    if (selectedSubmodelId) {
      products = products.filter(p => p.submodel === selectedSubmodel?.name);
    }

    if (sortOrder === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOrder === 'priceAsc') products.sort((a, b) => a.price - b.price);
    if (sortOrder === 'priceDesc') products.sort((a, b) => b.price - a.price);
    if (sortOrder === 'new') products.sort((a, b) => b.createdAt - a.createdAt);

    return products;
  }, [selectedCategoryId, selectedSubcategoryId, selectedModelId, selectedSubmodelId, selectedCategory, selectedSubcategory, selectedModel, selectedSubmodel, searchQuery, sortOrder, allProducts]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    image: '',
    price: '',
    sizes: '',
    description: '',
    isFavorite: false,
    featuredStyle: ''
  });

  // Helper para comprimir imágenes en el navegador antes de subirlas
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Resolución optimizada para catálogo
          let scaleSize = 1;
          if (img.width > MAX_WIDTH) {
            scaleSize = MAX_WIDTH / img.width;
          }
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convertir a formato WebP ligero con 80% de calidad
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Fallo al comprimir imagen'));
          }, 'image/webp', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!selectedSubmodelId) return alert("Selecciona un sub-modelo primero");

    const fileArray = Array.from(files);
    
    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    const BATCH_SIZE = 5;
    try {
      for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
        const batch = fileArray.slice(i, i + BATCH_SIZE);
        
        const newProductsData: any[] = [];
        const uploadPromises = batch.map(async (file: File) => {
          try {
            const compressedBlob = await compressImage(file);
            
            const reader = new FileReader();
            const downloadUrl = await new Promise<string>((resolve, reject) => {
               reader.onloadend = () => resolve(reader.result as string);
               reader.onerror = reject;
               reader.readAsDataURL(compressedBlob);
            });
            
            const safeName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_\s]/g, '');
            
            newProductsData.push({
              name: safeName,
              sku: '',
              image: downloadUrl,
              price: 0,
              sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
              description: '',
              status: 'active'
            });
          } catch (error) {
            console.error("Error al procesar archivo:", file.name, error);
          }
        });
        await Promise.all(uploadPromises);
        
        if (newProductsData.length > 0) {
          addProductsBulk(selectedSubmodelId, newProductsData);
        }
        
        setUploadProgress(prev => ({ ...prev, current: Math.min(prev.current + BATCH_SIZE, fileArray.length) }));
        
        if (i + BATCH_SIZE < fileArray.length) {
          await new Promise(resolve => setTimeout(resolve, 50)); 
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmodelId) return alert("Selecciona un sub-modelo");
    addProduct(selectedSubmodelId, {
      name: productForm.name,
      sku: productForm.sku,
      image: productForm.image,
      price: Number(productForm.price),
      sizes: productForm.sizes.split(',').map(s => s.trim()).filter(s => s),
      description: productForm.description,
      isFavorite: productForm.isFavorite,
      featuredStyle: productForm.featuredStyle,
      status: 'active'
    });
    setProductForm({ name: '', sku: '', image: '', price: '', sizes: '', description: '', isFavorite: false, featuredStyle: '' });
  };

  return (
    <div className="flex overflow-x-auto gap-4 custom-scrollbar pb-6 w-full items-stretch h-full">
      {/* Categories Column */}
      <div className="glass rounded-[40px] p-5 flex flex-col h-full shadow-2xl relative overflow-hidden group min-w-[220px] w-[220px] flex-shrink-0">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white text-black rounded-2xl shadow-xl shadow-white/10">
            <Tag size={20} />
          </div>
          <h3 className="font-black uppercase italic tracking-tighter text-lg">Categorías</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 mb-4">
          {data.categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => {
                if (selectedCategoryId === cat.id) {
                  setSelectedCategoryId(null);
                  setSelectedSubcategoryId(null);
                  setSelectedModelId(null);
                  setSelectedSubmodelId(null);
                } else {
                  setSelectedCategoryId(cat.id);
                  setSelectedSubcategoryId(null);
                  setSelectedModelId(null);
                  setSelectedSubmodelId(null);
                }
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
                  {cat.subcategories.reduce((acc, s) => acc + (s.models?.reduce((mAcc, m) => mAcc + (m.submodels?.reduce((smAcc, sm) => smAcc + (sm.products?.length || 0), 0) || 0), 0) || 0), 0)}
                </span>
                {isAdmin && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (e.currentTarget.dataset.confirm === 'true') {
                        deleteCategory(cat.id);
                      } else {
                        e.currentTarget.dataset.confirm = 'true';
                        e.currentTarget.classList.add('bg-red-500', 'text-white');
                        const btn = e.currentTarget;
                        setTimeout(() => {
                          btn.dataset.confirm = 'false';
                          btn.classList.remove('bg-red-500', 'text-white');
                        }, 3000);
                      }
                    }}
                    className={`p-1.5 rounded-lg transition-all ${selectedCategoryId === cat.id ? 'hover:bg-black/10 text-black/60 hover:text-black' : 'opacity-0 group-hover:opacity-100 text-white/40 hover:text-white hover:bg-white/10'}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {isStaff && (
          <form 
            onSubmit={(e) => { e.preventDefault(); if(newCatName) { addCategory(newCatName); setNewCatName(''); } }}
            className="flex flex-col gap-2"
          >
            <input 
              type="text" 
              placeholder="NUEVA CATEGORÍA" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/30"
            />
            <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Plus size={16} /> Agregar
            </button>
          </form>
        )}
      </div>

      {/* Subcategories Column */}
      <div className="glass rounded-[40px] p-5 flex flex-col h-full shadow-2xl relative overflow-hidden group min-w-[220px] w-[220px] flex-shrink-0">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white text-black rounded-2xl shadow-xl shadow-white/10">
            <Layers size={20} />
          </div>
          <h3 className="font-black uppercase italic tracking-tighter text-lg">Marcas / Sub-Líneas</h3>
        </div>

        {selectedCategory ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 mb-4">
              {selectedCategory.subcategories.map((sub) => (
                <div 
                  key={sub.id}
                  onClick={() => {
                    if (selectedSubcategoryId === sub.id) {
                      setSelectedSubcategoryId(null);
                      setSelectedModelId(null);
                      setSelectedSubmodelId(null);
                    } else {
                      setSelectedSubcategoryId(sub.id);
                      setSelectedModelId(null);
                      setSelectedSubmodelId(null);
                    }
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
                      {sub.models.reduce((acc, m) => acc + (m.submodels?.reduce((smAcc, sm) => smAcc + (sm.products?.length || 0), 0) || 0), 0)}
                    </span>
                    {isAdmin && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (e.currentTarget.dataset.confirm === 'true') {
                            deleteSubcategory(selectedCategory.id, sub.id);
                          } else {
                            e.currentTarget.dataset.confirm = 'true';
                            e.currentTarget.classList.add('bg-red-500', 'text-white');
                            const btn = e.currentTarget;
                            setTimeout(() => {
                              btn.dataset.confirm = 'false';
                              btn.classList.remove('bg-red-500', 'text-white');
                            }, 3000);
                          }
                        }}
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

            {isStaff && (
              <form 
                onSubmit={(e) => { e.preventDefault(); if(newSubName) { addSubcategory(selectedCategory.id, newSubName); setNewSubName(''); } }}
                className="flex flex-col gap-2"
              >
                <input 
                  type="text" 
                  placeholder="NUEVA MARCA/LÍNEA" 
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/30"
                />
                <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Plus size={16} /> Agregar
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/5 text-center px-8">
            <Box size={80} className="mb-6 opacity-40 rotate-12" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Elige la matriz superior</p>
          </div>
        )}
      </div>

      {/* Models Column */}
      <div className="glass rounded-[40px] p-5 flex flex-col h-full shadow-2xl relative overflow-hidden group min-w-[220px] w-[220px] flex-shrink-0">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white text-black rounded-2xl shadow-xl shadow-white/10">
            <MoreVertical size={20} />
          </div>
          <h3 className="font-black uppercase italic tracking-tighter text-lg">Modelos</h3>
        </div>

        {selectedSubcategory ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 mb-4">
              {selectedSubcategory.models.map((mod) => (
                <div 
                  key={mod.id}
                  onClick={() => {
                    if (selectedModelId === mod.id) {
                      setSelectedModelId(null);
                      setSelectedSubmodelId(null);
                    } else {
                      setSelectedModelId(mod.id);
                      setSelectedSubmodelId(null);
                    }
                  }}
                  className={`group flex items-center justify-between p-5 rounded-[24px] cursor-pointer transition-all duration-500 border ${
                    selectedModelId === mod.id 
                      ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] border-white ring-1 ring-white/20' 
                      : 'bg-white/5 border-transparent hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="text-xs font-black uppercase italic tracking-widest truncate flex-1">{mod.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-black ${selectedModelId === mod.id ? 'bg-black/10 text-black' : 'bg-white/10 text-white/50'}`}>
                      {mod.submodels?.reduce((smAcc, sm) => smAcc + (sm.products?.length || 0), 0) || 0}
                    </span>
                    {isAdmin && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (e.currentTarget.dataset.confirm === 'true') {
                            deleteModel(selectedCategory!.id, selectedSubcategory.id, mod.id);
                          } else {
                            e.currentTarget.dataset.confirm = 'true';
                            e.currentTarget.classList.add('bg-red-500', 'text-white');
                            const btn = e.currentTarget;
                            setTimeout(() => {
                              btn.dataset.confirm = 'false';
                              btn.classList.remove('bg-red-500', 'text-white');
                            }, 3000);
                          }
                        }}
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

            {isStaff && (
              <form 
                onSubmit={(e) => { e.preventDefault(); if(newModelName) { addModel(selectedCategory!.id, selectedSubcategory.id, newModelName); setNewModelName(''); } }}
                className="flex flex-col gap-2"
              >
                <input 
                  type="text" 
                  placeholder="NUEVO MODELO" 
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/30"
                />
                <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Plus size={16} /> Agregar
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/5 text-center px-8">
            <Box size={80} className="mb-6 opacity-40 rotate-12" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Elige la sub-línea</p>
          </div>
        )}
      </div>

      {/* Submodels Column */}
      <div className="glass rounded-[40px] p-5 flex flex-col h-full shadow-2xl relative overflow-hidden group min-w-[220px] w-[220px] flex-shrink-0">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white text-black rounded-2xl shadow-xl shadow-white/10">
            <MoreVertical size={20} />
          </div>
          <h3 className="font-black uppercase italic tracking-tighter text-lg">Sub-Modelos</h3>
        </div>

        {selectedModel ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 mb-4">
              {selectedModel.submodels?.map((smod) => (
                <div 
                  key={smod.id}
                  onClick={() => {
                    if (selectedSubmodelId === smod.id) {
                      setSelectedSubmodelId(null);
                    } else {
                      setSelectedSubmodelId(smod.id);
                    }
                  }}
                  className={`group flex items-center justify-between p-5 rounded-[24px] cursor-pointer transition-all duration-500 border ${
                    selectedSubmodelId === smod.id 
                      ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] border-white ring-1 ring-white/20' 
                      : 'bg-white/5 border-transparent hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="text-xs font-black uppercase italic tracking-widest truncate flex-1">{smod.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-black ${selectedSubmodelId === smod.id ? 'bg-black/10 text-black' : 'bg-white/10 text-white/50'}`}>
                      {smod.products?.length || 0}
                    </span>
                    {isAdmin && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (e.currentTarget.dataset.confirm === 'true') {
                            deleteSubmodel(selectedCategory!.id, selectedSubcategory!.id, selectedModel.id, smod.id);
                          } else {
                            e.currentTarget.dataset.confirm = 'true';
                            e.currentTarget.classList.add('bg-red-500', 'text-white');
                            const btn = e.currentTarget;
                            setTimeout(() => {
                              btn.dataset.confirm = 'false';
                              btn.classList.remove('bg-red-500', 'text-white');
                            }, 3000);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-all ${selectedSubmodelId === smod.id ? 'hover:bg-black/10 text-black/60 hover:text-black' : 'opacity-0 group-hover:opacity-100 text-white/40 hover:text-white hover:bg-white/10'}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(!selectedModel.submodels || selectedModel.submodels.length === 0) && (
                <div className="text-center py-24 text-white/10 text-[10px] uppercase font-black italic tracking-widest">Sin Sub-Modelos</div>
              )}
            </div>

            {isStaff && (
              <form 
                onSubmit={(e) => { e.preventDefault(); if(newSubmodelName) { addSubmodel(selectedCategory!.id, selectedSubcategory!.id, selectedModel.id, newSubmodelName); setNewSubmodelName(''); } }}
                className="flex flex-col gap-2"
              >
                <input 
                  type="text" 
                  placeholder="NUEVO SUB-MODELO" 
                  value={newSubmodelName}
                  onChange={(e) => setNewSubmodelName(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/30"
                />
                <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Plus size={16} /> Agregar
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/5 text-center px-8">
            <Box size={80} className="mb-6 opacity-40 rotate-12" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Elige el modelo</p>
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
            
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="col-span-1 md:col-span-12">
                <input 
                  type="text" 
                  placeholder="DENOMINACIÓN COMERCIAL" 
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-xs font-bold tracking-widest uppercase placeholder:text-white/30"
                />
              </div>
              <div className="col-span-1 md:col-span-6">
                <input 
                  type="text" 
                  placeholder="SKU REF" 
                  value={productForm.sku}
                  onChange={e => setProductForm({...productForm, sku: e.target.value})}
                  className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-xs font-mono font-bold tracking-widest uppercase placeholder:text-white/30"
                />
              </div>
              <div className="col-span-1 md:col-span-6">
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-black text-[10px] uppercase italic">S/</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0" 
                    value={productForm.price}
                    onChange={e => setProductForm({...productForm, price: e.target.value})}
                    className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-xs font-black italic text-right"
                  />
                </div>
              </div>
              <div className="md:col-span-12">
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
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressedBlob = await compressImage(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProductForm({...productForm, image: reader.result as string});
                            };
                            reader.readAsDataURL(compressedBlob);
                          } catch(err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                    <Upload size={20} className="text-white/40 group-hover:text-white transition-colors" />
                  </label>
                </div>
              </div>
              <div className="md:col-span-6 relative">
                <input 
                  type="text" 
                  placeholder="TALLAS (SEP. COMA)" 
                  value={productForm.sizes}
                  onChange={e => setProductForm({...productForm, sizes: e.target.value})}
                  className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 focus:border-white/20 transition-all text-[10px] font-black tracking-widest italic uppercase placeholder:text-white/30"
                />
                <button 
                  type="button"
                  title="Agregar Todas"
                  onClick={() => setProductForm({...productForm, sizes: '36, 37, 38, 39, 40, 41, 42, 43, 44'})}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/20 rounded-xl transition-all text-[8px] font-black uppercase text-white/60 hover:text-white tracking-widest"
                >
                  + Todas
                </button>
              </div>
              <div className="col-span-1 md:col-span-12">
                <button 
                  type="submit"
                  className="w-full h-full py-5 bg-white text-black font-black rounded-[24px] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4 uppercase italic tracking-tighter"
                >
                  <Plus size={24} />
                  <span>Registrar</span>
                </button>
              </div>
              <div className="md:col-span-12">
                <textarea 
                  placeholder="ESPECIFICACIONES DEL PRODUCTO Y DETALLES TÉCNICOS..." 
                  value={productForm.description}
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-8 py-6 bg-white/5 border border-white/5 rounded-[32px] outline-none focus:bg-white/10 focus:border-white/20 transition-all min-h-[140px] resize-none text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed placeholder:text-white/5"
                />

              </div>
              
              {/* Tienda Publica Personalizacion */}
              <div className="col-span-1 md:col-span-12 grid grid-cols-1 gap-4 pt-6 border-t border-white/5">
                <label className="flex items-center gap-4 cursor-pointer bg-white/5 px-6 py-5 rounded-[24px] border border-white/5 hover:bg-white/10 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={productForm.isFavorite}
                    onChange={e => setProductForm({...productForm, isFavorite: e.target.checked})}
                    className="w-5 h-5 rounded bg-black border-white/20 text-emerald-500 focus:ring-emerald-500/20"
                  />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Destacar en "Nuestras Favoritas"</span>
                </label>

                <div className="relative">
                  <select
                    value={productForm.featuredStyle}
                    onChange={e => setProductForm({...productForm, featuredStyle: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-[24px] px-6 py-5 text-white text-[10px] font-black uppercase tracking-[0.25em] focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all appearance-none"
                  >
                    <option value="" className="bg-black">Sin estilo destacado</option>
                    <option value="OUTDOOR" className="bg-black">Outdoor</option>
                    <option value="RUNNING" className="bg-black">Running</option>
                    <option value="URBANO" className="bg-black">Urbano</option>
                    <option value="FÚTBOL" className="bg-black">Fútbol</option>
                    <option value="INDUSTRIAL" className="bg-black">Industrial</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-[10px] uppercase font-black tracking-widest">
                    Estilo ▾
                  </div>
                </div>
              </div>

              <div className="md:col-span-12 pt-4 border-t border-white/5">
                <label className="w-full py-6 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-[32px] cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group active:scale-[0.98]">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleBulkUpload}
                    disabled={isUploading}
                  />
                  <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                    <Upload size={24} className="text-white/80 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-center">
                    {isUploading ? (
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Subiendo... {uploadProgress.current} de {uploadProgress.total}</p>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-black uppercase tracking-widest text-white">Carga Masiva de Imágenes</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mt-1">Sube hasta 10,000 fotos (Optimizado en la nube)</p>
                      </>
                    )}
                  </div>
                </label>
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
                Inventario <span className="text-white/40">/</span> {selectedSubmodel?.name || '...'}
              </h3>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-1">{filteredProducts.length} Ítems Virtuales</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
              <select 
                value={sortOrder}
                onChange={e => { setSortOrder(e.target.value as any); setCurrentPage(1); }}
                className="pl-13 pr-8 py-4 bg-white/5 border border-white/10 rounded-[24px] text-[10px] font-black uppercase italic tracking-widest text-white/80 outline-none hover:bg-white/10 focus:border-white focus:text-white appearance-none cursor-pointer min-w-[240px] transition-all"
              >
                <option value="new" className="bg-zinc-900 text-white">Orden Cronológico</option>
                <option value="name" className="bg-zinc-900 text-white">Alfabético [A-Z]</option>
                <option value="priceAsc" className="bg-zinc-900 text-white">Menor Valor</option>
                <option value="priceDesc" className="bg-zinc-900 text-white">Mayor Valor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 pb-40">
          <AnimatePresence initial={false}>
            {filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((p: Product, i: number) => (
              <ProductCard 
                key={`${p.id}-${i}`} 
                product={p} 
                onEdit={() => setEditingProduct(p)}
                onDelete={() => {
                  setProductToDelete(p);
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
            updateProduct((editingProduct as any).submodelId || selectedSubmodelId!, editingProduct.id, data);
            setEditingProduct(null);
          }}
        />
      )}

      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass p-8 rounded-[40px] border border-white/10 flex flex-col items-center text-center gap-6"
          >
            <div className="w-20 h-20 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center border border-red-500/30">
              <Trash2 size={32} />
            </div>
            
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
                ¿Eliminar Producto?
              </h3>
              <p className="text-white/60 text-sm font-medium">
                Estás a punto de eliminar <span className="text-white font-black">"{productToDelete.name}"</span>. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteProduct(searchQuery ? null : selectedSubmodelId, productToDelete.id);
                  setProductToDelete(null);
                }}
                className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-red-900/20"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
