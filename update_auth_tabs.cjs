const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const tabsTarget = `<div className="flex bg-white/5 p-2 rounded-[24px] mb-10 overflow-hidden">
            <button 
              onClick={() => setIsLogin(true)}
              className={\`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all \${isLogin ? 'bg-white text-black' : 'text-white/60 hover:text-white'}\`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={\`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all \${!isLogin ? 'bg-white text-black' : 'text-white/60 hover:text-white'}\`}
            >
              Registro
            </button>
          </div>`;

const tabsReplacement = `{clientLoginEnabled ? (
          <div className="flex bg-white/5 p-2 rounded-[24px] mb-10 overflow-hidden">
            <button 
              onClick={() => setIsLogin(true)}
              className={\`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all \${isLogin ? 'bg-white text-black' : 'text-white/60 hover:text-white'}\`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={\`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all \${!isLogin ? 'bg-white text-black' : 'text-white/60 hover:text-white'}\`}
            >
              Registro
            </button>
          </div>
          ) : (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-10 text-center">
            <p className="text-red-400 text-xs font-bold uppercase">La tienda se encuentra en mantenimiento privado. Solo personal autorizado puede acceder en este momento.</p>
          </div>
          )}`;

code = code.replace(tabsTarget, tabsReplacement);

fs.writeFileSync('src/components/Auth.tsx', code);
