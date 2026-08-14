const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `    <div className="flex min-h-screen relative overflow-hidden bg-black selection:bg-white selection:text-black">`,
  `    <div className="flex absolute inset-0 overflow-hidden bg-black selection:bg-white selection:text-black">`
);

code = code.replace(
  `<aside className="w-72 glass h-screen sticky top-0 flex flex-col p-8 z-20 rounded-r-[48px] border-l-0 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">`,
  `<aside className="w-72 glass h-full flex flex-col p-8 z-20 rounded-r-[48px] border-l-0 shadow-[20px_0_40px_rgba(0,0,0,0.5)] shrink-0">`
);

code = code.replace(
  `<main className="flex-1 flex flex-col min-w-0 relative z-10">`,
  `<main className="flex-1 flex flex-col h-full min-w-0 relative z-10">`
);

code = code.replace(
  `<div className="p-12 pb-24 overflow-y-auto h-[calc(100vh-128px)] custom-scrollbar">`,
  `<div className="flex-1 p-12 pb-24 overflow-y-auto custom-scrollbar">`
);

code = code.replace(
  `            <motion.div`,
  `            <motion.div className="h-full flex flex-col"`
);

fs.writeFileSync('src/App.tsx', code);
