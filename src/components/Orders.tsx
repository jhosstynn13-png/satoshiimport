import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, Clock, CheckCircle, XCircle, Eye, Truck, RotateCcw, ChevronDown, TrendingUp, Package, User, Hash, Calendar, DollarSign, Filter, Box, ShieldCheck, CreditCard, Receipt, FileText, ClipboardList } from 'lucide-react';
import { Order, OrderStatus, PaymentMethod, BillingType } from '../types';

export default function Orders({ catalog, searchQuery = '' }: { catalog: any, searchQuery?: string }) {
  const { data, updateOrder, deleteOrder, currentUser } = catalog;
  const orders = data.orders || [];
  const isAdmin = currentUser?.role === 'admin';
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [confirmDeleteOrderId, setConfirmDeleteOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const toggleOrder = (orderId: string) => {
    const newSet = new Set(expandedOrders);
    if (newSet.has(orderId)) newSet.delete(orderId);
    else newSet.add(orderId);
    setExpandedOrders(newSet);
  };

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return { label: 'Entregado', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle };
      case 'pending': return { label: 'Pendiente', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Clock };
      case 'picking': return { label: 'Picking (Almacén)', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: ClipboardList };
      case 'packing': return { label: 'Embalaje', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: Box };
      case 'shipped': return { label: 'En Tránsito', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Truck };
      case 'cancelled': return { label: 'Cancelado', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', icon: XCircle };
      case 'returned': return { label: 'Devuelto', color: 'bg-violet-500/10 text-violet-500 border-violet-500/20', icon: RotateCcw };
      default: return { label: status, color: 'bg-white/5 text-white/40 border-white/10', icon: ShoppingCart };
    }
  };

  const getPaymentIcon = (method?: PaymentMethod) => {
    switch (method) {
      case 'transfer': return <ShieldCheck size={14} className="text-blue-400" />;
      case 'card': return <CreditCard size={14} className="text-purple-400" />;
      case 'cash': return <DollarSign size={14} className="text-emerald-400" />;
      default: return <Hash size={14} className="text-white/40" />;
    }
  };

  const statusList: OrderStatus[] = ['pending', 'picking', 'packing', 'shipped', 'delivered', 'cancelled', 'returned'];

  const filteredOrders = orders
    .filter((o: Order) => statusFilter === 'all' || o.status === statusFilter)
    .filter((o: Order) => {
      if (!searchQuery) return true;
      const term = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        (o.shippingDetails?.tel && o.shippingDetails.tel.includes(term))
      );
    })
    .sort((a: Order, b: Order) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-12 flex flex-col h-full">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pipeline Total', value: orders.length, icon: Package, color: 'text-white' },
          { label: 'Logística Activa', value: orders.filter((o: any) => o.status === 'shipped').length, icon: Truck, color: 'text-blue-500' },
          { label: 'Exitosos', value: orders.filter((o: any) => o.status === 'delivered').length, icon: CheckCircle, color: 'text-emerald-500' },
          { label: 'Volumen S/ ', value: `${orders.reduce((acc: number, o: any) => acc + o.total, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-white' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[40px] flex flex-col gap-6 group hover:bg-white/[0.04] transition-all"
          >
            <div className={`p-4 bg-white/5 w-fit rounded-2xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table Interface */}
      <div className="glass rounded-[60px] overflow-hidden border-white/5 shadow-3xl flex-1 flex flex-col">
        <div className="p-10 border-b border-white/5 bg-white/5 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Gestión de Logística</h3>
              <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mt-1">Control de despacho y estados en tiempo real</p>
           </div>
           
           <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-2xl border border-white/5">
                <Filter size={14} className="ml-3 text-white/40" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none pr-8 cursor-pointer text-white/80"
                >
                  <option value="all" className="bg-black text-white">Todos los Filtros</option>
                  {statusList.map(s => (
                    <option key={s} value={s} className="bg-black text-white">{getStatusConfig(s).label}</option>
                  ))}
                </select>
              </div>
              <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 italic">
                 {filteredOrders.length} Resultados
              </div>
           </div>
        </div>
        
        <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 border-b border-white/5">
                <th className="px-10 py-8">Orden / Registro</th>
                <th className="px-10 py-8">Destinatario</th>
                <th className="px-10 py-8">Protocolo Logístico</th>
                <th className="px-10 py-8">Inversión</th>
                <th className="px-10 py-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredOrders.length > 0 ? filteredOrders.map((order: Order) => {
                const config = getStatusConfig(order.status);
                const isExpanded = expandedOrders.has(order.id);
                
                return (
                <React.Fragment key={order.id}>
                  <tr className={`transition-all duration-300 group ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl text-white/20 group-hover:text-white transition-colors">
                          <Hash size={14} />
                        </div>
                        <div>
                          <div className="font-mono text-white/80 text-xs mb-1 font-bold">#{order.id.toUpperCase()}</div>
                          <div className="flex items-center gap-2 text-[8px] font-black text-white/40 uppercase">
                            <Calendar size={10} />
                            {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-black italic shadow-lg shadow-white/5">
                            {order.customerName.charAt(0)}
                         </div>
                         <div>
                            <div className="font-black text-white uppercase italic tracking-tighter">{order.customerName}</div>
                            <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-0.5">ID: {order.customerId.slice(0, 8)}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      {isAdmin ? (
                        <div className="relative inline-block group/status">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrder(order.id, { status: e.target.value as OrderStatus })}
                            className={`appearance-none pl-10 pr-12 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-all ${config.color} hover:brightness-125 focus:ring-2 focus:ring-white/20`}
                          >
                            {statusList.map(s => (
                              <option key={s} value={s} className="bg-black text-white">{getStatusConfig(s).label}</option>
                            ))}
                          </select>
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${config.color.split(' ')[1]}`}>
                             <config.icon size={14} />
                          </div>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                             <ChevronDown size={14} />
                          </div>
                        </div>
                      ) : (
                        <div className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <config.icon size={14} />
                          </motion.div>
                          {config.label}
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {getPaymentIcon(order.paymentMethod)}
                          <span className="text-[9px] font-black uppercase text-white/60">{order.paymentMethod || 'Pendiente'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Receipt size={14} className="text-white/20" />
                          <span className="text-[9px] font-black uppercase text-white/40">{order.billingType || 'Sin comprobante'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <span className="text-white/20"><DollarSign size={16} /></span>
                        <span className="text-2xl font-black italic tracking-tighter text-white">
                          {order.total.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 transition-all">
                        {confirmDeleteOrderId === order.id ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => setConfirmDeleteOrderId(null)} className="px-3 py-2 text-[10px] uppercase font-black bg-white/10 hover:bg-white/20 rounded-lg">Cancelar</button>
                            <button onClick={() => {
                              deleteOrder(order.id);
                              setConfirmDeleteOrderId(null);
                            }} className="px-3 py-2 text-[10px] uppercase font-black bg-rose-600 hover:bg-rose-500 text-white rounded-lg">
                              Eliminar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={() => toggleOrder(order.id)}
                              className={`p-4 rounded-2xl transition-all shadow-xl ${isExpanded ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                            >
                              <Eye size={18} />
                            </button>
                            {isAdmin && (
                              <button 
                                onClick={() => setConfirmDeleteOrderId(order.id)}
                                className="p-4 bg-white/5 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-xl"
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Detail Row */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0 border-b border-white/5">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white/[0.01]"
                          >
                            <div className="p-12 pl-24 border-l-4 border-white">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                {/* Items List */}
                                <div className="space-y-6">
                                  <div className="flex items-center gap-3 mb-8">
                                    <Package size={20} className="text-white/40" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Contenido del Artifacto</h4>
                                  </div>
                                  <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group/item hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-6">
                                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-white/20 italic">
                                            {idx + 1}
                                          </div>
                                          <div>
                                            <div className="font-black text-sm uppercase italic group-hover/item:text-white transition-colors">{item.name}</div>
                                            <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Ref ID: {item.productId.slice(0, 10)}</div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-10">
                                          <div className="text-right">
                                            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Cantidad</div>
                                            <div className="font-black italic text-lg">x{item.quantity}</div>
                                          </div>
                                          <div className="text-right min-w-[80px]">
                                            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Costo Unit.</div>
                                            <div className="font-black italic text-lg">S/ {item.price.toLocaleString()}</div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Logistics & Summary */}
                                <div className="space-y-12">
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <div className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-3">Hoja de Ruta</div>
                                        <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                              <Truck size={14} />
                                           </div>
                                           <div className="text-[10px] font-black uppercase tracking-tighter text-white">
                                              {order.trackingNumber || 'PENDIENTE ASIGNACIÓN'}
                                           </div>
                                        </div>
                                     </div>
                                     <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <div className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-3">Protocolo Fiscal</div>
                                        <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                              <FileText size={14} />
                                           </div>
                                           <div className="text-[10px] font-black uppercase tracking-tighter text-white">
                                              {order.billingType?.toUpperCase() || 'NO GENERADO'}
                                           </div>
                                        </div>
                                     </div>
                                  </div>

                                  <div className="glass-rich p-10 rounded-[40px] border-white/10">
                                    <div className="flex items-center justify-between mb-8">
                                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Auditoría Financiera</div>
                                      <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${config.color}`}>{config.label}</div>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-lg font-black uppercase italic tracking-tighter">Total Pedido</span>
                                        <span className="text-4xl font-black italic tracking-tighter text-white">S/ {order.total.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Shipping Address */}
                                  {order.shippingDetails && (
                                    <div className="p-8 bg-white/5 border border-white/5 rounded-[40px] space-y-4">
                                      <div className="flex items-center gap-3">
                                        <Truck size={16} className="text-white/40" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Destino de Entrega</span>
                                      </div>
                                      <div className="space-y-2">
                                        <p className="text-sm font-black italic uppercase tracking-tighter">
                                          {order.shippingDetails.calle} {order.shippingDetails.numero || 'S/N'}
                                          {order.shippingDetails.piso && <span className="text-white/40"> - {order.shippingDetails.piso}</span>}
                                        </p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                          {order.shippingDetails.localidad}, {order.shippingDetails.departamento}
                                        </p>
                                        {order.shippingDetails.zip && (
                                          <p className="text-[9px] font-mono text-white/20">CP: {order.shippingDetails.zip}</p>
                                        )}
                                        {!order.shippingDetails.sinEntrecalles && (order.shippingDetails.calle1 || order.shippingDetails.calle2) && (
                                          <p className="text-[9px] text-white/40 italic">Entre: {order.shippingDetails.calle1} y {order.shippingDetails.calle2}</p>
                                        )}
                                        {order.shippingDetails.indicaciones && (
                                          <div className="mt-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                                            <p className="text-[9px] text-white/40 font-black uppercase mb-1">Referencias:</p>
                                            <p className="text-[10px] text-white/70 italic">{order.shippingDetails.indicaciones}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {order.notes && (
                                    <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
                                      <div className="flex items-center gap-3 mb-4">
                                        <ClipboardList size={16} className="text-amber-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-500/60">Notas de Almacén</span>
                                      </div>
                                      <p className="text-xs text-white/70 italic leading-relaxed">{order.notes}</p>
                                    </div>
                                  )}
                                  
                                  <div className="flex gap-4">
                                    <button className="flex-1 py-5 bg-white text-black font-black uppercase italic tracking-widest text-[10px] rounded-[24px] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                      <Receipt size={14} />
                                      Emitir Comprobante
                                    </button>
                                    <button className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-black uppercase italic tracking-widest text-[10px] rounded-[24px] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                      <Truck size={14} />
                                      Guía de Remisión
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
                )
              }) : (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20 grayscale">
                       <ShoppingCart size={64} />
                       <div className="uppercase font-black tracking-[0.5em] text-xs">Protocolo de órdenes vacío</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


