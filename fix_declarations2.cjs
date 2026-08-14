const fs = require('fs');

let catCode = fs.readFileSync('src/components/Catalog.tsx', 'utf8');
catCode = catCode.replace(
  "export default function Catalog({ catalog, searchQuery }: CatalogProps) {",
  "export default function Catalog({ catalog, searchQuery }: CatalogProps) {\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 50;"
);
fs.writeFileSync('src/components/Catalog.tsx', catCode);

let pubCode = fs.readFileSync('src/components/public/PublicCatalog.tsx', 'utf8');
pubCode = pubCode.replace(
  "export default function PublicCatalog({ catalog, onAddToCart }: PublicCatalogProps) {",
  "export default function PublicCatalog({ catalog, onAddToCart }: PublicCatalogProps) {\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 30;"
);
fs.writeFileSync('src/components/public/PublicCatalog.tsx', pubCode);
