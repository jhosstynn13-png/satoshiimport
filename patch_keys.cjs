const fs = require('fs');

function patchFile(file, search, replace) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(search, replace);
  fs.writeFileSync(file, code);
}

patchFile('src/components/public/PublicCatalog.tsx', 'key={product.id}', 'key={`${product.id}-${i}`}');
patchFile('src/components/public/PublicCatalog.tsx', 'filteredProducts.map((product: any) => (', 'filteredProducts.map((product: any, i: number) => (');

patchFile('src/components/Catalog.tsx', 'key={p.id}', 'key={`${p.id}-${i}`}');
patchFile('src/components/Catalog.tsx', 'filteredProducts.map((p: Product) => (', 'filteredProducts.map((p: Product, i: number) => (');

