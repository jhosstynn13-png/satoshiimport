const fs = require('fs');

// Fix Catalog.tsx
let catalogCode = fs.readFileSync('src/components/Catalog.tsx', 'utf8');
catalogCode = catalogCode.replace(
  'const uploadPromises = batch.map(async (file) => {',
  'const uploadPromises = batch.map(async (file: File) => {'
);
fs.writeFileSync('src/components/Catalog.tsx', catalogCode);

// Fix useCatalog.ts
let hookCode = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');
hookCode = hookCode.replace(
  'addProduct,\n    addProductsBulk,\n    updateProduct',
  'addProduct,\n    addProductsBulk,\n    updateProduct'
);
if (!hookCode.includes('addProductsBulk,\n    updateProduct')) {
  hookCode = hookCode.replace(
    'addProduct,\n    updateProduct',
    'addProduct,\n    addProductsBulk,\n    updateProduct'
  );
  fs.writeFileSync('src/hooks/useCatalog.ts', hookCode);
}

