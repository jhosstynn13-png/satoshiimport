const fs = require('fs');

function patchFile(file, search, replace) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(search, replace);
  fs.writeFileSync(file, code);
}

patchFile('src/components/public/PublicHome.tsx', 'key={product.id}', 'key={`${product.id}-${i}`}');
patchFile('src/components/public/PublicHome.tsx', 'featuredProducts.map((product: any) => (', 'featuredProducts.map((product: any, i: number) => (');

