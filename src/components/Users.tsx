import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, UserPlus, Mail, Trash2, Edit2, ShieldAlert, ShieldCheck, User, Power, Lock } from 'lucide-react';
import { UserRole, User as UserType } from '../types';
import { generateCode, sendVerificationCode } from '../services/emailService';

export default function Users({ catalog }: { catalog: any }) {
  const { data, addUser, updateUser, deleteUser, currentUser } = catalog;
  
  let visibleUsers = data.users || [];
  if (currentUser?.role === 'admin') {
    visibleUsers = visibleUsers.filter((u: UserType) => (u.role !== 'admin' && u.role !== 'superadmin') || u.id === currentUser.id);
  }
  const users = visibleUsers;

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    phone: '',
    password: '',
    role: 'client' as UserRole
  });
  
  // Security Modal States
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [targetVerifyEmail, setTargetVerifyEmail] = useState('');
  const [pendingUpdatePayload, setPendingUpdatePayload] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    
    if (editingUserId) {
      const updatePayload: Partial<UserType> = {
        firstName: form.firstName,
        lastName: form.lastName,
        name: `${form.firstName || form.email.split('@')[0]} ${form.lastName}`.trim().toUpperCase(),
        email: form.email,
        dni: form.dni,
        phone: form.phone,
        role: form.role
      };
      
      if (form.password) {
        updatePayload.password = form.password;
      }
      
      const originalUser = users.find(u => u.id === editingUserId);
      if (originalUser && originalUser.role === 'superadmin') {
        // Require 2FA if we are modifying an existing admin
        try {
          const code = generateCode();
          setSentCode(code);
          setTargetVerifyEmail(originalUser.email);
          setPendingUpdatePayload({ id: editingUserId, payload: updatePayload });
          
          await sendVerificationCode(originalUser.email, code);
          setShowVerification(true);
          return; // Stop and wait for verification
        } catch (err: any) {
          alert('Error al enviar el código de seguridad: ' + err.message);
          return;
        }
      }
      
      updateUser(editingUserId, updatePayload);
      setEditingUserId(null);
      setShowFormModal(false);
    } else {
      addUser({
        ...form,
        name: `${form.firstName || form.email.split('@')[0]} ${form.lastName}`.trim().toUpperCase(),
        password: form.password || '123456'
      });
    }
    
    setForm({ 
      firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' 
    });
    setShowFormModal(false);
  };

  const handleVerifyCode = () => {
    setVerifyError('');
    setIsVerifying(true);
    
    if (verificationCode.trim().toUpperCase() === sentCode.toUpperCase()) {
      if (pendingUpdatePayload) {
        updateUser(pendingUpdatePayload.id, pendingUpdatePayload.payload);
      }
      // Reset everything
      setEditingUserId(null);
      setForm({ firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' });
      setShowVerification(false);
      setVerificationCode('');
      setSentCode('');
      setPendingUpdatePayload(null);
      setTargetVerifyEmail('');
    } else {
      setVerifyError('Código de seguridad incorrecto.');
    }
    setIsVerifying(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'superadmin': return <span className="px-3 py-1 bg-purple-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><ShieldCheck size={10} /> Super Admin</span>;
      case 'admin': return <span className="px-3 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><ShieldCheck size={10} /> Admin</span>;
      case 'client': return <span className="px-3 py-1 bg-white/5 text-white/60 text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><User size={10} /> Cliente</span>;
      case 'guest': return <span className="px-3 py-1 bg-white/5 text-white/40 text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><User size={10} /> Invitado</span>;
      default: return null;
    }
  };

  return (
    <>
    <div className="space-y-8">
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
      <div>
           <div className="glass rounded-[60px] overflow-hidden border-white/5 shadow-3xl bg-white/[0.01] flex-1 flex flex-col">
              <div className="p-10 border-b border-white/5 bg-white/5 shrink-0">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">Directorio de Roles</h3>
              </div>
              <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="text-[10px] uppercase font-black tracking-[0.25em] text-white/40 border-b border-white/5">
                          <th className="px-10 py-8">Perfil / Identidad</th>
                          <th className="px-10 py-8">DNI</th>
                          <th className="px-10 py-8">Email / Contacto</th>
                          <th className="px-10 py-8">Permisos</th>
                          <th className="px-10 py-8 text-right">Manejo</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium text-sm">
                       {users.map((user: UserType) => (
                          <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-6">
                                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-xl italic text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all duration-500">
                                      {user.name.charAt(0)}
                                   </div>
                                   <div>
                                      <div className="font-black text-white group-hover:translate-x-2 transition-transform duration-500 uppercase tracking-tighter italic">{user.name}</div>
                                      <div className="text-[10px] text-white/60 font-mono mt-1 uppercase tracking-widest">UID-{user.id.slice(0, 8)}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="text-xs font-black text-white/80 group-hover:text-white transition-colors duration-500">{user.dni || '00000000'}</div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-3 text-white/60 group-hover:text-white transition-colors duration-500">
                                   <Mail size={14} className="opacity-20" />
                                   <span className="font-bold text-xs">{user.email}</span>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex flex-col gap-2">
                                   {getRoleBadge(user.role)}
                                   {user.status === 'suspended' && (
                                     <span className="px-3 py-1 bg-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 w-max">
                                       <ShieldAlert size={10} /> Suspendido
                                     </span>
                                   )}
                                </div>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                   <button 
                                      title={user.status === 'suspended' ? 'Activar Cuenta' : 'Suspender Cuenta'}
                                      className={`p-3 rounded-xl transition-all ${user.status === 'suspended' ? 'bg-green-500/10 hover:bg-green-500 hover:text-black text-green-500' : 'bg-orange-500/10 hover:bg-orange-500 hover:text-black text-orange-500'}`}
                                      onClick={() => {
                                         updateUser(user.id, { status: user.status === 'suspended' ? 'active' : 'suspended' });
                                      }}
                                   >
                                      <Power size={16} />
                                   </button>
                                   <button 
                                      title="Editar Usuario"
                                      className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all"
                                      onClick={() => {
                                         setEditingUserId(user.id);
                                         setForm({
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
                                      <Edit2 size={16} />
                                   </button>
                                   {confirmDeleteId === user.id ? (
                                     <>
                                       <div 
                                         className="fixed inset-0 z-40 cursor-default" 
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           setConfirmDeleteId(null);
                                         }}
                                       />
                                       <button 
                                          title="Confirmar Eliminación"
                                          className="relative z-50 px-4 py-3 bg-red-600 text-white font-black uppercase tracking-widest text-[8px] rounded-xl transition-all animate-pulse shadow-2xl shadow-red-500/50"
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             deleteUser(user.id);
                                             setConfirmDeleteId(null);
                                          }}
                                       >
                                          CONFIRMAR
                                       </button>
                                     </>
                                   ) : (
                                     <button 
                                        title="Eliminar Cuenta"
                                        className="p-3 bg-white/5 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                        onClick={() => setConfirmDeleteId(user.id)}
                                     >
                                        <Trash2 size={16} />
                                     </button>
                                   )}
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>

            {/* Form Modal */}
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
                       placeholder="NOMBRE (OPCIONAL)"
                       value={form.firstName}
                       onChange={e => setForm({...form, firstName: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                    <input 
                       type="text" 
                       placeholder="APELLIDO (OPCIONAL)"
                       value={form.lastName}
                       onChange={e => setForm({...form, lastName: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                       type="text" 
                       placeholder="DNI (OPCIONAL)"
                       value={form.dni}
                       onChange={e => setForm({...form, dni: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                    <input 
                       type="text" 
                       placeholder="CELULAR (OPCIONAL)"
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

      {/* 2FA Verification Modal */}
      <AnimatePresence>
      {showVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass rounded-[40px] p-10 border-white/10 shadow-2xl"
          >
            <div className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-widest text-white">Seguridad de Master</h3>
              <p className="text-xs text-white/50 leading-relaxed font-bold">
                Está intentando modificar los datos de un administrador. Se ha enviado un código de seguridad al correo original: <br/>
                <span className="text-white">{targetVerifyEmail}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text"
                  maxLength={6}
                  placeholder="CÓDIGO DE 6 DÍGITOS"
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pl-16 pr-6 outline-none focus:border-white/30 transition-all text-2xl font-black tracking-[0.5em] text-center text-white"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                />
              </div>

              {verifyError && (
                <p className="text-[10px] text-red-400 font-black uppercase tracking-widest text-center">{verifyError}</p>
              )}

              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] italic rounded-[28px] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isVerifying ? 'Verificando...' : 'Confirmar Cambios'}
                </button>
                <button 
                  onClick={() => {
                    setShowVerification(false);
                    setVerificationCode('');
                    setPendingUpdatePayload(null);
                    setTargetVerifyEmail('');
                  }}
                  className="w-full py-4 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
                >
                  Cancelar Edición
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </>
  );
}

