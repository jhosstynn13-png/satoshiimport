const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const loginTarget = `      if (user.status === 'suspended') {
        addLog(\`Intento de inicio de sesión de usuario suspendido: \${email}\`, 'error');
        
  return { success: false, message: 'Su cuenta ha sido suspendida por seguridad.' };
      }`;

const loginReplacement = `      if (user.status === 'suspended') {
        addLog(\`Intento de inicio de sesión de usuario suspendido: \${email}\`, 'error');
        return { success: false, message: 'Su cuenta ha sido suspendida por seguridad.' };
      }
      
      if (user.role === 'client' && data.storeSettings?.clientLoginEnabled === false) {
        addLog(\`Intento de inicio de sesión de cliente bloqueado (acceso deshabilitado): \${email}\`, 'warning');
        return { success: false, message: 'El acceso para clientes está temporalmente deshabilitado por mantenimiento.' };
      }`;

code = code.replace(loginTarget, loginReplacement);

const registerTarget = `  const register = (userData: Omit<User, 'id' | 'createdAt'>) => {`;
const registerReplacement = `  const register = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (data.storeSettings?.clientLoginEnabled === false) {
      return { success: false, message: 'El registro de nuevos clientes está temporalmente deshabilitado.' };
    }`;

code = code.replace(registerTarget, registerReplacement);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
