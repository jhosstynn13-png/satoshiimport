const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `if (originalUser && (originalUser.role === 'admin' || originalUser.role === 'superadmin')) {`,
  `if (originalUser && originalUser.role === 'superadmin') {`
);

fs.writeFileSync('src/components/Users.tsx', code);
