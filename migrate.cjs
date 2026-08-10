const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/categories.json', 'utf8'));

data.forEach(cat => {
  cat.subcategories.forEach(sub => {
    sub.models.forEach(mod => {
      if (mod.products) {
        mod.submodels = [
          {
            id: 'submod-' + Date.now() + Math.floor(Math.random() * 1000),
            name: 'GENERAL',
            products: mod.products
          }
        ];
        delete mod.products;
      }
    });
  });
});

fs.writeFileSync('src/data/categories.json', JSON.stringify(data, null, 2));
