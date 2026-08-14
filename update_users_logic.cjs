const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `  const { data, addUser, updateUser, deleteUser } = catalog;
  const users = data.users || [];`,
  `  const { data, addUser, updateUser, deleteUser, currentUser } = catalog;
  
  let visibleUsers = data.users || [];
  if (currentUser?.role === 'admin') {
    visibleUsers = visibleUsers.filter((u: UserType) => (u.role !== 'admin' && u.role !== 'superadmin') || u.id === currentUser.id);
  }
  const users = visibleUsers;`
);

code = code.replace(
  `      case 'admin': return <span className="px-3 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><ShieldCheck size={10} /> Admin</span>;`,
  `      case 'superadmin': return <span className="px-3 py-1 bg-purple-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><ShieldCheck size={10} /> Super Admin</span>;
      case 'admin': return <span className="px-3 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5"><ShieldCheck size={10} /> Admin</span>;`
);

fs.writeFileSync('src/components/Users.tsx', code);
