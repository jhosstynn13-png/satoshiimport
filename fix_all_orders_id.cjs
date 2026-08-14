const fs = require('fs');

function replaceFile(path, regexes, replacement) {
  let code = fs.readFileSync(path, 'utf8');
  regexes.forEach(regex => {
    code = code.replace(regex, replacement);
  });
  fs.writeFileSync(path, code);
}

replaceFile('src/components/public/UserProfile.tsx', [
  /order\.id\.slice\(-4\)\.toUpperCase\(\)/g,
  /order\.id\.slice\(-6\)\.toUpperCase\(\)/g,
  /order\.id\.slice\(-7\)\.toUpperCase\(\)/g,
  /order\.id\.slice\(-8\)\.toUpperCase\(\)/g
], 'order.id.toUpperCase()');

replaceFile('src/components/Customers.tsx', [
  /order\.id\.slice\(-6\)\.toUpperCase\(\)/g
], 'order.id.toUpperCase()');

replaceFile('src/lib/receipt.ts', [
  /order\.id\.slice\(-7\)\.toUpperCase\(\)/g
], 'order.id.toUpperCase()');

