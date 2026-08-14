const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// 1. Add pagination state
code = code.replace(
  "const [searchTerm, setSearchTerm] = useState('');",
  "const [searchTerm, setSearchTerm] = useState('');\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 50;"
);

// 2. Reset page on filter changes
code = code.replace(
  "onChange={e => setSearchTerm(e.target.value)}",
  "onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}"
);
code = code.replace(
  "onChange={e => setSortOrder(e.target.value as any)}",
  "onChange={e => { setSortOrder(e.target.value as any); setCurrentPage(1); }}"
);

// 3. Slice filteredProducts for current page
code = code.replace(
  "{filteredProducts.map((p: Product, i: number) => (",
  "{filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((p: Product, i: number) => ("
);

// 4. Add pagination controls
const newControls = `
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-4 py-8">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black uppercase tracking-widest text-[10px]"
            >
              Anterior
            </button>
            <span className="text-xs font-black uppercase tracking-widest text-white/40">
              Página {currentPage} de {Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE), p + 1))}
              disabled={currentPage === Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black uppercase tracking-widest text-[10px]"
            >
              Siguiente
            </button>
          </div>
        )}
        
        {/* Modals */}`;

code = code.replace("{/* Modals */}", newControls);

fs.writeFileSync('src/components/Catalog.tsx', code);
