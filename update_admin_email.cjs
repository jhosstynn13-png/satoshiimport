const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const targetAdminEmail = `  const isAdminEmail = (email: string) => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'IMPORTSATOSHI@HOTMAIL.COM';
    return email.trim().toUpperCase() === adminEmail.toUpperCase();
  };`;

const replacementAdminEmail = `  const isAdminEmail = (email: string) => {
    const adminEmails = [
      import.meta.env.VITE_ADMIN_EMAIL || 'IMPORTSATOSHI@HOTMAIL.COM',
      'jhosstynn13@gmail.com'
    ];
    return adminEmails.map(e => e.toUpperCase()).includes(email.trim().toUpperCase());
  };`;

code = code.replace(targetAdminEmail, replacementAdminEmail);
fs.writeFileSync('src/components/Auth.tsx', code);
