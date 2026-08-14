const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

code = code.replace(
  `onVerifyCredentials?: (email: string, password?: string) => { success: boolean; message?: string };`,
  `onVerifyCredentials?: (email: string, password?: string) => { success: boolean; message?: string; user?: any };`
);

fs.writeFileSync('src/components/Auth.tsx', code);
