const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

code = code.replace(
  `      // Ensure a model exists (we'll name it GENERAL if not specified or just use first one)
      let model = sub.models.find(m => m.name === 'GENERAL');
      if (!model) {
        model = { id: uid(), name: 'GENERAL', products: [] };
        sub.models.push(model);
      }

      model.products.push({`,
  `      // Ensure a model exists (we'll name it GENERAL if not specified or just use first one)
      let model = sub.models.find(m => m.name === 'GENERAL');
      if (!model) {
        model = { id: uid(), name: 'GENERAL', submodels: [] };
        sub.models.push(model);
      }
      
      let submodel = model.submodels.find(sm => sm.name === 'ESTÁNDAR');
      if (!submodel) {
         submodel = { id: uid(), name: 'ESTÁNDAR', products: [] };
         model.submodels.push(submodel);
      }

      submodel.products.push({`
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
