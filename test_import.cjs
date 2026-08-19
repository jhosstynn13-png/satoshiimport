const fs = require('fs');

const uid = () => 'test-id-' + Math.random().toString(36).slice(2);

let data = {
  categories: [{ id: "cat-1", name: "CALZADO", subcategories: [] }],
  storeSettings: {}
};

const text = "CALZADO,SNEAKERS,Nike Air,100,SKU1,url,desc\nCALZADO,BOOTS,Timberland,150,SKU2,url,desc";

const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
const newData = JSON.parse(JSON.stringify(data)); // Fixed deep clone

lines.forEach(line => {
    const parts = line.split(',');
    const [category, subcategory, name, price, sku, image, ...descParts] = parts;

    let cat = newData.categories.find(c => c.name.toUpperCase() === category.trim().toUpperCase());
    if (!cat) {
      cat = { id: uid(), name: category.trim().toUpperCase(), subcategories: [] };
      newData.categories.push(cat);
    }

    let sub = cat.subcategories.find(s => s.name.toUpperCase() === subcategory.trim().toUpperCase());
    if (!sub) {
      sub = { id: uid(), name: subcategory.trim().toUpperCase(), models: [] };
      cat.subcategories.push(sub);
    }

    let model = sub.models.find(m => m.name === 'GENERAL');
    if (!model) {
      model = { id: uid(), name: 'GENERAL', submodels: [] };
      sub.models.push(model);
    }
    
    if (!model.submodels) model.submodels = [];
    let submodel = model.submodels.find(sm => sm.name === 'ESTÁNDAR');

    if (!submodel) {
       submodel = { id: uid(), name: 'ESTÁNDAR', products: [] };
       model.submodels.push(submodel);
    }

    if (!submodel.products) submodel.products = [];
    submodel.products.push({
      id: uid(),
      name: name.trim(),
      price: Number(price),
      sku: (sku || '').trim(),
      image: (image || '').trim(),
      description: descParts.join(',').trim(),
      createdAt: Date.now(),
      sizes: [],
      status: 'active'
    });
});

console.log(JSON.stringify(newData.categories, null, 2));

const cleanCategories = newData.categories.map(cat => ({
  ...cat,
  subcategories: cat.subcategories?.map(sub => ({
    ...sub,
    models: sub.models?.map(mod => ({
      ...mod,
      submodels: mod.submodels?.map(submod => ({
        ...submod,
        products: []
      }))
    }))
  }))
}));

console.log("CLEAN:", JSON.stringify(cleanCategories, null, 2));
