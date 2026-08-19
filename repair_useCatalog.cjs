const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// 1. Fix register
code = code.replace(
  `    const cat = data.categories.find(c => c.subcategories.some(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId))));
    const sub = cat?.subcategories.find(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId)));
    const mod = sub?.models.find(m => m.submodels.some(sm => sm.id === submodelId));
    if(cat && sub && mod) {
       saveProductToDb(newProduct, cat.id, sub.id, mod.id, submodelId).catch(console.error);
    }`,
  ``
);

code = code.replace(
  /const register = \(\w+: Omit<User, 'id' \| 'createdAt'>\) => \{[\s\S]*?return \{ success: true, user: newUser \};\n  \};/,
  (match) => {
    if (!match.includes('saveUserToDb(newUser)')) {
      return match.replace(
        `setData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));`,
        `saveUserToDb(newUser).catch(console.error);\n    setData(prev => ({\n      ...prev,\n      users: [...prev.users, newUser]\n    }));`
      );
    }
    return match;
  }
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
