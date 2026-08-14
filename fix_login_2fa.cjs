const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const target = `    if (isLogin) {
      // Check if it's admin login and require 2FA
      if (isAdminEmail(email)) {
        // First verify credentials before bothering with security code
        if (onVerifyCredentials) {
          const verifyRes = onVerifyCredentials(email, password);
          if (!verifyRes.success) {
            setError(verifyRes.message || 'Credenciales de administrador incorrectas.');
            setLoading(false);
            return;
          }
        }

        try {
          const code = generateCode();
          setSentCode(code);
          setTempAdminData({ email, password });
          
          await sendVerificationCode(email, code);
          setShowVerification(true);
          setResendCooldown(60);
          setLoading(false);
          return;
        } catch (err: any) {
          setError('Error al enviar el código de seguridad: ' + (err.message || 'Desconocido'));
          setLoading(false);
          return;
        }
      }`;

const replacement = `    if (isLogin) {
      let isUserAdmin = false;
      if (onVerifyCredentials) {
        const verifyRes = onVerifyCredentials(email, password);
        if (!verifyRes.success) {
          setError(verifyRes.message || 'Credenciales incorrectas.');
          setLoading(false);
          return;
        }
        if (verifyRes.user && verifyRes.user.role === 'admin') {
          isUserAdmin = true;
        }
      }

      if (isUserAdmin) {
        try {
          const code = generateCode();
          setSentCode(code);
          setTempAdminData({ email, password });
          
          await sendVerificationCode(email, code);
          setShowVerification(true);
          setResendCooldown(60);
          setLoading(false);
          return;
        } catch (err: any) {
          setError('Error al enviar el código de seguridad: ' + (err.message || 'Desconocido'));
          setLoading(false);
          return;
        }
      }`;

code = code.replace(target, replacement);

// We should also remove the isAdminEmail function since we don't need it anymore.
const adminFuncTarget = `  const isAdminEmail = (email: string) => {
    const adminEmails = [
      import.meta.env.VITE_ADMIN_EMAIL || 'IMPORTSATOSHI@HOTMAIL.COM',
      'jhosstynn13@gmail.com'
    ];
    return adminEmails.map(e => e.toUpperCase()).includes(email.trim().toUpperCase());
  };`;

code = code.replace(adminFuncTarget, "");

fs.writeFileSync('src/components/Auth.tsx', code);
