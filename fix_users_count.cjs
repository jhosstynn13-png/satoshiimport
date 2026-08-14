const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `{users.filter((u: any) => u.role === 'admin').length}`,
  `{users.filter((u: any) => u.role === 'admin' || u.role === 'superadmin').length}`
);

fs.writeFileSync('src/components/Users.tsx', code);
