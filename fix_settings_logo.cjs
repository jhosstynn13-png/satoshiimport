const fs = require('fs');
let code = fs.readFileSync('src/components/StoreSettings.tsx', 'utf8');

const target = `{editSettings.logo ? (
                    <img src={editSettings.logo} alt="Logo" className="h-full w-auto object-contain rounded-lg" />
                  ) : (
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                      <Store className="text-white/20" size={24} />
                    </div>
                  )}`;

const replacement = `{editSettings.logo ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-white/5">
                      <img src={editSettings.logo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                      <Store className="text-white/20" size={24} />
                    </div>
                  )}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/StoreSettings.tsx', code);
  console.log('StoreSettings updated');
} else {
  console.log('Target not found in StoreSettings');
}
