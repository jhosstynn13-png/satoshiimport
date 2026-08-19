const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// Insert pagination UI right after the products grid
const paginationUI = `
        </div>
        
        {/* Pagination UI */}
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-white/5 disabled:opacity-30 disabled:hover:bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all"
            >
              Anterior
            </button>
            <span className="text-xs font-black text-white/50">
              PÁGINA {currentPage} DE {Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE), p + 1))}
              disabled={currentPage === Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
              className="px-6 py-3 bg-white/5 disabled:opacity-30 disabled:hover:bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all"
            >
              Siguiente
            </button>
          </div>
        )}
`;

code = code.replace(
  /<\/div>\n\s*<\/div>\n\s*\{editingProduct && \(/m,
  paginationUI + '\n      </div>\n      {editingProduct && ('
);

fs.writeFileSync('src/components/Catalog.tsx', code);
