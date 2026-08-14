const fs = require('fs');
let code = fs.readFileSync('src/components/Orders.tsx', 'utf8');

code = code.replace(
  "const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());",
  "const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());\n  const [confirmDeleteOrderId, setConfirmDeleteOrderId] = useState<string | null>(null);"
);

const oldButtons = `                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => toggleOrder(order.id)}
                          className={\`p-4 rounded-2xl transition-all shadow-xl \${isExpanded ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 text-white'}\`}
                        >
                          <Eye size={18} />
                        </button>
                        {isAdmin && (
                          <button 
                            onClick={() => { if(confirm('¿Revocar pedido permanentemente?')) deleteOrder(order.id); }}
                            className="p-4 bg-white/5 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-xl"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>`;

const newButtons = `                      <div className="flex items-center justify-end gap-3 transition-all">
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
                              className={\`p-4 rounded-2xl transition-all shadow-xl \${isExpanded ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 text-white'}\`}
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
                      </div>`;

code = code.replace(oldButtons, newButtons);
fs.writeFileSync('src/components/Orders.tsx', code);
