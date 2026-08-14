const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const catalog = useCatalog();`;

const replacementState = `  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin');
  
  const catalog = useCatalog();`;

code = code.replace(targetState, replacementState);

const targetNav = `  const navItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'catalog', label: 'Productos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart, roles: ['admin'] },
    { id: 'customers', label: 'Clientes', icon: Users, roles: ['admin'] },
    { id: 'users', label: 'Roles', icon: Shield, roles: ['admin'] },
    { id: 'bulk', label: 'Cloud Local', icon: Database, roles: ['admin'] },
    { id: 'settings', label: 'Ajustes', icon: Settings, roles: ['admin'] },
  ];`;

const replacementNav = `  const navItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard, roles: ['admin', 'superadmin'] },
    { id: 'catalog', label: 'Productos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart, roles: ['admin', 'superadmin'] },
    { id: 'customers', label: 'Clientes', icon: Users, roles: ['admin', 'superadmin'] },
    { id: 'users', label: 'Roles', icon: Shield, roles: ['admin', 'superadmin'] },
    { id: 'bulk', label: 'Cloud Local', icon: Database, roles: ['admin', 'superadmin'] },
    { id: 'settings', label: 'Ajustes', icon: Settings, roles: ['admin', 'superadmin'] },
  ];`;

code = code.replace(targetNav, replacementNav);

const targetLogic = `  // Logic: If Admin -> show Dashboard. If Guest or Client -> show Public Layout
  if (!currentUser || currentUser.role === 'client' || currentUser.role === 'guest') {
    return (
      <>
        <PublicLayout 
          catalog={catalog} 
          onShowAuth={() => setShowAuthModal(true)} 
        />
        <AnimatePresence>
          {showAuthModal && (`;

const replacementLogic = `  // Logic: If Admin -> show Dashboard. If Guest or Client -> show Public Layout
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
          {showAuthModal && (`;

code = code.replace(targetLogic, replacementLogic);

const targetLogout = `            <button 
               onClick={logout}
              className="w-full py-3 bg-white/5 hover:bg-red-600/20 hover:text-red-500 text-white/60 font-black rounded-2xl transition-all uppercase tracking-widest text-[9px] italic border border-white/5"
            >
              Cerrar Sesión
            </button>`;

const replacementLogout = `            <button 
               onClick={() => setViewMode('client')}
              className="w-full py-3 mb-2 bg-white text-black hover:bg-white/90 font-black rounded-2xl transition-all uppercase tracking-widest text-[9px] italic"
            >
              Ir a la Tienda (Modo Cliente)
            </button>
            <button 
               onClick={logout}
              className="w-full py-3 bg-white/5 hover:bg-red-600/20 hover:text-red-500 text-white/60 font-black rounded-2xl transition-all uppercase tracking-widest text-[9px] italic border border-white/5"
            >
              Cerrar Sesión
            </button>`;

code = code.replace(targetLogout, replacementLogout);

const targetSearch = `{currentUser.role === 'admin' && (
              <button`;
const replacementSearch = `{(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
              <button`;

code = code.replace(targetSearch, replacementSearch);

fs.writeFileSync('src/App.tsx', code);
