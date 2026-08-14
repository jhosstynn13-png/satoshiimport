const fs = require('fs');
let code = fs.readFileSync('src/components/public/PaymentView.tsx', 'utf8');

code = code.replace(
  "</span>Envío</span>\\n          </div>\\n          <div className={\`w-12 h-px \\${step >= 2 ? 'bg-white' : 'bg-white/5'}\`} />\\n          <div className=\"flex items-center gap-2\">\\n            <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs \\${step >= 2 ? 'bg-white text-black' : 'bg-white/5 text-white/20'}\`}>2</div>\\n            <span className={\`text-[10px] font-black uppercase tracking-widest \\${step >= 2 ? 'text-white' : 'text-white/20'}\`}>Pago</span>",
  "</span>Envío</span>\\n          </div>\\n          <div className={\`w-12 h-px \\${step >= 2 ? 'bg-white' : 'bg-white/5'}\`} />\\n          <div className=\"flex items-center gap-2\">\\n            <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs \\${step >= 2 ? 'bg-white text-black' : 'bg-white/5 text-white/20'}\`}>2</div>\\n            <span className={\`text-[10px] font-black uppercase tracking-widest \\${step >= 2 ? 'text-white' : 'text-white/20'}\`}>Pedido</span>"
);

// simpler replace:
code = code.replace(
  '<span className={`text-[10px] font-black uppercase tracking-widest ${step >= 2 ? \'text-white\' : \'text-white/20\'}`}>Pago</span>',
  '<span className={`text-[10px] font-black uppercase tracking-widest ${step >= 2 ? \'text-white\' : \'text-white/20\'}`}>Pedido</span>'
);

// We should also replace the state usage if we want, but "method", "timeLeft", "screenshot" are now unused, we can leave them or remove them.
fs.writeFileSync('src/components/public/PaymentView.tsx', code);
