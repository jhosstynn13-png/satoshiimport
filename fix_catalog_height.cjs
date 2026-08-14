const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

code = code.replace(
  `<div className="flex overflow-x-auto gap-4 custom-scrollbar pb-6 w-full items-stretch">`,
  `<div className="flex overflow-x-auto gap-4 custom-scrollbar pb-6 w-full items-stretch h-full">`
);

code = code.replaceAll(`h-[calc(100vh-250px)]`, `h-full`);

fs.writeFileSync('src/components/Catalog.tsx', code);
