const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

const targetHandler = `  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.dni) return;
    
    if (editingUserId) {
      const updatePayload: Partial<UserType> = {
        firstName: form.firstName,
        lastName: form.lastName,
        name: \`\${form.firstName} \${form.lastName}\`.toUpperCase(),
        email: form.email,
        dni: form.dni,
        phone: form.phone,
        role: form.role
      };
      
      if (form.password) {
        updatePayload.password = form.password;
      }
      
      updateUser(editingUserId, updatePayload);
      setEditingUserId(null);
    } else {
      addUser({
        ...form,
        name: \`\${form.firstName} \${form.lastName}\`.toUpperCase(),
        password: form.password || '123456'
      });
    }
    
    setForm({ 
      firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' 
    });
  };`;

const replacementHandler = `  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.dni) return;
    
    if (editingUserId) {
      const updatePayload: Partial<UserType> = {
        firstName: form.firstName,
        lastName: form.lastName,
        name: \`\${form.firstName} \${form.lastName}\`.toUpperCase(),
        email: form.email,
        dni: form.dni,
        phone: form.phone,
        role: form.role
      };
      
      if (form.password) {
        updatePayload.password = form.password;
      }
      
      const originalUser = users.find(u => u.id === editingUserId);
      if (originalUser && originalUser.role === 'admin') {
        // Require 2FA if we are modifying an existing admin
        try {
          const code = generateCode();
          setSentCode(code);
          setTargetVerifyEmail(originalUser.email);
          setPendingUpdatePayload({ id: editingUserId, payload: updatePayload });
          
          await sendVerificationCode(originalUser.email, code);
          setShowVerification(true);
          return; // Stop and wait for verification
        } catch (err: any) {
          alert('Error al enviar el código de seguridad: ' + err.message);
          return;
        }
      }
      
      updateUser(editingUserId, updatePayload);
      setEditingUserId(null);
    } else {
      addUser({
        ...form,
        name: \`\${form.firstName} \${form.lastName}\`.toUpperCase(),
        password: form.password || '123456'
      });
    }
    
    setForm({ 
      firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' 
    });
  };

  const handleVerifyCode = () => {
    setVerifyError('');
    setIsVerifying(true);
    
    if (verificationCode.trim().toUpperCase() === sentCode.toUpperCase()) {
      if (pendingUpdatePayload) {
        updateUser(pendingUpdatePayload.id, pendingUpdatePayload.payload);
      }
      // Reset everything
      setEditingUserId(null);
      setForm({ firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' });
      setShowVerification(false);
      setVerificationCode('');
      setSentCode('');
      setPendingUpdatePayload(null);
      setTargetVerifyEmail('');
    } else {
      setVerifyError('Código de seguridad incorrecto.');
    }
    setIsVerifying(false);
  };`;

code = code.replace(targetHandler, replacementHandler);
fs.writeFileSync('src/components/Users.tsx', code);
