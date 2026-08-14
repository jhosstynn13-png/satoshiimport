const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

// 1. Add confirmDeleteId state
code = code.replace(
  `const [editingUserId, setEditingUserId] = useState<string | null>(null);`,
  `const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);`
);

// 2. Fix Suspend button (remove confirm)
code = code.replace(
  `                                      onClick={() => {
                                         if(confirm(user.status === 'suspended' ? '¿Reactivar cuenta de usuario?' : '¿Suspender temporalmente esta cuenta?')) {
                                           updateUser(user.id, { status: user.status === 'suspended' ? 'active' : 'suspended' });
                                         }
                                      }}`,
  `                                      onClick={() => {
                                         updateUser(user.id, { status: user.status === 'suspended' ? 'active' : 'suspended' });
                                      }}`
);

// 3. Fix Delete button (use state instead of confirm)
const targetDelete = `                                   <button 
                                      title="Eliminar Cuenta"
                                      className="p-3 bg-white/5 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                      onClick={() => {
                                         if(confirm('¿Revocar acceso permanentemente y eliminar registro?')) deleteUser(user.id);
                                      }}
                                   >
                                      <Trash2 size={16} />
                                   </button>`;

const replacementDelete = `                                   {confirmDeleteId === user.id ? (
                                     <button 
                                        title="Confirmar Eliminación"
                                        className="px-4 py-3 bg-red-600 text-white font-black uppercase tracking-widest text-[8px] rounded-xl transition-all animate-pulse"
                                        onClick={() => {
                                           deleteUser(user.id);
                                           setConfirmDeleteId(null);
                                        }}
                                     >
                                        CONFIRMAR
                                     </button>
                                   ) : (
                                     <button 
                                        title="Eliminar Cuenta"
                                        className="p-3 bg-white/5 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                        onClick={() => setConfirmDeleteId(user.id)}
                                     >
                                        <Trash2 size={16} />
                                     </button>
                                   )}`;

code = code.replace(targetDelete, replacementDelete);

fs.writeFileSync('src/components/Users.tsx', code);
