const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const targetProps = `  isModal?: boolean;
}`;
const replacementProps = `  isModal?: boolean;
  clientLoginEnabled?: boolean;
}`;
code = code.replace(targetProps, replacementProps);

const targetComp = `export default function Auth({ onLogin, onVerifyCredentials, onRegister, onGuestLogin, isModal = false }: AuthProps) {`;
const replacementComp = `export default function Auth({ onLogin, onVerifyCredentials, onRegister, onGuestLogin, isModal = false, clientLoginEnabled = true }: AuthProps) {`;
code = code.replace(targetComp, replacementComp);

fs.writeFileSync('src/components/Auth.tsx', code);
