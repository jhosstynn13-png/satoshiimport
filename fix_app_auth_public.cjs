const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `clientLoginEnabled={catalog.data.storeSettings?.clientLoginEnabled !== false}`;
const replacement = `clientLoginEnabled={catalog.data.storeSettings?.clientLoginEnabled !== false && catalog.data.storeSettings?.publicAccessEnabled !== false}`;
code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
