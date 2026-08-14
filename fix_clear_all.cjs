const fs = require('fs');

let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const target = `  const clearAll = () => {
    setData({ ...starterData });
    setSelectedCategoryId(starterData.categories[0]?.id || null);
    setSelectedSubcategoryId(starterData.categories[0]?.subcategories[0]?.id || null);
    setSelectedModelId(starterData.categories[0]?.subcategories[0]?.models[0]?.id || null);
  };`;

const replacement = `  const clearAll = () => {
    setData(prev => ({
      ...prev,
      categories: [],
      orders: [],
      customers: [],
      users: prev.users.filter(u => u.role !== 'cliente' && u.role !== 'customer' && u.role !== 'user') // Keep admins and other non-client roles
    }));
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setSelectedModelId(null);
    setSelectedSubmodelId(null);
  };`;

code = code.replace(target, replacement);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
