const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `<div className="space-y-12">`,
  `<div className="flex flex-col h-full space-y-12">`
);

code = code.replace(
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">`,
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1">`
);

code = code.replace(
  `<div className="lg:col-span-1 space-y-8">`,
  `<div className="lg:col-span-1 flex flex-col gap-8">`
);

// We want the Directorio table to stretch to the bottom.
// In Users.tsx, what does the right column look like?
