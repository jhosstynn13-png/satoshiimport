const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

code = code.replace(
  "onClick={() => isPublic && setSelectedSize(size)}",
  "onClick={() => { if (isPublic) setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]) }}"
);

code = code.replace(
  "selectedSize === size",
  "selectedSizes.includes(size)"
);

code = code.replace(
  "if (displaySizes.length > 0 && !selectedSize)",
  "if (displaySizes.length > 0 && selectedSizes.length === 0)"
);

code = code.replace(
  "onAddToCart?.(product, selectedSize || undefined);",
  `if (displaySizes.length === 0) {
                  onAddToCart?.(product);
                } else {
                  selectedSizes.forEach(s => onAddToCart?.(product, s));
                }`
);

code = code.replace(
  "setSelectedSize(null);",
  "setSelectedSizes([]);"
);

fs.writeFileSync('src/components/ProductCard.tsx', code);
