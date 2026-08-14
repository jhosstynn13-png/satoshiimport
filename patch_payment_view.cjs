const fs = require('fs');
let code = fs.readFileSync('src/components/public/PaymentView.tsx', 'utf8');

code = code.replace(
  'key={item.id} className="flex gap-4 items-center"',
  'key={item.cartItemId} className="flex gap-4 items-center"'
);

code = code.replace(
  '<h4 className="text-[10px] font-black uppercase tracking-widest italic">{item.name}</h4>',
  '<h4 className="text-[10px] font-black uppercase tracking-widest italic">{item.name}{item.selectedSize ? ` - Talla ${item.selectedSize}` : ""}</h4>'
);

// We should also make sure the email template includes the size!
code = code.replace(
  'name: item.name,',
  'name: item.selectedSize ? `${item.name} - Talla ${item.selectedSize}` : item.name,'
);

fs.writeFileSync('src/components/public/PaymentView.tsx', code);
