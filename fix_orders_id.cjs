const fs = require('fs');
let code = fs.readFileSync('src/components/Orders.tsx', 'utf8');

code = code.replace(/order\.id\.slice\(-8\)\.toUpperCase\(\)/g, 'order.id.toUpperCase()');
code = code.replace(/order\.id\.slice\(-6\)\.toUpperCase\(\)/g, 'order.id.toUpperCase()');

fs.writeFileSync('src/components/Orders.tsx', code);
