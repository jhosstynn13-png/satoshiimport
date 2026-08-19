const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCatalog.tsx', 'utf8');

const paginationUI = `
      </div>
      
      {/* Pagination UI */}
      {filteredProducts.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-4 mt-16 mb-8 relative z-20">
          <button 
            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            disabled={currentPage === 1}
            className="px-6 py-4 bg-white/5 disabled:opacity-30 disabled:hover:bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all backdrop-blur-sm"
          >
            Anterior
          </button>
          <span className="text-xs font-black text-white/50 tracking-widest uppercase">
            PÁGINA {currentPage} DE {Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
          </span>
          <button 
            onClick={() => { setCurrentPage(p => Math.min(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE), p + 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            disabled={currentPage === Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
            className="px-6 py-4 bg-white/5 disabled:opacity-30 disabled:hover:bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all backdrop-blur-sm"
          >
            Siguiente
          </button>
        </div>
      )}
`;

code = code.replace(
  /<\/div>\n\s*<\/div>\n\s*\)$/m,
  paginationUI + '\n    </div>\n  )'
);

fs.writeFileSync('src/components/public/PublicCatalog.tsx', code);
