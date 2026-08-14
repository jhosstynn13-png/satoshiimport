const fs = require('fs');
let code = fs.readFileSync('src/components/Customers.tsx', 'utf8');

code = code.replace(
  `<div className="space-y-8">`,
  `<div className="space-y-8 flex flex-col h-full">`
);

code = code.replace(
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">`,
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">`
);

code = code.replace(
  `<div className="lg:col-span-2 space-y-4">`,
  `<div className="lg:col-span-2 flex flex-col h-full">`
);

code = code.replace(
  `<div className="glass rounded-[40px] overflow-hidden">`,
  `<div className="glass rounded-[40px] overflow-hidden flex-1 flex flex-col min-h-0">`
);

code = code.replace(
  `<div className="overflow-x-auto">`,
  `<div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">`
);

// right column
code = code.replace(
  `<div className="lg:col-span-1 space-y-4">`,
  `<div className="lg:col-span-1 flex flex-col h-full">`
);

code = code.replace(
  `<div className="glass rounded-[40px] p-8 h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">`,
  `<div className="glass rounded-[40px] p-8 flex-1 overflow-y-auto custom-scrollbar">`
);

fs.writeFileSync('src/components/Customers.tsx', code);
