const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace("storeName: string;", "storeName: string;\n  logo?: string;");
fs.writeFileSync('src/types.ts', code);
