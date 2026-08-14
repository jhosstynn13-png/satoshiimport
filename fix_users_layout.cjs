const fs = require('fs');

let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

// Add showFormModal state
code = code.replace(
  `const [editingUserId, setEditingUserId] = useState<string | null>(null);`,
  `const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);`
);

// Modify handleAddUser to close modal on success
code = code.replace(
  `      setEditingUserId(null);
    } else {
      addUser({`,
  `      setEditingUserId(null);
      setShowFormModal(false);
    } else {
      addUser({`
);

code = code.replace(
  `    setForm({ 
      firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' 
    });
  };`,
  `    setForm({ 
      firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' 
    });
    setShowFormModal(false);
  };`
);

// Modify the layout part.
// Target the start of the return block
const startLayoutTarget = `<div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* User Stats/Summary */}
        <div className="lg:col-span-1 space-y-8">
           <div className="glass rounded-[48px] p-10 border-white/5 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-10 shadow-2xl shadow-white/10 group-hover:scale-110 transition-transform duration-700">
                  <Shield size={32} className="text-black" />
                </div>
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-4">Jerarquía Local</h3>
                <p className="text-sm text-white/60 leading-relaxed font-bold uppercase tracking-widest leading-loose">
                  Define los niveles de acceso para tu equipo y clientes distinguidos.
                </p>
                <div className="mt-10 grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Total Admin</div>
                      <div className="text-2xl font-black italic">{users.filter((u: any) => u.role === 'admin' || u.role === 'superadmin').length}</div>
                   </div>
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Clientes</div>
                      <div className="text-2xl font-black italic">{users.filter((u: any) => u.role === 'client').length}</div>
                   </div>
                </div>
              </div>
              <Shield size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 scale-150" />
           </div>`;

const endFormTarget = `           </div>
        </div>

        {/* Directory Table */}
        <div className="lg:col-span-2">`;


// Use regex to remove the form section between the Stats card and the Directory Table
const regexStr = startLayoutTarget.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&') + '.*?' + endFormTarget.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&');
const regex = new RegExp(regexStr, 's');

const replacementLayout = `<div className="space-y-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between glass rounded-[48px] p-8 border-white/5 relative overflow-hidden group">
         <div className="relative z-10 flex items-center gap-10">
            <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-2xl shadow-white/10 shrink-0 group-hover:scale-110 transition-transform duration-700">
               <Shield size={32} className="text-black" />
            </div>
            <div>
               <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">Jerarquía Local</h3>
               <p className="text-sm text-white/60 font-bold uppercase tracking-widest">
                  Define los niveles de acceso para tu equipo y clientes distinguidos.
               </p>
            </div>
         </div>
         
         <div className="relative z-10 flex items-center gap-6">
            <div className="flex items-center gap-4 mr-8">
               <div className="text-right">
                  <div className="text-2xl font-black italic text-white">{users.filter((u: any) => u.role === 'admin' || u.role === 'superadmin').length}</div>
                  <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Total Admin</div>
               </div>
               <div className="w-px h-10 bg-white/10 mx-2"></div>
               <div className="text-right">
                  <div className="text-2xl font-black italic text-white">{users.filter((u: any) => u.role === 'client').length}</div>
                  <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Clientes</div>
               </div>
            </div>
            
            <button 
               onClick={() => {
                  setEditingUserId(null);
                  setForm({ firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' });
                  setShowFormModal(true);
               }}
               className="px-8 py-5 rounded-[24px] bg-white text-black font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-white/10"
            >
               <UserPlus size={16} />
               Agregar Usuario
            </button>
         </div>
         <Shield size={200} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 scale-150" />
      </div>

      {/* Directory Table */}
      <div>`;

code = code.replace(regex, replacementLayout);


// Need to replace the end div of the previous grid layout
code = code.replace(
  `                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>

      {/* 2FA Verification Modal */}`,
  `                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      {/* 2FA Verification Modal */}`
);

