const fs = require('fs');
let code = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

// Update CartItem interface
code = code.replace(
  'interface CartItem extends Product {\n  quantity: number;\n}',
  'interface CartItem extends Product {\n  quantity: number;\n  selectedSize?: string;\n  cartItemId: string;\n}'
);

// Update CartContextType
code = code.replace(
  'addItem: (product: Product) => void;',
  'addItem: (product: Product, size?: string) => void;'
);

// Update addItem implementation
code = code.replace(
  'const addItem = (product: Product) => {',
  'const addItem = (product: Product, size?: string) => {'
);
code = code.replace(
  'const existing = prev.find(item => item.id === product.id);',
  'const cartItemId = size ? `${product.id}-${size}` : product.id;\n      const existing = prev.find(item => item.cartItemId === cartItemId);'
);
code = code.replace(
  'item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item',
  'item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item'
);
code = code.replace(
  'return [...prev, { ...product, quantity: 1 }];',
  'return [...prev, { ...product, quantity: 1, selectedSize: size, cartItemId }];'
);

// Update removeItem and deleteItem implementation to use cartItemId instead of productId
code = code.replace(
  'removeItem: (productId: string) => void;',
  'removeItem: (cartItemId: string) => void;'
);
code = code.replace(
  'const removeItem = (productId: string) => {',
  'const removeItem = (cartItemId: string) => {'
);
code = code.replace(
  'const existing = prev.find(item => item.id === productId);',
  'const existing = prev.find(item => item.cartItemId === cartItemId);'
);
code = code.replace(
  'item.id === productId ? { ...item, quantity: item.quantity - 1 } : item',
  'item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item'
);
code = code.replace(
  'return prev.filter(item => item.id !== productId);',
  'return prev.filter(item => item.cartItemId !== cartItemId);'
);

code = code.replace(
  'deleteItem: (productId: string) => void;',
  'deleteItem: (cartItemId: string) => void;'
);
code = code.replace(
  'const deleteItem = (productId: string) => {',
  'const deleteItem = (cartItemId: string) => {'
);
code = code.replace(
  'return prev.filter(item => item.id !== productId);',
  'return prev.filter(item => item.cartItemId !== cartItemId);'
);

fs.writeFileSync('src/context/CartContext.tsx', code);
