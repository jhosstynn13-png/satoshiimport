const fs = require('fs');
let code = fs.readFileSync('src/components/StoreSettings.tsx', 'utf8');

const target = `  const handleOpenModal = (id: string) => {
    if (id === 'security') {
      setShowSecurityModal(true);
    } else {
      setEditSettings(data.storeSettings || storeSettings);
      setActiveModal(id);
    }
  };`;

const replacement = `  const handleOpenModal = (id: string) => {
    setEditSettings(data.storeSettings || storeSettings);
    setActiveModal(id);
  };`;

code = code.replace(target, replacement);

const targetCase = `      case 'notifications':`;
const replacementCase = `      case 'security':
        return (
          <div className="space-y-6">
            <p className="text-xs text-white/40 mb-4">Gestione el acceso público y las credenciales de administrador.</p>
            
            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold">Acceso de Clientes</h4>
                <p className="text-[10px] text-white/40 mt-1">Permitir que los clientes inicien sesión y compren.</p>
              </div>
              <button 
                onClick={() => setEditSettings({
                  ...editSettings, 
                  clientLoginEnabled: editSettings.clientLoginEnabled !== false
                })}
                className={\`w-12 h-6 rounded-full transition-all relative \${editSettings.clientLoginEnabled !== false ? 'bg-green-500' : 'bg-white/10'}\`}
              >
                <div className={\`w-4 h-4 bg-white rounded-full absolute top-1 transition-all \${editSettings.clientLoginEnabled !== false ? 'left-7' : 'left-1'}\`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold text-red-400">Contraseña de Administrador</h4>
                <p className="text-[10px] text-white/40 mt-1">Modificar su contraseña maestra actual.</p>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setShowSecurityModal(true); }}
                className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs rounded-xl transition-colors"
              >
                Modificar
              </button>
            </div>
          </div>
        );
      case 'notifications':`;

code = code.replace(targetCase, replacementCase);
fs.writeFileSync('src/components/StoreSettings.tsx', code);