// We need to inject the Form Modal exactly before 2FA Verification Modal
const formModalInject = `      {/* Form Modal */}
      <AnimatePresence>
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto custom-scrollbar">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-3xl"
            onClick={() => setShowFormModal(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl glass rounded-[48px] p-10 border-white/5 shadow-2xl z-10 my-auto"
          >
              <h4 className="font-black uppercase italic tracking-widest text-xl mb-8 flex items-center justify-center gap-3">
                 <UserPlus size={24} className="text-white" />
                 {editingUserId ? 'Editar Usuario' : 'Inscribir Master / Cliente'}
              </h4>
              <form onSubmit={handleAddUser} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                       type="text" 
                       placeholder="NOMBRE"
                       required
                       value={form.firstName}
                       onChange={e => setForm({...form, firstName: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                    <input 
                       type="text" 
                       placeholder="APELLIDO"
                       required
                       value={form.lastName}
                       onChange={e => setForm({...form, lastName: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                       type="text" 
                       placeholder="DNI"
                       required
                       value={form.dni}
                       onChange={e => setForm({...form, dni: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                    <input 
                       type="text" 
                       placeholder="CELULAR"
                       value={form.phone}
                       onChange={e => setForm({...form, phone: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                 </div>
                 <div>
                    <input 
                       type="email" 
                       placeholder="EMAIL CORPORATIVO / PERSONAL"
                       required
                       value={form.email}
                       onChange={e => setForm({...form, email: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                 </div>
                 <div>
                    <input 
                       type="password" 
                       placeholder={editingUserId ? "NUEVA CONTRASEÑA (DEJAR EN BLANCO PARA NO CAMBIAR)" : "CONTRASEÑA (DEFECTO: 123456)"}
                       value={form.password}
                       onChange={e => setForm({...form, password: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                 </div>
                 <div>
                    <select 
                       value={form.role}
                       onChange={e => setForm({...form, role: e.target.value as any})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] italic appearance-none cursor-pointer"
                    >
                       <option value="client" className="bg-black text-white">CLIENTE PREFERENTE</option>
                       {currentUser?.role === 'superadmin' && (
                         <option value="admin" className="bg-black text-white">ADMINISTRADOR TOTAL</option>
                       )}
                       {currentUser?.role === 'superadmin' && (
                         <option value="superadmin" className="bg-black text-white">SUPER ADMINISTRADOR</option>
                       )}
                       {currentUser?.role === 'admin' && form.role === 'admin' && (
                         <option value="admin" className="bg-black text-white">ADMINISTRADOR TOTAL</option>
                       )}
                    </select>
                 </div>
                 <button 
                    type="submit"
                    className="w-full py-6 mt-4 bg-white text-black font-black uppercase italic tracking-widest text-[10px] rounded-[24px] shadow-2xl shadow-white/10 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    {editingUserId ? 'Actualizar Usuario' : 'Finalizar Registro'}
                 </button>
                 <button 
                    type="button"
                    onClick={() => { setShowFormModal(false); setEditingUserId(null); setForm({ firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' }); }}
                    className="w-full py-4 mt-2 bg-white/5 text-white/60 font-black uppercase italic tracking-widest text-[10px] rounded-[24px] hover:bg-white/10 transition-all"
                 >
                    Cancelar
                 </button>
              </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* 2FA Verification Modal */}`;

code = code.replace(`{/* 2FA Verification Modal */}`, formModalInject);


// Fix edit button to show modal
code = code.replace(
  `                                         setForm({
                                            firstName: user.firstName || user.name.split(' ')[0] || '',
                                            lastName: user.lastName || user.name.split(' ').slice(1).join(' ') || '',
                                            email: user.email,
                                            dni: user.dni || '',
                                            phone: user.phone || '',
                                            password: '', // Don't populate password
                                            role: user.role
                                         });
                                      }}
                                   >
                                      <Edit2 size={16} />`,
  `                                         setForm({
                                            firstName: user.firstName || user.name.split(' ')[0] || '',
                                            lastName: user.lastName || user.name.split(' ').slice(1).join(' ') || '',
                                            email: user.email,
                                            dni: user.dni || '',
                                            phone: user.phone || '',
                                            password: '', // Don't populate password
                                            role: user.role
                                         });
                                         setShowFormModal(true);
                                      }}
                                   >
                                      <Edit2 size={16} />`
);


fs.writeFileSync('src/components/Users.tsx', code);
