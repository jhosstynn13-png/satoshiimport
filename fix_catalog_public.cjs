const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const target = `      if (user.role === 'client' && data.storeSettings?.clientLoginEnabled === false) {`;
const replacement = `      if (user.role === 'client' && (data.storeSettings?.clientLoginEnabled === false || data.storeSettings?.publicAccessEnabled === false)) {`;
code = code.replace(target, replacement);

const targetReg = `if (data.storeSettings?.clientLoginEnabled === false) {`;
const replacementReg = `if (data.storeSettings?.clientLoginEnabled === false || data.storeSettings?.publicAccessEnabled === false) {`;
code = code.replace(targetReg, replacementReg);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
