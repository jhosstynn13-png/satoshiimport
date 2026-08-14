const fs = require('fs');
let code = fs.readFileSync('src/components/Orders.tsx', 'utf8');

code = code.replace(
  `<div className="space-y-12">`,
  `<div className="space-y-12 flex flex-col h-full">`
);

code = code.replace(
  `<div className="glass rounded-[60px] overflow-hidden border-white/5 shadow-3xl">`,
  `<div className="glass rounded-[60px] overflow-hidden border-white/5 shadow-3xl flex-1 flex flex-col">`
);

code = code.replace(
  `<div className="p-10 border-b border-white/5 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">`,
  `<div className="p-10 border-b border-white/5 bg-white/5 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-8">`
);

code = code.replace(
  `<div className="overflow-x-auto">`,
  `<div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">`
);

fs.writeFileSync('src/components/Orders.tsx', code);
