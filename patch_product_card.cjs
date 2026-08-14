const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

// Add useState import if not present
if (!code.includes('useState')) {
  code = code.replace("import React from 'react';", "import React, { useState } from 'react';");
}

code = code.replace(
  'onAddToCart?: (p: Product) => void;',
  'onAddToCart?: (p: Product, size?: string) => void;'
);

code = code.replace(
  'isPublic = false\n}) => {',
  `isPublic = false
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  const displaySizes = isPublic && product.sizes && product.sizes.length > 0 
    ? [...product.sizes, 'Otros'] 
    : product.sizes || [];
`
);

code = code.replace(
  '<div className="flex flex-wrap gap-1 mt-2">',
  '<div className="flex flex-wrap gap-1 mt-2">'
);

code = code.replace(
  /\{product\.sizes\.map\(size => \([\s\S]*?\}\)\}/,
  `{displaySizes.map(size => (
                <button 
                  key={size}
                  onClick={() => isPublic && setSelectedSize(size)}
                  disabled={!isPublic}
                  className={\`px-1.5 py-0.5 border rounded text-[8px] font-black transition-all \${
                    selectedSize === size 
                      ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                      : 'bg-white/5 border-white/5 text-white/50 \${isPublic ? "hover:bg-white/20 hover:text-white cursor-pointer" : ""}'
                  }\`}
                >
                  {size}
                </button>
              ))}`
);

// Disable AddToCart if size is not selected
code = code.replace(
  'onClick={() => onAddToCart?.(product)}',
  `onClick={() => {
                if (displaySizes.length > 0 && !selectedSize) {
                  alert('Por favor selecciona una talla antes de añadir al carrito.');
                  return;
                }
                onAddToCart?.(product, selectedSize || undefined);
                setSelectedSize(null);
              }}`
);

fs.writeFileSync('src/components/ProductCard.tsx', code);
