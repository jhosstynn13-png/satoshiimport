const fs = require('fs');
let code = fs.readFileSync('src/components/Backup.tsx', 'utf8');

code = code.replace(
  "const [successMsg, setSuccessMsg] = useState('');",
  "const [successMsg, setSuccessMsg] = useState('');\n  const [confirmClear, setConfirmClear] = useState(false);"
);

const oldButton = `          <button 
            onClick={() => { if(confirm('¿BORRAR TODO? Acción irreversible.')) clearAll(); }}
            className="px-12 py-6 bg-red-900/20 hover:bg-red-600 text-white font-black rounded-[28px] transition-all shadow-2xl active:scale-95 flex items-center gap-4 uppercase tracking-widest text-[10px] italic border border-red-600/20"
          >
            <Trash2 size={22} />
            Full Purge
          </button>`;

const newButton = `          <div className="flex flex-col items-end gap-3">
            {confirmClear ? (
              <div className="flex items-center gap-4 bg-red-950/40 p-4 rounded-[28px] border border-red-500/20">
                <span className="text-[10px] uppercase font-black tracking-widest text-red-400">¿Estás seguro? Es irreversible.</span>
                <button 
                  onClick={() => setConfirmClear(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 font-black uppercase tracking-widest text-[10px] rounded-[20px] transition-all text-white"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    clearAll();
                    setConfirmClear(false);
                  }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-[20px] transition-all"
                >
                  Sí, Borrar Todo
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmClear(true)}
                className="px-12 py-6 bg-red-900/20 hover:bg-red-600 text-white font-black rounded-[28px] transition-all shadow-2xl active:scale-95 flex items-center gap-4 uppercase tracking-widest text-[10px] italic border border-red-600/20"
              >
                <Trash2 size={22} />
                Full Purge
              </button>
            )}
          </div>`;

code = code.replace(oldButton, newButton);
fs.writeFileSync('src/components/Backup.tsx', code);
