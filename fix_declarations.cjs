const fs = require('fs');

let catCode = fs.readFileSync('src/components/Catalog.tsx', 'utf8');
// Find the top of the component to insert state
catCode = catCode.replace(
  "export default function Catalog({ data, onBack }: CatalogProps) {",
  "export default function Catalog({ data, onBack }: CatalogProps) {\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 50;"
);
// Also need to fix where I put the `setCurrentPage(1)` which might have failed to replace or created syntax errors.
// Wait, if it didn't find `const [searchTerm...` then it didn't replace it.

fs.writeFileSync('src/components/Catalog.tsx', catCode);

let pubCode = fs.readFileSync('src/components/public/PublicCatalog.tsx', 'utf8');
pubCode = pubCode.replace(
  "export default function PublicCatalog({ catalog, onAddToCart }: PublicCatalogProps) {",
  "export default function PublicCatalog({ catalog, onAddToCart }: PublicCatalogProps) {\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 30;"
);

fs.writeFileSync('src/components/public/PublicCatalog.tsx', pubCode);
