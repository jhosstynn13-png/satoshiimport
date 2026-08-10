import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart, 
  Clock, 
  ArrowUpRight,
  Zap,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText
} from 'lucide-react';

export default function Dashboard({ catalog }: { catalog: any }) {
  const { data, allProducts } = catalog;
  const orders = data.orders || [];
  
  const stats = useMemo(() => {
    const totalSales = orders.reduce((acc: number, o: any) => acc + (o.total || 0), 0);
    const customerCount = (data.customers || []).length;
    const orderCount = orders.length;

    return [
      { 
        label: 'Ventas Totales', 
        value: `S/ ${totalSales.toLocaleString()}`, 
        icon: TrendingUp, 
        trend: '+12.5%',
      },
      { 
        label: 'Catálogo Global', 
        value: allProducts.length, 
        icon: Package, 
        trend: 'Ítems Activos',
      },
      { 
        label: 'Clientes', 
        value: customerCount, 
        icon: Users, 
        trend: '+2 nuevos',
      },
      { 
        label: 'Pedidos', 
        value: orderCount, 
        icon: ShoppingCart, 
        trend: 'Hoy: 0',
      },
    ];
  }, [data, allProducts, orders]);

  const orderSummary = useMemo(() => {
    return [
      { label: 'Pendientes de Envío', count: orders.filter((o: any) => o.status === 'pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { label: 'En Tránsito', count: orders.filter((o: any) => o.status === 'shipped').length, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { label: 'Entregados', count: orders.filter((o: any) => o.status === 'delivered').length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
      { label: 'Devoluciones/Cancelados', count: orders.filter((o: any) => ['cancelled', 'returned'].includes(o.status)).length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];
  }, [orders]);

  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string, image: string, total: number, sku: string }> = {};
    orders.forEach((o: any) => {
      o.items.forEach((item: any) => {
        if (!counts[item.productId]) {
          counts[item.productId] = { name: item.name, image: '', total: 0, sku: '' };
          const p = allProducts.find((ap: any) => ap.id === item.productId);
          if (p) {
            counts[item.productId].image = p.image;
            counts[item.productId].sku = p.sku;
          }
        }
        counts[item.productId].total += item.quantity;
      });
    });
    return Object.values(counts).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [orders, allProducts]);

  const delayedOrders = useMemo(() => {
    const now = Date.now();
    const TWO_DAYS = 48 * 60 * 60 * 1000;
    return orders.filter((o: any) => 
      o.status === 'pending' && (now - o.createdAt) > TWO_DAYS
    );
  }, [orders]);

  return (
    <div className="space-y-12 pb-20">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[48px] flex flex-col gap-6 group hover:translate-y-[-10px] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 group-hover:bg-white group-hover:text-black transition-all duration-500">
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-white/60 uppercase tracking-widest">
                <ArrowUpRight size={14} />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.25em]">{stat.label}</p>
              <h3 className="text-4xl font-black tracking-tighter text-white mt-1 italic">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {orderSummary.map((item, i) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`p-8 rounded-[32px] border border-white/10 ${item.bg} flex items-center gap-6 group hover:scale-[1.02] transition-all`}
          >
            <div className={`p-4 rounded-2xl ${item.color} bg-black/20`}>
              <item.icon size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-white/60 tracking-widest">{item.label}</div>
              <div className="text-2xl font-black italic mt-1">{item.count}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Top Products */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-[60px] p-12 relative overflow-hidden"
        >
          <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4 mb-10">
            <TrendingUp size={28} className="text-white/60" />
            Top Productos Vendidos
          </h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white transition-all duration-500 group">
                <div className="w-12 h-12 rounded-xl bg-white overflow-hidden p-1 flex-shrink-0">
                  <img src={p.image || 'https://via.placeholder.com/150'} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-sm uppercase italic group-hover:text-black transition-colors truncate">{p.name}</div>
                  <div className="text-[9px] font-black text-white/40 uppercase group-hover:text-black/40 transition-colors uppercase tracking-[0.2em]">{p.sku}</div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 group-hover:bg-black/5 flex items-center gap-2">
                  <span className="text-lg font-black italic group-hover:text-black">{p.total}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-black/40">Uds</span>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-20 uppercase font-black tracking-widest text-xs border border-dashed border-white/20 rounded-3xl">Sin datos de ventas</div>
            )}
          </div>
        </motion.div>

        {/* Delayed Orders Alerts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-[60px] p-12 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
              <AlertTriangle size={28} className="text-amber-500" />
              Alertas de Retraso
            </h3>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase rounded-lg tracking-widest">
              {delayedOrders.length} Críticos
            </span>
          </div>
          <div className="space-y-4">
            {delayedOrders.length > 0 ? delayedOrders.map((o) => (
              <div key={o.id} className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                         <FileText size={20} />
                      </div>
                      <div>
                         <div className="font-black text-sm uppercase tracking-tighter italic">Pedido #{o.id.slice(0, 8)}</div>
                         <div className="text-[10px] font-bold text-white/60 uppercase">{o.customerName}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">+ {Math.floor((Date.now() - o.createdAt) / (1000 * 60 * 60))}H ATRASO</div>
                   </div>
                </div>
              </div>
            )) : (
              <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-20 grayscale border border-dashed border-white/20 rounded-3xl">
                 <CheckCircle2 size={40} />
                 <span className="uppercase font-black tracking-widest text-xs">Sin retrasos críticos</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Featured CTA */}
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="glass rounded-[60px] p-12 relative overflow-hidden bg-white/5 border-white/10"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-24 h-24 rounded-[40px] bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] flex-shrink-0">
            <Zap size={48} className="text-black" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-tight mb-4">Master Control Satoshi</h3>
            <p className="text-lg text-white/60 leading-relaxed font-bold uppercase tracking-widest max-w-2xl">
              Protocolos de gestión activos. Supervisa el flujo de pedidos y logística en tiempo real con cifrado local persistente.
            </p>
          </div>
          <button className="px-12 py-6 bg-white text-black font-black uppercase italic tracking-[0.2em] text-xs rounded-[32px] hover:scale-110 active:scale-95 transition-all shadow-2xl flex-shrink-0">
             Sincronizar Todo
          </button>
        </div>
      </motion.div>
    </div>
  );
}

