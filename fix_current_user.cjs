const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

if (!code.includes('const activeUser =')) {
  code = code.replace(
    `const [currentUser, setCurrentUser] = useState<User | null>(() => {`,
    `const [currentUser, setCurrentUser] = useState<User | null>(() => {`
  );
  
  code = code.replace(
    `  useEffect(() => {
    if (!currentUser) {`,
    `  const activeUser = currentUser 
    ? (data.users.find(u => u.id === currentUser.id) || currentUser) 
    : null;

  useEffect(() => {
    if (!currentUser) {`
  );

  code = code.replace(
    `    register,
    currentUser,
    importCsv,`,
    `    register,
    currentUser: activeUser,
    importCsv,`
  );
  
  fs.writeFileSync('src/hooks/useCatalog.ts', code);
}
