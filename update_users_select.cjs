const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

const targetSelect = `                    <select 
                       value={form.role}
                       onChange={e => setForm({...form, role: e.target.value as UserRole})}
                       className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-[24px] outline-none focus:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] italic appearance-none cursor-pointer"
                    >
                       <option value="client" className="bg-black text-white">CLIENTE PREFERENTE</option>
                       <option value="admin" className="bg-black text-white">ADMINISTRADOR TOTAL</option>
                    </select>`;

const replacementSelect = `                    <select 
                       value={form.role}
                       onChange={e => setForm({...form, role: e.target.value as UserRole})}
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
                    </select>`;

code = code.replace(targetSelect, replacementSelect);
fs.writeFileSync('src/components/Users.tsx', code);
