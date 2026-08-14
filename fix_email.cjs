const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const target = `      // If it's the admin or staff, we use the specific master email if requested, 
      // but usually we send to the provided email which should be the user's email.
      // The user specifically asked for IMPORTSATOSHI@HOTMAIL.COM for admin actions.
      const targetEmail = email.toUpperCase() === 'JHOSSTYNN13@GMAIL.COM' || email.toUpperCase() === 'IMPORTSATOSHI@HOTMAIL.COM' 
        ? 'IMPORTSATOSHI@HOTMAIL.COM' 
        : email;

      await sendVerificationCode(targetEmail, code);
      addLog(\`CÓDIGO DE PROTOCOLO ENVIADO A \${targetEmail}\`, 'warn');`;

const replacement = `      await sendVerificationCode(email, code);
      addLog(\`CÓDIGO DE PROTOCOLO ENVIADO A \${email}\`, 'warn');`;

code = code.replace(target, replacement);
fs.writeFileSync('src/hooks/useCatalog.ts', code);
