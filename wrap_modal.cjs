const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `{/* 2FA Verification Modal */}
      {showVerification && (`,
  `{/* 2FA Verification Modal */}
      <AnimatePresence>
      {showVerification && (`
);

code = code.replace(
  `        </div>
      )}
    </div>`,
  `        </div>
      )}
      </AnimatePresence>
    </div>`
);

fs.writeFileSync('src/components/Users.tsx', code);
