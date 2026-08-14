const fs = require('fs');
let code = fs.readFileSync('src/components/StoreSettings.tsx', 'utf8');

const target = `<div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold text-red-400">Contraseña de Administrador</h4>`;

const replacement = `<div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold">Acceso Público (Visitantes)</h4>
                <p className="text-[10px] text-white/40 mt-1">Permitir que el catálogo sea visible públicamente.</p>
              </div>
              <button 
                onClick={() => setEditSettings({
                  ...editSettings, 
                  publicAccessEnabled: editSettings.publicAccessEnabled === false
                })}
                className={\`w-12 h-6 rounded-full transition-all relative \${editSettings.publicAccessEnabled !== false ? 'bg-green-500' : 'bg-white/10'}\`}
              >
                <div className={\`w-4 h-4 bg-white rounded-full absolute top-1 transition-all \${editSettings.publicAccessEnabled !== false ? 'left-7' : 'left-1'}\`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold text-red-400">Contraseña de Administrador</h4>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/StoreSettings.tsx', code);
