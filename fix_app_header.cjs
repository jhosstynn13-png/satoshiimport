const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div className="flex items-center gap-4 mb-12 px-2">
          {catalog.data.storeSettings?.logo ? (
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <img src={catalog.data.storeSettings.logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0">
              <GSLogo />
            </div>
          )}
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-white uppercase italic">{catalog.data.storeSettings?.storeName || 'SATOSHIMPORT'}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-black">Management Portal</p>
          </div>
        </div>`;

const replacement = `<div className="mb-12">
          <div className="bg-white rounded-[28px] p-4 flex items-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.15)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {catalog.data.storeSettings?.logo ? (
              <div className="w-12 h-12 flex items-center justify-center shrink-0 relative z-10">
                <img src={catalog.data.storeSettings.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center shrink-0 relative z-10">
                <GSLogo />
              </div>
            )}
            <div className="flex-1 min-w-0 relative z-10">
              <h1 className="font-black text-[22px] tracking-tighter text-black uppercase truncate leading-none pt-1">
                {catalog.data.storeSettings?.storeName || 'SATOSHIMPORT'}
              </h1>
              <p className="text-[7.5px] text-black/40 uppercase tracking-[0.25em] font-black mt-1.5 truncate">
                Management Portal
              </p>
            </div>
          </div>
        </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx updated');
} else {
  console.log('Target not found in App.tsx');
}
