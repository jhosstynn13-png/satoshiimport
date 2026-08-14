const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// The best way to catch Structural changes (addCategory, addSubcategory, etc) 
// is to add a small useEffect that listens to data.categories and saves the structure.
// But we have to be careful not to save too frequently or cause loops.

// Actually, we can just replace the specific structural functions to fire saveCategoriesToDb.

const structFuncs = [
  'addCategory', 'deleteCategory', 'addSubcategory', 'deleteSubcategory', 
  'addModel', 'deleteModel', 'addSubmodel', 'deleteSubmodel'
];

for (const func of structFuncs) {
  const regex = new RegExp(`const ${func} =.*?setData\\(prev => \\(\\{`, 's');
  code = code.replace(regex, (match) => {
    return match + `\n      ...prev, /* NOTE: Structural sync is handled by a side effect below */ `;
  });
}

// Add a side-effect that watches for structural changes and saves them
const sideEffect = `
  // Sync structural changes to DB whenever categories array changes length or structure
  // (We debounce this slightly by using a useMemo/useEffect combo, or just direct useEffect)
  useEffect(() => {
    // Only save if we actually have data loaded from DB (prevents overwriting on first boot before load)
    if (data.categories.length > 0) {
      // NOTE: saveCategoriesToDb strips products, so it's safe to pass data.categories
      saveCategoriesToDb(data.categories, data.storeSettings).catch(console.error);
    }
  }, [data.categories, data.storeSettings]);
`;

code = code.replace("return {", sideEffect + "\n  return {");

fs.writeFileSync('src/hooks/useCatalog.ts', code);
