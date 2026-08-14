const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const target = `    // Admins are now dynamically protected by their roles, no hardcoded password resets.`;

const replacement = `    // Force jhosstynn13@gmail.com to be superadmin
    const jhosstynnIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'jhosstynn13@gmail.com' || u.email.toLowerCase() === 'desconocidojijas@gmail.com');
    if (jhosstynnIndex !== -1) {
      parsed.users[jhosstynnIndex].role = 'superadmin';
    }

    // Admins are now dynamically protected by their roles, no hardcoded password resets.`;

code = code.replace(target, replacement);
fs.writeFileSync('src/hooks/useCatalog.ts', code);
