const fs = require('fs');

let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// Ensure the local storage gets the updated role for jhosstynn
code = code.replace(
  `    const satoshiIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'importsatoshi@hotmail.com');`,
  `    // Make sure we save it back if it's jhosstynn
    const satoshiIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'importsatoshi@hotmail.com');`
);

code = code.replace(
  `  useEffect(() => {
    if (!currentUser) {
      loginAsGuest();
    }
  }, []);`,
  `  useEffect(() => {
    if (!currentUser) {
      loginAsGuest();
    } else {
      // Sync local storage session role with active user role
      if (activeUser && activeUser.role !== currentUser.role) {
        setCurrentUser(activeUser);
        localStorage.setItem(STORAGE_KEY + "_session", JSON.stringify(activeUser));
      }
    }
  }, [currentUser, activeUser]);`
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
