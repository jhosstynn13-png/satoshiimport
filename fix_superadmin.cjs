const fs = require('fs');

let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// Ensure Satoshi is always injected
const targetSatoshi = `    const jhosstynnIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'jhosstynn13@gmail.com' || u.email.toLowerCase() === 'desconocidojijas@gmail.com');
    if (jhosstynnIndex !== -1) {
      parsed.users[jhosstynnIndex].role = 'superadmin';
    }`;

const replacementSatoshi = `    const jhosstynnIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'jhosstynn13@gmail.com' || u.email.toLowerCase() === 'desconocidojijas@gmail.com');
    if (jhosstynnIndex !== -1) {
      parsed.users[jhosstynnIndex].role = 'superadmin';
    }

    const satoshiIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'importsatoshi@hotmail.com');
    if (satoshiIndex === -1) {
      parsed.users.push(starterData.users[1]);
    } else {
      parsed.users[satoshiIndex].role = 'admin';
    }`;

code = code.replace(targetSatoshi, replacementSatoshi);

// Force currentUser role fix
const targetSession = `    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY + "_session", JSON.stringify(user));`;

const replacementSession = `    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY + "_session", JSON.stringify(user));`;

fs.writeFileSync('src/hooks/useCatalog.ts', code);

