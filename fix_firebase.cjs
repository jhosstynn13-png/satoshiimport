const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');
code = code.replace("import { signInAnonymously } from 'firebase/auth';", "");
code = code.replace("// Initialize anonymous auth for storage uploads\nsignInAnonymously(auth).catch(console.error);", "");
fs.writeFileSync('src/firebase.ts', code);
