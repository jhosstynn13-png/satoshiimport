const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicLayout.tsx', 'utf8');

const target = `<div className="w-24 h-24 bg-white/5 rounded-3xl mx-auto flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            {catalog.data?.storeSettings?.logo ? (
              <img src={catalog.data.storeSettings.logo} alt="Logo" className="w-12 h-auto object-contain" />
            ) : (
              <div className="text-4xl font-black italic">S</div>
            )}
          </div>`;

const replacement = `<div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            {catalog.data?.storeSettings?.logo ? (
              <img src={catalog.data.storeSettings.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="text-4xl font-black italic">S</div>
            )}
          </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/public/PublicLayout.tsx', code);
  console.log('PublicLayout updated');
} else {
  console.log('Target not found in PublicLayout');
}
