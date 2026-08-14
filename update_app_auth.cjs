const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const targetAuth = `<Auth 
                  onLogin=`;
const replacementAuth = `<Auth 
                  clientLoginEnabled={catalog.data.storeSettings?.clientLoginEnabled !== false}
                  onLogin=`;
code = code.replace(targetAuth, replacementAuth);
fs.writeFileSync('src/App.tsx', code);
