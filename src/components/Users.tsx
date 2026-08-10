import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, UserPlus, Mail, Trash2, Edit2, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { UserRole, User as UserType } from '../types';

export default function Users({ catalog }: { catalog: any }) {
  const { data, addUser, updateUser, deleteUser } = catalog;
  const users = data.users || [];

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    phone: '',
    password: '',
    role: 'client' as UserRole
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.dni) return;
    
    addUser({
      ...form,
      name: `${form.firstName} ${form.lastName}`.toUpperCase(),
      password: form.password || '123456' // Default password if not provided
    });
    
    setForm({ 
      firstName: '', 
      lastName: '', 
      email: '', 
      dni: '',
      phone: '',
      password: '',
      role: 'client' 
    });
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin': return <span className="px-3 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><ShieldCheck size={10} /> Admin</span>;
      case 'client': return <span className="px-3 py-1 bg-white/5 text-white/60 text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><User size={10} /> Cliente</span>;
      case 'guest': return <span className="px-3 py-1 bg-white/5 text-white/40 text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><User size={10} /> Invitado</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-12">
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
                      <div className="text-2xl font-black italic">{users.filter((u: any) => u.role === 'admin').length}</div>
                   </div>
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Clientes</div>
                      <div className="text-2xl font-black italic">{users.filter((u: any) => u.role === 'client').length}</div>
                   </div>
                </div>
              </div>
              <Shield size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 scale-150" />
           </div>

           {/* Add User Form */}
           <div className="glass rounded-[48px] p-10 border-white/5">
              <h4 className="font-black uppercase italic tracking-widest text-lg mb-8 flex items-center gap-3">
                 <UserPlus size={20} className="text-white" />
                 Inscribir Master
              </h4>
              <form onSubmit={handleAddUser} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                       type="text" 
                       placeholder="NOMBRE"
                       required
                       value={form.firstName}
                       onChange={e => setForm({...form, firstName: e.target.value})}
                       className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                    />
                    <input 
                       type="text" 
                       placeholder="APELLIDO"
                       required
                       value={form.lastName}
                       onChange={e => setForm({...form, lastName: e.target.value})}
                       className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                       type="text" 
                       placeholder="DNI"
                       required
                       maxLength={8}
                       value={form.dni}
                       onChange={e => setForm({...form, dni: e.target.value.replace(/\D/g, '')})}
                       className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                    />
                    <input 
                       type="tel" 
                       placeholder="CELULAR"
                       value={form.phone}
                       onChange={e => setForm({...form, phone: e.target.value})}
                       className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                    />
                 </div>
                 <div>
                    <input 
                       type="email" 
                       placeholder="EMAIL CORPORATIVO"
                       required
                       value={form.email}
                       onChange={e => setForm({...form, email: e.target.value})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                    />
                 </div>
                 <div>
                    <select 
                       value={form.role}
                       onChange={e => setForm({...form, role: e.target.value as UserRole})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] italic appearance-none cursor-pointer"
                    >
                       <option value="client" className="bg-black text-white">CLIENTE PREFERENTE</option>
                       <option value="admin" className="bg-black text-white">ADMINISTRADOR TOTAL</option>
                    </select>
                 </div>
                 <button 
                    type="submit"
                    className="w-full py-6 bg-white text-black font-black uppercase italic tracking-widest text-[10px] rounded-[24px] shadow-2xl shadow-white/10 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    Finalizar Registro
                 </button>
              </form>
           </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
           <div className="glass rounded-[60px] overflow-hidden border-white/5 shadow-3xl bg-white/[0.01]">
              <div className="p-10 border-b border-white/5 bg-white/5">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">Directorio de Roles</h3>
              </div>
              <div className="overflow-x-auto">
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
                                </div>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                   <button 
                                      className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all"
                                      onClick={() => {
                                         const newRole = user.role === 'client' ? 'admin' : 'client';
                                         updateUser(user.id, { role: newRole as UserRole });
                                      }}
                                   >
                                      <Edit2 size={16} />
                                   </button>
                                   <button 
                                      className="p-3 bg-white/5 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                      onClick={() => {
                                         if(confirm('¿Revocar acceso permanentemente?')) deleteUser(user.id);
                                      }}
                                   >
                                      <Trash2 size={16} />
                                   </button>
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
    </div>
  );
}
