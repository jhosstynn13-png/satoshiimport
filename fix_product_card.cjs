const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

code = code.replace(
  ": 'bg-white/5 border-white/5 text-white/50 ${isPublic ? \"hover:bg-white/20 hover:text-white cursor-pointer\" : \"\"}'",
  ": `bg-white/5 border-white/5 text-white/50 ${isPublic ? \"hover:bg-white/20 hover:text-white cursor-pointer\" : \"\"}`"
);

fs.writeFileSync('src/components/ProductCard.tsx', code);
