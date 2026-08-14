const fs = require('fs');
let code = fs.readFileSync('src/components/public/PaymentView.tsx', 'utf8');

code = code.replace(
  'name: item.name,\n            units: item.quantity',
  'name: item.selectedSize ? `${item.name} - Talla ${item.selectedSize}` : item.name,\n            units: item.quantity'
);

fs.writeFileSync('src/components/public/PaymentView.tsx', code);
