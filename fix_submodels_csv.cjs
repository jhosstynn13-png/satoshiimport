const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

code = code.replace(
  /let submodel = model\.submodels\.find\(sm => sm\.name === 'ESTÁNDAR'\);/g,
  `
      if (!model.submodels) model.submodels = [];
      let submodel = model.submodels.find(sm => sm.name === 'ESTÁNDAR');
  `
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
