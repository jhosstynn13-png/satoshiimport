const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

if (!code.includes('generateCode')) {
  code = code.replace(
    `import { UserRole, User as UserType } from '../types';`,
    `import { UserRole, User as UserType } from '../types';\nimport { generateCode, sendVerificationCode } from '../services/emailService';`
  );
  fs.writeFileSync('src/components/Users.tsx', code);
}
