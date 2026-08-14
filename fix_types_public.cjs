const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace("clientLoginEnabled?: boolean;", "clientLoginEnabled?: boolean;\n  publicAccessEnabled?: boolean;");
fs.writeFileSync('src/types.ts', code);
