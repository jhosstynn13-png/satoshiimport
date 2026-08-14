const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

// Add edit user state
code = code.replace(
  "const [form, setForm] = useState({",
  "const [editingUserId, setEditingUserId] = useState<string | null>(null);\n  const [form, setForm] = useState({"
);

// Update handleAddUser to handle edit
const addFunc = `
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.dni) return;
    
    if (editingUserId) {
      updateUser(editingUserId, {
        firstName: form.firstName,
        lastName: form.lastName,
        name: \`\${form.firstName} \${form.lastName}\`.toUpperCase(),
        email: form.email,
        dni: form.dni,
        phone: form.phone,
        role: form.role
      });
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
`;
code = code.replace(/const handleAddUser =[\s\S]*?setForm\(\{[\s\S]*?\}\);\s*\};/, addFunc.trim());

// Update button text
code = code.replace(
  ">\\s*Finalizar Registro\\s*</button>",
  ">{editingUserId ? 'Actualizar Usuario' : 'Finalizar Registro'}</button>"
);

// Add cancel button if editing
code = code.replace(
  /(<button[^>]*type="submit"[^>]*>[\s\S]*?<\/button>)/,
  `$1\n                 {editingUserId && (\n                    <button \n                       type="button"\n                       onClick={() => { setEditingUserId(null); setForm({ firstName: '', lastName: '', email: '', dni: '', phone: '', password: '', role: 'client' }); }}\n                       className="w-full py-4 mt-2 bg-white/5 text-white/60 font-black uppercase italic tracking-widest text-[10px] rounded-[24px] hover:bg-white/10 transition-all"\n                    >\n                       Cancelar Edición\n                    </button>\n                 )}`
);

// Update Edit button in table
const editBtn = `
                                   <button 
                                      className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all"
                                      onClick={() => {
                                         setEditingUserId(user.id);
                                         setForm({
                                            firstName: user.firstName || user.name.split(' ')[0] || '',
                                            lastName: user.lastName || user.name.split(' ').slice(1).join(' ') || '',
                                            email: user.email,
                                            dni: user.dni || '',
                                            phone: user.phone || '',
                                            password: '',
                                            role: user.role
                                         });
                                      }}
                                   >
`;
code = code.replace(/<button\s*className="p-3 bg-white\/5 hover:bg-white hover:text-black rounded-xl transition-all"\s*onClick=\{\(\) => \{\s*const newRole[^}]*\}\}\s*>/, editBtn.trim());

fs.writeFileSync('src/components/Users.tsx', code);
