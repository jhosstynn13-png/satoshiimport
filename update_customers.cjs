const fs = require('fs');

let code = `import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Mail, Phone, ShoppingBag, Search, Tag, X, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import { Customer, Order } from '../types';

export default function Customers({ catalog }: { catalog: any }) {
  const { data, updateCustomer, deleteCustomer } = catalog;
  const customers = data.customers || [];
  const orders = data.orders || [];
  
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  // Top Buyers
  const topBuyers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3);

  const filteredCustomers = customers.filter((c: Customer) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const simulateAI = () => {
    setIsOptimizing(true);
    setOptimizationComplete(false);
    
    setTimeout(() => {
      // Simulate assigning tags to customers
      customers.forEach((c: Customer) => {
        let tags: string[] = [];
        if (c.totalSpent > 5000) tags.push("VIP", "Gasto Alto");
        else if (c.totalSpent > 1000) tags.push("Recurrente");
        else tags.push("Cazador de Ofertas");
        
        if (c.totalOrders === 0) tags = ["Inactivo"];
        else if (c.totalOrders > 5) tags.push("Leal");

        updateCustomer(c.id, { tags });
      });
      setIsOptimizing(false);
      setOptimizationComplete(true);
      
      setTimeout(() => setOptimizationComplete(false), 3000);
    }, 2500);
  };

  const getCustomerOrders = (customerId: string) => {
    return orders.filter((o: Order) => o.customerId === customerId).sort((a: Order, b: Order) => b.createdAt - a.createdAt);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar a este cliente?")) {
      deleteCustomer(id);
      setSelectedCustomer(null);
    }
  };

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
              value={search}
              onChange={e => setSearch(e.target.value)}
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
                  {filteredCustomers.length > 0 ? filteredCustomers.map((customer: Customer) => (
                    <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs">
                            {customer.name.charAt(0)}
                          </div>
                          <div> 
                            <div className="font-bold flex items-center gap-2">
                              {customer.name}
                              {customer.tags && customer.tags.includes('VIP') && (
                                <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-[8px] uppercase tracking-widest font-black">VIP</span>
                              )}
                            </div>
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
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all italic font-black text-[10px] uppercase tracking-widest">
                          Perfil
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-white/20 italic">
                        No hay clientes registrados que coincidan con la búsqueda.
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
              {topBuyers.map((customer, i) => (
                <div key={customer.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                  <div className="text-white/40 font-black text-2xl group-hover:text-white transition-colors">{i+1}</div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <Users size={20} className="text-white/40" />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="font-bold text-sm truncate">{customer.name}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-widest">{customer.tags?.[0] || 'Cliente Frecuente'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black italic text-sm">S/ {customer.totalSpent.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {topBuyers.length === 0 && (
                <div className="text-white/30 text-xs text-center italic py-4">No hay compras registradas</div>
              )}
            </div>
          </div>

          <div className="glass rounded-[40px] p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-black uppercase italic tracking-widest text-xl mb-4 leading-tight">Segmentación IA</h4>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                El sistema categoriza automáticamente a tus clientes basándose en su frecuencia de compra y ticket promedio.
              </p>
              
              {optimizationComplete ? (
                <div className="p-5 rounded-2xl bg-green-500/20 text-green-400 font-black uppercase italic tracking-widest text-[10px] text-center shadow-2xl flex items-center justify-center gap-2 border border-green-500/30">
                  <CheckCircle2 size={16} /> ¡Perfiles Optimizados!
                </div>
              ) : (
                <button 
                  onClick={simulateAI}
                  disabled={isOptimizing}
                  className="w-full p-5 rounded-2xl bg-white hover:bg-gray-200 text-black font-black uppercase italic tracking-widest text-[10px] text-center shadow-2xl shadow-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isOptimizing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Sparkles size={16} />
                    </motion.div>
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {isOptimizing ? 'Analizando Patrones...' : 'Optimizar Perfiles'}
                </button>
              )}
            </div>
            <Users size={180} className="absolute -right-16 -bottom-16 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl font-black">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">{selectedCustomer.name}</h2>
                    <p className="text-white/40 text-xs font-mono tracking-widest uppercase mt-1">ID: #{selectedCustomer.id}</p>
                    {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {selectedCustomer.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/80">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-[24px] border border-white/5">
                    <div className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-2">Contacto</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-bold">
                        <Mail size={16} className="text-white/40" /> {selectedCustomer.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold">
                        <Phone size={16} className="text-white/40" /> {selectedCustomer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-[24px] border border-white/5">
                    <div className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-2">Estadísticas</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/60">Total Gastado</span>
                        <span className="text-lg font-black italic">S/ {selectedCustomer.totalSpent.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/60">Pedidos</span>
                        <span className="text-sm font-black">{selectedCustomer.totalOrders}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase italic tracking-widest mb-4">Historial de Pedidos</h3>
                  <div className="space-y-3">
                    {getCustomerOrders(selectedCustomer.id).length > 0 ? getCustomerOrders(selectedCustomer.id).map(order => (
                      <div key={order.id} className="p-5 bg-white/5 rounded-[20px] flex items-center justify-between border border-white/5">
                        <div>
                          <div className="text-[10px] font-mono text-white/40 mb-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm font-bold flex items-center gap-2">
                            Pedido #{order.id.slice(-6).toUpperCase()}
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[8px] uppercase tracking-widest font-black">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-xs text-white/60 mt-1">
                            {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black italic text-lg">S/ {order.total.toFixed(2)}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center bg-white/5 rounded-[20px] text-white/40 text-xs italic">
                        El cliente no tiene pedidos registrados.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                <button 
                  onClick={() => handleDelete(selectedCustomer.id)}
                  className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} /> Eliminar Cliente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

fs.writeFileSync('src/components/Customers.tsx', code);
