const fs = require('fs');

let pubCode = fs.readFileSync('src/components/public/PublicCatalog.tsx', 'utf8');
pubCode = pubCode.replace(
  "export default function PublicCatalog({ catalog, initialCategoryName = null }: { catalog: any, initialCategoryName?: string | null }) {",
  "export default function PublicCatalog({ catalog, initialCategoryName = null }: { catalog: any, initialCategoryName?: string | null }) {\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 30;"
);

// We should also replace the pagination reset if we changed variable names
pubCode = pubCode.replace(
  "setActiveCategory(initialCategoryName);\n      setActiveSubcategory(null);\n      setActiveModel(null);\n      setActiveSubmodel(null);",
  "setActiveCategory(initialCategoryName);\n      setActiveSubcategory(null);\n      setActiveModel(null);\n      setActiveSubmodel(null);\n      setCurrentPage(1);"
);

pubCode = pubCode.replace("setSearchQuery(e.target.value)}", "setSearchQuery(e.target.value); setCurrentPage(1); }");

fs.writeFileSync('src/components/public/PublicCatalog.tsx', pubCode);
