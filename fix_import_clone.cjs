const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

code = code.replace(
  `const newData = { ...data };`,
  `const newData = JSON.parse(JSON.stringify(data));`
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
