const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(
  "  status: 'active' | 'discontinued';",
  "  status: 'active' | 'discontinued';\n  isFavorite?: boolean;\n  featuredStyle?: string;"
);
fs.writeFileSync('src/types.ts', code);
