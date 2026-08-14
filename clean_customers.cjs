const fs = require('fs');
let code = fs.readFileSync('src/components/Customers.tsx', 'utf8');

code = code.replace(
  `          <div className="glass rounded-[32px] p-2 flex items-center gap-2">
            <div className="pl-6 text-white/40">
              <Search size={18} />
            </div>
            
          </div>`,
  ""
);

fs.writeFileSync('src/components/Customers.tsx', code);
