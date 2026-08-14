const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

const targetLayout = `<div className="space-y-12">
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
           </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2 flex flex-col h-full">`;

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
               AGREGAR USUARIO
            </button>
         </div>
         <Shield size={200} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 scale-150" />
      </div>

      {/* Users List */}
      <div>`;

code = code.replace(targetLayout, replacementLayout);

// Also need to remove the closing div for the grid layout at the bottom of the table
code = code.replace(
  `                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>

      {/* Form Modal */}`,
  `                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      {/* Form Modal */}`
);

fs.writeFileSync('src/components/Users.tsx', code);
