const fs = require('fs');

let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const addProductText = `  const addProduct = (submodelId: string, productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: uid(),
      createdAt: Date.now(),
      sizes: productData.sizes || [],
      status: productData.status || 'active'
    };

    addLog(\`Producto añadido: \${newProduct.name} - SKU: \${newProduct.sku}\`, 'success');

    setData(prev => {
      const newCategories = prev.categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          models: (sub.models || []).map(mod => ({
            ...mod,
            submodels: (mod.submodels || []).map(smod => {
              if (smod.id === submodelId) {
                return {
                  ...smod,
                  products: [...(smod.products || []), newProduct]
                };
              }
              return smod;
            })
          }))
        }))
      }));
      return { ...prev, categories: newCategories };
    });
  };`;

const addProductsBulkText = addProductText + `

  const addProductsBulk = (submodelId: string, productsData: Omit<Product, 'id' | 'createdAt'>[]) => {
    const newProducts = productsData.map(productData => ({
      ...productData,
      id: uid(),
      createdAt: Date.now(),
      sizes: productData.sizes || [],
      status: productData.status || 'active'
    }));

    addLog(\`Añadidos \${newProducts.length} productos masivamente\`, 'success');

    setData(prev => {
      const newCategories = prev.categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          models: (sub.models || []).map(mod => ({
            ...mod,
            submodels: (mod.submodels || []).map(smod => {
              if (smod.id === submodelId) {
                return {
                  ...smod,
                  products: [...(smod.products || []), ...newProducts]
                };
              }
              return smod;
            })
          }))
        }))
      }));
      return { ...prev, categories: newCategories };
    });
  };`;

code = code.replace(addProductText, addProductsBulkText);

code = code.replace(
  'addProduct,\n    updateProduct',
  'addProduct,\n    addProductsBulk,\n    updateProduct'
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
