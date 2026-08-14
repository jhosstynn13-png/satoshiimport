const fs = require('fs');
let code = fs.readFileSync('src/components/Backup.tsx', 'utf8');

code = code.replace(
  "const [successMsg, setSuccessMsg] = useState<string | null>(null);",
  "const [successMsg, setSuccessMsg] = useState<string | null>(null);\n  const [confirmClear, setConfirmClear] = useState(false);"
);

fs.writeFileSync('src/components/Backup.tsx', code);
