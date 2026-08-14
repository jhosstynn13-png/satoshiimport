const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `              <Shield size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 scale-150" />
           </div>

        {/* Users List */}`,
  `              <Shield size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 scale-150" />
           </div>
        </div>

        {/* Users List */}`
);

fs.writeFileSync('src/components/Users.tsx', code);
