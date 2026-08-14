const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCatalog.tsx', 'utf8');

code = code.replace(
  "(p) => addItem(p)",
  "(p, size) => addItem(p, size)"
);

fs.writeFileSync('src/components/public/PublicCatalog.tsx', code);
