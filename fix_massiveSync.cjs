const fs = require('fs');
let code = fs.readFileSync('src/dbSync.ts', 'utf8');

code = code.replace(
  /const allProducts = data\.categories\.flatMap\(c => \s*c\.subcategories\.flatMap\(s => \s*s\.models\.flatMap\(m => \s*m\.submodels\.flatMap\(sm => \s*sm\.products\.map\(p => \(\{ \.\.\.p, categoryId: c\.id, subcategoryId: s\.id, modelId: m\.id, submodelId: sm\.id \}\)\)\s*\)\s*\)\s*\)\s*\);/g,
  `const allProducts = (data.categories || []).flatMap(c => 
    (c.subcategories || []).flatMap(s => 
      (s.models || []).flatMap(m => 
        (m.submodels || []).flatMap(sm => 
          (sm.products || []).map(p => ({ ...p, categoryId: c.id, subcategoryId: s.id, modelId: m.id, submodelId: sm.id }))
        )
      )
    )
  );`
);

fs.writeFileSync('src/dbSync.ts', code);
