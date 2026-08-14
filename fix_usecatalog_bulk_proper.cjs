const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const newFunction = `
  const addProductsBulk = (submodelId: string, productsData: Omit<Product, 'id' | 'createdAt'>[]) => {
    const newProducts = productsData.map(productData => ({
      ...productData,
      id: uid(),
      createdAt: Date.now(),
      sizes: productData.sizes || [],
      status: productData.status || 'active'
    }));

    addLog(\`Añadidos \${newProducts.length} productos masivamente\`, 'success');

    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          models: sub.models.map(model => {
            return {
              ...model,
              submodels: model.submodels.map(submodel => {
                if (submodel.id === submodelId) {
                  return {
                    ...submodel,
                    products: [...submodel.products, ...newProducts]
                  };
                }
                return submodel;
              })
            };
          })
        }))
      }))
    }));
  };
`;

const anchor = "    addLog(`Producto actualizado: ${updatedProduct.name}`, 'info');";
// Wait, I can just find the end of `addProduct` which is just before `const updateProduct = `
const updateProductIndex = code.indexOf("  const updateProduct =");
if (updateProductIndex !== -1) {
  code = code.substring(0, updateProductIndex) + newFunction + code.substring(updateProductIndex);
  fs.writeFileSync('src/hooks/useCatalog.ts', code);
}
