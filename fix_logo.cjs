const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{catalog.data.storeSettings?.logo ? (
            <div className="h-14 flex items-center justify-center shrink-0">
              <img src={catalog.data.storeSettings.logo} alt="Logo" className="h-full w-auto object-contain" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0">
              <GSLogo />
            </div>
          )}`;

const replacement = `{catalog.data.storeSettings?.logo ? (
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <img src={catalog.data.storeSettings.logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0">
              <GSLogo />
            </div>
          )}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx updated');
} else {
  console.log('Target not found in App.tsx');
}
