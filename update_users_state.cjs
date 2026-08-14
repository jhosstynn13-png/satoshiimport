const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

const targetState = `  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    phone: '',
    password: '',
    role: 'client' as UserRole
  });`;

const replacementState = `  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    phone: '',
    password: '',
    role: 'client' as UserRole
  });
  
  // Security Modal States
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [targetVerifyEmail, setTargetVerifyEmail] = useState('');
  const [pendingUpdatePayload, setPendingUpdatePayload] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');`;

code = code.replace(targetState, replacementState);
fs.writeFileSync('src/components/Users.tsx', code);
