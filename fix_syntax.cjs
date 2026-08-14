const fs = require('fs');
let pubCode = fs.readFileSync('src/components/public/PublicCatalog.tsx', 'utf8');
pubCode = pubCode.replace(
  "onChange={(e) => setSearchQuery(e.target.value); setCurrentPage(1); }",
  "onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}"
);
// Also for clicks on categories
pubCode = pubCode.replace(
  "onClick={() => { setActiveCategory(cat.name); setActiveSubcategory(null); setActiveModel(null); setActiveSubmodel(null); }}",
  "onClick={() => { setActiveCategory(cat.name); setActiveSubcategory(null); setActiveModel(null); setActiveSubmodel(null); setCurrentPage(1); }}"
);
pubCode = pubCode.replace(
  "onClick={() => { setActiveSubcategory(sub.name); setActiveModel(null); setActiveSubmodel(null); }}",
  "onClick={() => { setActiveSubcategory(sub.name); setActiveModel(null); setActiveSubmodel(null); setCurrentPage(1); }}"
);
pubCode = pubCode.replace(
  "onClick={() => { setActiveModel(mod.name); setActiveSubmodel(null); }}",
  "onClick={() => { setActiveModel(mod.name); setActiveSubmodel(null); setCurrentPage(1); }}"
);
pubCode = pubCode.replace(
  "onClick={() => setActiveSubmodel(smod.name)}",
  "onClick={() => { setActiveSubmodel(smod.name); setCurrentPage(1); }}"
);
fs.writeFileSync('src/components/public/PublicCatalog.tsx', pubCode);
