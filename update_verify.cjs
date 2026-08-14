const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const targetVerify = `    if (password && user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    return { success: true };
  };`;

const replacementVerify = `    if (password && user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    return { success: true, user };
  };`;

code = code.replace(targetVerify, replacementVerify);
fs.writeFileSync('src/hooks/useCatalog.ts', code);
