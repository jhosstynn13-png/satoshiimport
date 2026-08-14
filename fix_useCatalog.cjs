const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const target = `    // Ensure both primary admins are protected/synced
    const jhosstynnIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'jhosstynn13@gmail.com');
    if (jhosstynnIndex === -1) {
      parsed.users.push(starterData.users[0]);
    } else {
      parsed.users[jhosstynnIndex].role = 'admin';
      parsed.users[jhosstynnIndex].password = 'admin';
    }

    const satoshiIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'importsatoshi@hotmail.com');
    if (satoshiIndex === -1) {
      parsed.users.push(starterData.users[1]);
    } else {
      parsed.users[satoshiIndex].role = 'admin';
      parsed.users[satoshiIndex].password = 'admin';
    }`;

code = code.replace(target, `    // Admins are now dynamically protected by their roles, no hardcoded password resets.`);
fs.writeFileSync('src/hooks/useCatalog.ts', code);
