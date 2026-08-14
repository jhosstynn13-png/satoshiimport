const fs = require('fs');

let usersCode = fs.readFileSync('src/components/Users.tsx', 'utf8');
usersCode = usersCode.replace(
  `if (originalUser && originalUser.role === 'admin') {`,
  `if (originalUser && (originalUser.role === 'admin' || originalUser.role === 'superadmin')) {`
);
fs.writeFileSync('src/components/Users.tsx', usersCode);

let authCode = fs.readFileSync('src/components/Auth.tsx', 'utf8');
authCode = authCode.replace(
  `if (verifyRes.user && verifyRes.user.role === 'admin') {`,
  `if (verifyRes.user && (verifyRes.user.role === 'admin' || verifyRes.user.role === 'superadmin')) {`
);
fs.writeFileSync('src/components/Auth.tsx', authCode);
