const fs = require('fs');
console.log(fs.readFileSync('src/components/Catalog.tsx', 'utf8').includes('const [currentPage, setCurrentPage]'));
console.log(fs.readFileSync('src/components/public/PublicCatalog.tsx', 'utf8').includes('const [currentPage, setCurrentPage]'));
