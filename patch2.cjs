const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// Disable Firebase setDoc
code = code.replace(
  'setDoc(doc(db, "catalogs", "main"), JSON.parse(JSON.stringify(newData)));',
  '// setDoc(doc(db, "catalogs", "main"), JSON.parse(JSON.stringify(newData))); // Disabled to avoid quota issues'
);

// Disable Firebase onSnapshot
code = code.replace(
  /useEffect\(\(\) => \{\s*const unsub = onSnapshot[\s\S]*?return \(\) => unsub\(\);\s*\}, \[\]\);/,
  `useEffect(() => {
    // Firebase sync disabled temporarily to avoid quota limits
    // const unsub = onSnapshot(doc(db, "catalogs", "main"), (snapshot) => { ... });
    // return () => unsub();
  }, []);`
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
