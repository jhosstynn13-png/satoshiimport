const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const target = `  React.useEffect(() => {
    let timer: NodeJS.Timeout;`;

const replacement = `  React.useEffect(() => {
    if (!clientLoginEnabled && !isLogin) {
      setIsLogin(true);
    }
  }, [clientLoginEnabled, isLogin]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/Auth.tsx', code);
