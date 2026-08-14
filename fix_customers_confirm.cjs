const fs = require('fs');
let code = fs.readFileSync('src/components/Customers.tsx', 'utf8');

// Add state
code = code.replace(
  "const [optimizationComplete, setOptimizationComplete] = useState(false);",
  "const [optimizationComplete, setOptimizationComplete] = useState(false);\n  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);"
);

// Replace handleDelete
const oldHandleDelete = `  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar a este cliente?")) {
      deleteCustomer(id);
      setSelectedCustomer(null);
    }
  };`;

const newHandleDelete = `  const handleDelete = (id: string) => {
    deleteCustomer(id);
    setSelectedCustomer(null);
    setConfirmDeleteId(null);
  };`;
code = code.replace(oldHandleDelete, newHandleDelete);

// Replace the button in the modal
const oldButton = `              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                <button 
                  onClick={() => handleDelete(selectedCustomer.id)}
                  className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} /> Eliminar Cliente
                </button>
              </div>`;

const newButton = `              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                {confirmDeleteId === selectedCustomer.id ? (
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase font-black tracking-widest text-white/60">¿Estás seguro?</span>
                    <button 
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedCustomer.id)}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all flex items-center gap-2"
                    >
                      Sí, Eliminar
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setConfirmDeleteId(selectedCustomer.id)}
                    className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Eliminar Cliente
                  </button>
                )}
              </div>`;

code = code.replace(oldButton, newButton);

fs.writeFileSync('src/components/Customers.tsx', code);
