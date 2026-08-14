const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');
const includesStorage = code.includes('firebase/storage');
console.log({ includesStorage });
