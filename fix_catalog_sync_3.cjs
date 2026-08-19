const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// 1. addProduct
code = code.replace(
  "addLog(`Producto añadido: ${newProduct.name} - SKU: ${newProduct.sku}`, 'success');\n\n    setData(prev => ({",
  `addLog(\`Producto añadido: \${newProduct.name} - SKU: \${newProduct.sku}\`, 'success');
    const cat = data.categories.find(c => c.subcategories.some(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId))));
    const sub = cat?.subcategories.find(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId)));
    const mod = sub?.models.find(m => m.submodels.some(sm => sm.id === submodelId));
    if(cat && sub && mod) {
       saveProductToDb(newProduct, cat.id, sub.id, mod.id, submodelId).catch(console.error);
    }
    setData(prev => ({`
);

// 2. addProductsBulk
code = code.replace(
  "addLog(`Añadidos ${newProducts.length} productos masivamente`, 'success');\n\n    setData(prev => ({",
  `addLog(\`Añadidos \${newProducts.length} productos masivamente\`, 'success');
    const cat = data.categories.find(c => c.subcategories.some(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId))));
    const sub = cat?.subcategories.find(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId)));
    const mod = sub?.models.find(m => m.submodels.some(sm => sm.id === submodelId));
    if(cat && sub && mod) {
       Promise.all(newProducts.map(p => saveProductToDb(p, cat.id, sub.id, mod.id, submodelId))).catch(console.error);
    }
    setData(prev => ({`
);

// 3. updateProduct
code = code.replace(
  "addLog(`Producto actualizado: ${productId}`, 'success');\n\n    setData(prev => ({",
  `addLog(\`Producto actualizado: \${productId}\`, 'success');
    let foundProduct, fCatId, fSubId, fModId, fSubmodId;
    data.categories.forEach(c => c.subcategories.forEach(s => s.models.forEach(m => m.submodels.forEach(sm => {
      const p = sm.products.find(p => p.id === productId);
      if(p) { foundProduct = p; fCatId = c.id; fSubId = s.id; fModId = m.id; fSubmodId = sm.id; }
    }))));
    if(foundProduct) {
       saveProductToDb({...foundProduct, ...update}, fCatId, fSubId, fModId, fSubmodId).catch(console.error);
    }
    setData(prev => ({`
);

// 4. deleteProduct
code = code.replace(
  "addLog(`Producto eliminado: ${productId}`, 'warn');\n\n    setData(prev => ({",
  `addLog(\`Producto eliminado: \${productId}\`, 'warn');
    deleteProductFromDb(productId).catch(console.error);
    setData(prev => ({`
);

// 5. importCsv
code = code.replace(
  "setData({ ...newData });\n    return imported;",
  `setData({ ...newData });
    massiveSyncToDb(newData).catch(console.error);
    return imported;`
);

// 6. importJson
code = code.replace(
  "setData(imported);\n        setSelectedCategoryId(imported.categories[0]?.id || null);\n        setSelectedSubcategoryId(imported.categories[0]?.subcategories[0]?.id || null);\n        return true;",
  `setData(imported);
        massiveSyncToDb(imported).catch(console.error);
        setSelectedCategoryId(imported.categories[0]?.id || null);
        setSelectedSubcategoryId(imported.categories[0]?.subcategories[0]?.id || null);
        return true;`
);


fs.writeFileSync('src/hooks/useCatalog.ts', code);
