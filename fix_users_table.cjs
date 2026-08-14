const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `<div className="lg:col-span-2">`,
  `<div className="lg:col-span-2 flex flex-col h-full">`
);

code = code.replace(
  `<div className="glass rounded-[60px] overflow-hidden border-white/5 shadow-3xl bg-white/[0.01]">`,
  `<div className="glass rounded-[60px] overflow-hidden border-white/5 shadow-3xl bg-white/[0.01] flex-1 flex flex-col">`
);

code = code.replace(
  `<div className="p-10 border-b border-white/5 bg-white/5">`,
  `<div className="p-10 border-b border-white/5 bg-white/5 shrink-0">`
);

code = code.replace(
  `<div className="overflow-x-auto">`,
  `<div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">`
);

fs.writeFileSync('src/components/Users.tsx', code);
