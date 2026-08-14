const fs = require('fs');

let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// Modify addOrder to use a short ID
code = code.replace(
  "id: uid(),\n      createdAt: Date.now(),",
  "id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),\n      createdAt: Date.now(),"
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
