const fs = require('fs');

let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

code = code.replace(
  `if (verifyRes.user && (verifyRes.user.role === 'admin' || verifyRes.user.role === 'superadmin')) {
          isUserAdmin = true;
        }`,
  `if (verifyRes.user && verifyRes.user.role === 'superadmin') {
          isUserAdmin = true;
        }`
);

fs.writeFileSync('src/components/Auth.tsx', code);
