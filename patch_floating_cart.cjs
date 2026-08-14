const fs = require('fs');
let code = fs.readFileSync('src/components/public/FloatingCart.tsx', 'utf8');

code = code.replace(
  'onClick={() => removeItem(item.id)}',
  'onClick={() => removeItem(item.cartItemId)}'
);
code = code.replace(
  'onClick={() => addItem(item)}',
  'onClick={() => addItem(item, item.selectedSize)}'
);
code = code.replace(
  'onClick={() => deleteItem(item.id)}',
  'onClick={() => deleteItem(item.cartItemId)}'
);
code = code.replace(
  '<h4 className="text-[8px] font-black uppercase tracking-widest text-white/80 leading-tight mb-1 truncate">{item.name}</h4>',
  '<h4 className="text-[8px] font-black uppercase tracking-widest text-white/80 leading-tight mb-1 truncate">{item.name}{item.selectedSize ? ` - Talla ${item.selectedSize}` : ""}</h4>'
);

fs.writeFileSync('src/components/public/FloatingCart.tsx', code);
