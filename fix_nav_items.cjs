const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetNav = `  const navItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'catalog', label: 'Productos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart, roles: ['admin'] },
    { id: 'customers', label: 'Clientes', icon: Users, roles: ['admin'] },
    { id: 'users', label: 'Roles', icon: Shield, roles: ['admin'] },
    // { id: 'bulk', label: 'Importar', icon: UploadCloud, roles: ['admin'] },
    { id: 'backup', label: 'Cloud Local', icon: Database, roles: ['admin'] },
    { id: 'settings', label: 'Ajustes', icon: Settings, roles: ['admin'] },
  ];`;

const replacementNav = `  const navItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard, roles: ['admin', 'superadmin'] },
    { id: 'catalog', label: 'Productos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart, roles: ['admin', 'superadmin'] },
    { id: 'customers', label: 'Clientes', icon: Users, roles: ['admin', 'superadmin'] },
    { id: 'users', label: 'Roles', icon: Shield, roles: ['admin', 'superadmin'] },
    // { id: 'bulk', label: 'Importar', icon: UploadCloud, roles: ['admin', 'superadmin'] },
    { id: 'backup', label: 'Cloud Local', icon: Database, roles: ['admin', 'superadmin'] },
    { id: 'settings', label: 'Ajustes', icon: Settings, roles: ['admin', 'superadmin'] },
  ];`;

code = code.replace(targetNav, replacementNav);
fs.writeFileSync('src/App.tsx', code);
