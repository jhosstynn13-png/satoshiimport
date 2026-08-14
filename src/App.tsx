/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  UploadCloud, 
  Database, 
  Search, 
  Plus, 
  ShoppingCart,
  Users,
  Shield,
  Settings,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCatalog } from './hooks/useCatalog';
import { View } from './types';

// Views
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import BulkUpload from './components/BulkUpload';
import Backup from './components/Backup';
import Orders from './components/Orders';
import Customers from './components/Customers';
import StoreSettings from './components/StoreSettings';
import UsersView from './components/Users';
import Auth from './components/Auth';
import PublicLayout from './components/public/PublicLayout';

const LogoRaw = () => (
  <svg width="40" height="40" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
    <path d="M150 150C150 150 200 100 250 100C300 100 350 150 350 150M150 150V250C150 250 150 350 250 350C350 350 350 250 350 250V200M150 150L250 250L350 150" stroke="currentColor" strokeWidth="60" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Improved Logo based on the user provided image - Stylized Geometric "S"
const GSLogo = () => (
  <div className="w-full h-full flex items-center justify-center font-black text-black text-2xl italic">
    S
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin');
  
  const catalog = useCatalog();
  const { currentUser, login, logout, register, loginAsGuest } = catalog;

  const navItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard, roles: ['admin', 'superadmin'] },
    { id: 'catalog', label: 'Productos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart, roles: ['admin', 'superadmin'] },
    { id: 'customers', label: 'Clientes', icon: Users, roles: ['admin', 'superadmin'] },
    { id: 'users', label: 'Roles', icon: Shield, roles: ['admin', 'superadmin'] },
    // { id: 'bulk', label: 'Importar', icon: UploadCloud, roles: ['admin', 'superadmin'] },
    { id: 'backup', label: 'Cloud Local', icon: Database, roles: ['admin', 'superadmin'] },
    { id: 'settings', label: 'Ajustes', icon: Settings, roles: ['admin', 'superadmin'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (currentUser && item.roles.includes(currentUser.role))
  );

  const pageInfo = {
    dashboard: { title: 'Ecommerce Insight', subtitle: 'Métricas de rendimiento y ventas.' },
    catalog: { title: 'Gestión Stock', subtitle: 'Control de inventario y categorías.' },
    orders: { title: 'Órdenes', subtitle: 'Historial y estado de pedidos.' },
    customers: { title: 'CRM Local', subtitle: 'Base de datos de clientes.' },
    users: { title: 'Roles & Accesos', subtitle: 'Gestión de perfiles y permisos.' },
    bulk: { title: 'Carga Masiva', subtitle: 'Sincronización por lotes CSV.' },
    backup: { title: 'Respaldo', subtitle: 'Seguridad y portabilidad de datos.' },
    settings: { title: 'Tienda', subtitle: 'Configuración global del sistema.' },
  };

  // Logic: If Admin -> show Dashboard. If Guest or Client -> show Public Layout
  if (!currentUser || currentUser.role === 'client' || currentUser.role === 'guest' || viewMode === 'client') {
    return (
      <>
        <PublicLayout 
          catalog={catalog} 
          onShowAuth={() => setShowAuthModal(true)} 
        />
        {(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
          <button 
             onClick={() => setViewMode('admin')}
             className="fixed bottom-6 left-6 z-50 px-6 py-3 bg-black text-white font-black rounded-full shadow-2xl border border-white/10 uppercase tracking-widest text-[10px]"
          >
             Volver al Panel Master
          </button>
        )}
        <AnimatePresence>
          {showAuthModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAuthModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative z-10 w-full max-w-xl"
              >
                <Auth 
                  clientLoginEnabled={catalog.data.storeSettings?.clientLoginEnabled !== false && catalog.data.storeSettings?.publicAccessEnabled !== false}
                  onLogin={(email, password) => { 
                    const res = login(email, password);
                    if (res.success) setShowAuthModal(false);
                    return res;
                  }} 
                  onVerifyCredentials={catalog.verifyCredentials}
                  onRegister={(data) => { 
                    const res = register(data);
                    if (res.success) setShowAuthModal(false);
                    return res;
                  }} 
                  onGuestLogin={() => { loginAsGuest(); setShowAuthModal(false); }}
                  isModal 
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="flex absolute inset-0 overflow-hidden bg-black selection:bg-white selection:text-black">
      {/* Background Orbs */}
      <div className="orb w-[600px] h-[600px] bg-white/5 -top-[10%] -left-[5%]" style={{ animationDuration: '15s' }} />
      <div className="orb w-[500px] h-[500px] bg-white/5 -bottom-[10%] -right-[5%]" style={{ animationDuration: '20s' }} />

      {/* Sidebar */}
      <aside className="w-72 glass h-full flex flex-col p-8 z-20 rounded-r-[48px] border-l-0 shadow-[20px_0_40px_rgba(0,0,0,0.5)] shrink-0">
        <div className="mb-12">
          <div className="bg-white rounded-[28px] p-4 flex items-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.15)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {catalog.data.storeSettings?.logo ? (
              <div className="w-12 h-12 flex items-center justify-center shrink-0 relative z-10">
                <img src={catalog.data.storeSettings.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center shrink-0 relative z-10">
                <GSLogo />
              </div>
            )}
            <div className="flex-1 min-w-0 relative z-10">
              <h1 className="font-black text-[22px] tracking-tighter text-black uppercase truncate leading-none pt-1">
                {catalog.data.storeSettings?.storeName || 'SATOSHIMPORT'}
              </h1>
              <p className="text-[7.5px] text-black/40 uppercase tracking-[0.25em] font-black mt-1.5 truncate">
                Management Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-500 group relative overflow-hidden ${
                currentView === item.id 
                  ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.15)] ring-1 ring-white/10' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-black' : 'text-white/40 group-hover:scale-110 transition-transform duration-500'} />
              <span className="text-sm uppercase tracking-widest">{item.label}</span>
              {currentView === item.id && (
                <motion.div 
                  layoutId="active-nav"
                  className="ml-auto"
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-4">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-black text-white italic">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black uppercase tracking-tighter truncate italic">{currentUser?.name}</p>
                <p className="text-[8px] text-white/50 uppercase font-black tracking-widest">{currentUser?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full py-3 bg-white/5 hover:bg-red-600/20 hover:text-red-500 text-white/60 font-black rounded-2xl transition-all uppercase tracking-widest text-[9px] italic border border-white/5"
            >
              Cerrar Sesión
            </button>
          </div>
          

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative z-10">
        {/* Header */}
        <header className="h-32 px-12 flex items-center justify-between sticky top-0 bg-black/60 backdrop-blur-xl z-30 border-b border-white/5">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">{pageInfo[currentView].title}</h2>
            <p className="text-sm text-white/50 font-bold uppercase tracking-widest mt-1">{pageInfo[currentView].subtitle}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-white" size={18} />
              <input 
                type="text" 
                placeholder="Global Search..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val) {
                    const upperVal = val.toUpperCase();
                    if (upperVal.startsWith('ORD-')) {
                      setCurrentView('orders');
                      return;
                    }
                    
                    const isCatalogMatch = catalog.allProducts?.some(p => p.name.toUpperCase().includes(upperVal) || p.sku.toUpperCase().includes(upperVal));
                    const isCustomerMatch = catalog.data.customers?.some(c => c.name.toUpperCase().includes(upperVal) || c.email.toUpperCase().includes(upperVal));
                    const isOrderMatch = catalog.data.orders?.some(o => o.customerName.toUpperCase().includes(upperVal) || o.id.toUpperCase().includes(upperVal));
                    
                    if (currentView === 'catalog' && isCatalogMatch) return;
                    if (currentView === 'customers' && isCustomerMatch) return;
                    if (currentView === 'orders' && isOrderMatch) return;
                    
                    if (isCatalogMatch) setCurrentView('catalog');
                    else if (isCustomerMatch) setCurrentView('customers');
                    else if (isOrderMatch) setCurrentView('orders');
                    else if (!['catalog', 'orders', 'customers', 'users'].includes(currentView)) {
                      setCurrentView('catalog');
                    }
                  }
                }}
                className="pl-13 pr-6 py-4 bg-white/5 border border-white/5 rounded-[24px] focus:bg-white/10 outline-none w-80 text-xs font-bold transition-all placeholder:text-white/30"
              />
            </div>
            {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
              <button 
                onClick={() => setCurrentView('catalog')}
                className="px-8 py-4 rounded-[24px] bg-white text-black font-black transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 flex items-center gap-3 uppercase tracking-tighter text-sm"
              >
                <Plus size={20} />
                <span>New Entry</span>
              </button>
            )}
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentView === 'dashboard' && <Dashboard catalog={catalog} />}
              {currentView === 'catalog' && <Catalog catalog={catalog} searchQuery={searchQuery} />}
              {currentView === 'orders' && <Orders catalog={catalog} searchQuery={searchQuery} />}
              {currentView === 'customers' && <Customers catalog={catalog} searchQuery={searchQuery} />}
              {currentView === 'users' && <UsersView catalog={catalog} />}
              {currentView === 'bulk' && <BulkUpload catalog={catalog} />}
              {currentView === 'backup' && <Backup catalog={catalog} />}
              {currentView === 'settings' && <StoreSettings catalog={catalog} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
