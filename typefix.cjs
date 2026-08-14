const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');
code = code.replace("const updateStoreSettings = (newSettings) => {", "const updateStoreSettings = (newSettings: any) => {");
fs.writeFileSync('src/hooks/useCatalog.ts', code);
