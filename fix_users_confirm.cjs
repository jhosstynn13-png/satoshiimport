const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

// Add state
code = code.replace(
  "const [isCreating, setIsCreating] = useState(false);",
  "const [isCreating, setIsCreating] = useState(false);\n  const [confirmActionId, setConfirmActionId] = useState<string | null>(null);\n  const [confirmActionType, setConfirmActionType] = useState<'suspend' | 'delete' | null>(null);"
);

const oldButtons = `                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                   <button 
                                      title={user.status === 'suspended' ? 'Activar Cuenta' : 'Suspender Cuenta'}
                                      className={\`p-3 rounded-xl transition-all \${user.status === 'suspended' ? 'bg-green-500/10 hover:bg-green-500 hover:text-black text-green-500' : 'bg-orange-500/10 hover:bg-orange-500 hover:text-black text-orange-500'}\`}
                                      onClick={() => {
                                         if(confirm(user.status === 'suspended' ? '¿Reactivar cuenta de usuario?' : '¿Suspender temporalmente esta cuenta?')) {
                                           updateUser(user.id, { status: user.status === 'suspended' ? 'active' : 'suspended' });
                                         }
                                      }}
                                   >
                                      <Power size={16} />
                                   </button>
                                   <button 
                                      title="Editar Usuario"
                                      className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all"
                                      onClick={() => {
                                         setEditingUser(user.id);
                                         setIsCreating(true);
                                         setFormData({
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
                                      <Edit2 size={16} />
                                   </button>
                                   <button 
                                      title="Eliminar Cuenta"
                                      className="p-3 bg-white/5 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                      onClick={() => {
                                         if(confirm('¿Revocar acceso permanentemente y eliminar registro?')) deleteUser(user.id);
                                      }}
                                   >
                                      <Trash2 size={16} />
                                   </button>
                                </div>`;

const newButtons = `                                <div className="flex items-center justify-end gap-3 transition-all duration-500">
                                   {confirmActionId === user.id ? (
                                     <div className="flex items-center gap-2">
                                       <button onClick={() => setConfirmActionId(null)} className="px-3 py-2 text-[10px] uppercase font-black bg-white/10 hover:bg-white/20 rounded-lg transition-all">Cancelar</button>
                                       <button onClick={() => {
                                          if (confirmActionType === 'delete') deleteUser(user.id);
                                          else updateUser(user.id, { status: user.status === 'suspended' ? 'active' : 'suspended' });
                                          setConfirmActionId(null);
                                       }} className={\`px-3 py-2 text-[10px] uppercase font-black text-white rounded-lg transition-all \${confirmActionType === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}\`}>
                                          Confirmar
                                       </button>
                                     </div>
                                   ) : (
                                     <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                       <button 
                                          title={user.status === 'suspended' ? 'Activar Cuenta' : 'Suspender Cuenta'}
                                          className={\`p-3 rounded-xl transition-all \${user.status === 'suspended' ? 'bg-green-500/10 hover:bg-green-500 hover:text-black text-green-500' : 'bg-orange-500/10 hover:bg-orange-500 hover:text-black text-orange-500'}\`}
                                          onClick={() => {
                                            setConfirmActionId(user.id);
                                            setConfirmActionType('suspend');
                                          }}
                                       >
                                          <Power size={16} />
                                       </button>
                                       <button 
                                          title="Editar Usuario"
                                          className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all"
                                          onClick={() => {
                                             setEditingUser(user.id);
                                             setIsCreating(true);
                                             setFormData({
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
                                          <Edit2 size={16} />
                                       </button>
                                       <button 
                                          title="Eliminar Cuenta"
                                          className="p-3 bg-white/5 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                          onClick={() => {
                                            setConfirmActionId(user.id);
                                            setConfirmActionType('delete');
                                          }}
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                     </div>
                                   )}
                                </div>`;

code = code.replace(oldButtons, newButtons);
fs.writeFileSync('src/components/Users.tsx', code);
