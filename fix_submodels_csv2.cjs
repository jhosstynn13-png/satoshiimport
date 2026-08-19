const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

code = code.replace(
  /submodel\.products\.push\(\{/g,
  `
      if (!submodel.products) submodel.products = [];
      submodel.products.push({
  `
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
