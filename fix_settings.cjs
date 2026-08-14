const fs = require('fs');
let code = fs.readFileSync('src/components/StoreSettings.tsx', 'utf8');

const uploadField = `
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Logo de la Tienda</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
                  {editSettings.logo ? (
                    <img src={editSettings.logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Store className="text-white/20" size={24} />
                  )}
                </div>
                <label className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors">
                  Subir Nueva Imagen
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditSettings({...editSettings, logo: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </label>
                {editSettings.logo && (
                  <button 
                    onClick={() => setEditSettings({...editSettings, logo: ''})}
                    className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
`;

code = code.replace('<div className="space-y-6">', '<div className="space-y-6">' + uploadField);

fs.writeFileSync('src/components/StoreSettings.tsx', code);
