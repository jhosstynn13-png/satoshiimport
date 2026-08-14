const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `  return (
    <div className="space-y-8">`,
  `  return (
    <>
    <div className="space-y-8">`
);

code = code.replace(
  `      </AnimatePresence>
    </div>
  );
}`,
  `      </AnimatePresence>
    </div>
    </>
  );
}`
);

// If the previous replace didn't work because it doesn't match the end exactly:
const lastChars = code.slice(-50);
console.log(lastChars);

fs.writeFileSync('src/components/Users.tsx', code);
