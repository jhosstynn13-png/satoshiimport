const fs = require('fs');
let code = fs.readFileSync('src/components/Orders.tsx', 'utf8');

// Add search state
code = code.replace(
  "const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');",
  "const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');\n  const [searchQuery, setSearchQuery] = useState('');"
);

// Add Search Icon
code = code.replace(
  "import { ShoppingCart",
  "import { Search, ShoppingCart"
);

// Update filter logic
const targetFilterLogic = `  const filteredOrders = orders
    .filter((o: Order) => statusFilter === 'all' || o.status === statusFilter)
    .sort((a: Order, b: Order) => b.createdAt - a.createdAt);`;

const newFilterLogic = `  const filteredOrders = orders
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
    .sort((a: Order, b: Order) => b.createdAt - a.createdAt);`;

code = code.replace(targetFilterLogic, newFilterLogic);

// Add Search Input UI
const targetControls = `          <div className="flex gap-4">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="appearance-none bg-white/5 border border-white/5 text-white py-4 pl-6 pr-12 rounded-3xl font-black uppercase tracking-widest text-[10px] outline-none cursor-pointer hover:bg-white/10 transition-all focus:ring-2 focus:ring-white/20"
            >
              <option value="all" className="bg-[#0a0a0a]">TODOS LOS ESTADOS</option>
              {statusList.map(status => (
                <option key={status} value={status} className="bg-[#0a0a0a]">{getStatusConfig(status).label}</option>
              ))}
            </select>
          </div>
        </div>`;

const newControls = `          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text" 
                placeholder="BUSCAR ORDEN ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/5 text-white py-4 pl-14 pr-6 rounded-3xl font-black uppercase tracking-widest text-[10px] outline-none w-64 hover:bg-white/10 transition-all focus:ring-2 focus:ring-white/20 placeholder:text-white/20"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="appearance-none bg-white/5 border border-white/5 text-white py-4 pl-6 pr-12 rounded-3xl font-black uppercase tracking-widest text-[10px] outline-none cursor-pointer hover:bg-white/10 transition-all focus:ring-2 focus:ring-white/20"
            >
              <option value="all" className="bg-[#0a0a0a]">TODOS LOS ESTADOS</option>
              {statusList.map(status => (
                <option key={status} value={status} className="bg-[#0a0a0a]">{getStatusConfig(status).label}</option>
              ))}
            </select>
          </div>
        </div>`;

code = code.replace(targetControls, newControls);

fs.writeFileSync('src/components/Orders.tsx', code);
