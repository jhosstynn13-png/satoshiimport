const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// Replace the parent grid with flex
code = code.replace(
  '<div className="grid grid-cols-1 xl:grid-cols-[200px_200px_200px_200px_1fr] gap-4">',
  '<div className="flex overflow-x-auto gap-4 custom-scrollbar pb-6 w-full items-stretch">'
);

// Add width constraints to the 4 category columns
// They are defined as: <div className="glass rounded-[40px] p-5 flex flex-col h-[calc(100vh-250px)] shadow-2xl relative overflow-hidden group">
// Let's add min-w-[200px] w-[200px] flex-shrink-0 to them.
code = code.replace(
  /<div className="glass rounded-\[40px\] p-5 flex flex-col h-\[calc\(100vh-250px\)\] shadow-2xl relative overflow-hidden group">/g,
  '<div className="glass rounded-[40px] p-5 flex flex-col h-[calc(100vh-250px)] shadow-2xl relative overflow-hidden group min-w-[220px] w-[220px] flex-shrink-0">'
);

// Add width constraint to the rightmost panel
// Currently: <div className="glass rounded-[40px] p-6 lg:p-8 flex flex-col h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar relative group">
code = code.replace(
  /<div className="glass rounded-\[40px\] p-6 lg:p-8 flex flex-col h-\[calc\(100vh-250px\)\] overflow-y-auto custom-scrollbar relative group">/g,
  '<div className="glass rounded-[40px] p-6 lg:p-8 flex flex-col h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar relative group min-w-[350px] flex-1">'
);

fs.writeFileSync('src/components/Catalog.tsx', code);
