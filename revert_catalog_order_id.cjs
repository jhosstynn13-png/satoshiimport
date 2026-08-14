const fs = require('fs');

let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// Replace all short IDs back to uid()
code = code.replace(
  /id: 'ORD-' \+ Math\.random\(\)\.toString\(36\)\.substr\(2, 6\)\.toUpperCase\(\),\n      createdAt: Date\.now\(\),/g,
  "id: uid(),\n      createdAt: Date.now(),"
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
