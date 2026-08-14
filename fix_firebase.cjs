const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');
code = code.replace("import { getAuth } from 'firebase/auth';", "import { getAuth } from 'firebase/auth';\nimport { getStorage } from 'firebase/storage';");
code = code.replace("export const auth = getAuth(app);", "export const auth = getAuth(app);\nexport const storage = getStorage(app);");
fs.writeFileSync('src/firebase.ts', code);
