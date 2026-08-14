const fs = require('fs');

let code = fs.readFileSync('src/components/ProductModal.tsx', 'utf8');

code = code.replace(
  "    description: product.description || ''\n  });",
  "    description: product.description || '',\n    isFavorite: product.isFavorite || false,\n    featuredStyle: product.featuredStyle || ''\n  });"
);

// We need to pass the new fields in onSave
code = code.replace(
  "      status: form.status\n    };",
  "      status: form.status,\n      isFavorite: form.isFavorite,\n      featuredStyle: form.featuredStyle\n    };"
);

// We need to add the UI elements. Let's find a good place. Probably before the buttons.
const newUI = `
          {/* Public Storefront Customization */}
          <div className="pt-4 mt-6 border-t border-white/5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Personalización de Tienda</h4>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.isFavorite}
                onChange={e => setForm({...form, isFavorite: e.target.checked})}
                className="w-4 h-4 rounded bg-black border-white/20 text-emerald-500 focus:ring-emerald-500/20"
              />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Destacar en "Nuestras Favoritas"</span>
            </label>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Destacar en "Encuentra tu Estilo"</label>
              <select
                value={form.featuredStyle}
                onChange={e => setForm({...form, featuredStyle: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
              >
                <option value="">Ninguno</option>
                <option value="OUTDOOR">Outdoor</option>
                <option value="RUNNING">Running</option>
                <option value="URBANO">Urbano</option>
                <option value="FÚTBOL">Fútbol</option>
                <option value="INDUSTRIAL">Industrial</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4 mt-4">`;

code = code.replace(
  "          <div className=\"flex gap-4 pt-4 mt-4\">",
  newUI
);

fs.writeFileSync('src/components/ProductModal.tsx', code);
