const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCatalog.tsx', 'utf8');

// 1. Add pagination state
code = code.replace(
  "const [selectedSubmodel, setSelectedSubmodel] = useState<string | null>(null);",
  "const [selectedSubmodel, setSelectedSubmodel] = useState<string | null>(null);\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 30;"
);

// 2. Reset page on filter changes
code = code.replace(
  "setSelectedCategory(id);\n    setSelectedSubcategory(null);",
  "setSelectedCategory(id);\n    setSelectedSubcategory(null);\n    setCurrentPage(1);"
);
code = code.replace(
  "setSelectedSubcategory(id);\n    setSelectedModel(null);",
  "setSelectedSubcategory(id);\n    setSelectedModel(null);\n    setCurrentPage(1);"
);
code = code.replace(
  "setSelectedModel(id);\n    setSelectedSubmodel(null);",
  "setSelectedModel(id);\n    setSelectedSubmodel(null);\n    setCurrentPage(1);"
);
code = code.replace(
  "setSelectedSubmodel(id);",
  "setSelectedSubmodel(id);\n    setCurrentPage(1);"
);

// 3. Slice filteredProducts for current page
code = code.replace(
  "{filteredProducts.map((product: any, i: number) => (",
  "{filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((product: any, i: number) => ("
);

// 4. Add pagination controls
const newControls = `
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-4 py-12">
            <button 
              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black uppercase tracking-widest text-[10px]"
            >
              Anterior
            </button>
            <span className="text-xs font-black uppercase tracking-widest text-white/40">
              Página {currentPage} de {Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
            </span>
            <button 
              onClick={() => { setCurrentPage(p => Math.min(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE), p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black uppercase tracking-widest text-[10px]"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>`;

code = code.replace(
  "</div>\n    </div>",
  newControls
);

fs.writeFileSync('src/components/public/PublicCatalog.tsx', code);
