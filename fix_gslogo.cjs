const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetLogo = `const GSLogo = () => (
  <img 
    src="https://yimuttzzvijmvlxqleor.supabase.co/storage/v1/object/public/productos/LOGO_SECO%20(1).png" 
    alt="Logo SATOSHIMPORT" 
    className="w-full h-full object-contain p-1"
  />
);`;

const replacementLogo = `const GSLogo = () => (
  <div className="w-full h-full flex items-center justify-center font-black text-black text-2xl italic">
    S
  </div>
);`;

code = code.replace(targetLogo, replacementLogo);

fs.writeFileSync('src/App.tsx', code);
