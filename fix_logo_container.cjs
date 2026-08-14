const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            
            {catalog.data.storeSettings?.logo ? (
              <img src={catalog.data.storeSettings.logo} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <GSLogo />
            )}

          </div>`;

const replacement = `<div className="flex items-center gap-4 mb-12 px-2">
          {catalog.data.storeSettings?.logo ? (
            <div className="h-14 flex items-center justify-center shrink-0">
              <img src={catalog.data.storeSettings.logo} alt="Logo" className="h-full w-auto object-contain" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0">
              <GSLogo />
            </div>
          )}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
