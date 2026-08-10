import { motion } from 'motion/react';
import { Users, Mail, Phone, ShoppingBag, Plus, Search, MoreVertical } from 'lucide-react';
import { Customer } from '../types';

export default function Customers({ catalog }: { catalog: any }) {
  const { data } = catalog;
  const customers = data.customers || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/5 border border-white/5 rounded-3xl">
            <Users size={28} className="text-white/60" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">CRM Local</h3>
            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">{customers.length} Clientes Activos</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-white text-black font-black uppercase italic tracking-tighter text-sm rounded-2xl shadow-xl shadow-white/5 hover:scale-105 transition-all">
          Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-[32px] p-2 flex items-center gap-2">
            <div className="pl-6 text-white/40">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Filtro de clientes por nombre, email o ID..."
              className="w-full bg-transparent border-none outline-none py-4 px-2 text-sm font-bold placeholder:text-white/30"
            />
          </div>

          <div className="glass rounded-[40px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase font-black tracking-[0.25em] text-white/40 border-b border-white/5">
                    <th className="px-8 py-6">Cliente</th>
                    <th className="px-8 py-6">Contacto</th>
                    <th className="px-8 py-6">Ventas</th>
                    <th className="px-8 py-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium text-sm">
                  {customers.length > 0 ? customers.map((customer: Customer) => (
                    <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                             <div className="font-bold">{customer.name}</div>
                            <div className="text-[10px] text-white/40 font-mono">#{customer.id.slice(-6).toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Mail size={12} /> {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Phone size={12} /> {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black italic leading-tight">S/ {customer.totalSpent.toFixed(2)}</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-widest">{customer.totalOrders} Pedidos</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 italic font-black text-[10px] uppercase tracking-widest">
                          Perfil
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-white/20 italic">
                        No hay clientes registrados en la base de datos local.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass rounded-[40px] p-8 border-white/5">
            <h4 className="font-black uppercase italic tracking-widest text-lg mb-6">Top Compradores</h4>
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="text-white/40 font-black text-2xl group-hover:text-white transition-colors">{i+1}</div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <Users size={20} className="text-white/40" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Cliente VIP {i+1}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-widest">Gasto Alto</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black italic text-sm">S/ 0.00</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[40px] p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-black uppercase italic tracking-widest text-xl mb-4 leading-tight">Segmentación IA</h4>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                El sistema categoriza automáticamente a tus clientes basándose en su frecuencia de compra y ticket promedio.
              </p>
              <div className="p-5 rounded-2xl bg-white text-black font-black uppercase italic tracking-widest text-[10px] text-center shadow-2xl shadow-white/10">
                Optimizar Perfiles
              </div>
            </div>
            <Users size={180} className="absolute -right-16 -bottom-16 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
}
