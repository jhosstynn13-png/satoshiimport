const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `      </AnimatePresence>
    </div>
    </>
  );
}`,
  `      </AnimatePresence>
    </>
  );
}`
);

fs.writeFileSync('src/components/Users.tsx', code);
