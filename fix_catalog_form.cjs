const fs = require('fs');

let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// 1. Add fields to initial state
code = code.replace(
  "    sizes: '',\n    description: ''\n  });",
  "    sizes: '',\n    description: '',\n    isFavorite: false,\n    featuredStyle: ''\n  });"
);

// 2. Add fields to submit
code = code.replace(
  "      sizes: productForm.sizes.split(',').map(s => s.trim()).filter(s => s),\n      description: productForm.description,\n      status: 'active'\n    });\n    setProductForm({ name: '', sku: '', image: '', price: '', sizes: '', description: '' });",
  "      sizes: productForm.sizes.split(',').map(s => s.trim()).filter(s => s),\n      description: productForm.description,\n      isFavorite: productForm.isFavorite,\n      featuredStyle: productForm.featuredStyle,\n      status: 'active'\n    });\n    setProductForm({ name: '', sku: '', image: '', price: '', sizes: '', description: '', isFavorite: false, featuredStyle: '' });"
);

// 3. Add UI fields after description (around line 709)
const newUI = `
              </div>
              
              {/* Tienda Publica Personalizacion */}
              <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
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
`;

code = code.replace(
  "              </div>\n              <div className=\"md:col-span-12 pt-4 border-t border-white/5\">",
  newUI + "\n              <div className=\"md:col-span-12 pt-4 border-t border-white/5\">"
);

fs.writeFileSync('src/components/Catalog.tsx', code);
