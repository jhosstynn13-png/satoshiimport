const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');
if(!code.includes('signInAnonymously')) {
  code = code.replace(
    "export const auth = getAuth(app);",
    "import { signInAnonymously } from 'firebase/auth';\nexport const auth = getAuth(app);\n// Initialize anonymous auth for storage uploads\nsignInAnonymously(auth).catch(console.error);"
  );
  fs.writeFileSync('src/firebase.ts', code);
}
