const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-xs group hover:bg-white/[0.07] transition-all">
            <p className="text-white/50 mb-3 uppercase tracking-[0.2em] font-black">Sync Mode</p>
            <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
              <div className="h-full w-[100%] bg-white animate-pulse"></div>
            </div>
            <p className="text-white/70 leading-relaxed font-medium italic">
              Local Storage Active.
            </p>
          </div>`;

code = code.replace(target, "");

fs.writeFileSync('src/App.tsx', code);
