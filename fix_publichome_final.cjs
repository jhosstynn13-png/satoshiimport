const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicHome.tsx', 'utf8');

const featuredBlockStart = '{/* Featured Grid - "Nuestras Favoritas" Style */}';
const endOfSmallGrid = '        </section>\n      )}'; // This ends the second grid

let blockIndex = code.indexOf(featuredBlockStart);
if (blockIndex !== -1) {
  // Let's replace both grids with one unified grid of favorites.
  // Actually, wait, let's keep the big card aesthetic but map over `featuredProducts`
  const newFeaturedBlock = `
      {/* Featured Grid - "Nuestras Favoritas" Style */}
      {featuredProducts.length > 0 && (
      <section className="max-w-7xl mx-auto px-6 py-24 bg-white/[0.01] rounded-[60px] border border-white/5">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-2">
             <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">Nuestras Favoritas</h2>
             <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.5em] italic">Curated by our Fashion Tech Lab</p>
          </div>
          <button onClick={onExplore} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white text-white hover:text-black transition-all">
            Ver Todo <MoveRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {featuredProducts.slice(0, 6).map((item: any, i: number) => (
             <motion.div 
               key={i}
               whileHover={{ scale: 0.98 }}
               className="relative h-[500px] rounded-[48px] overflow-hidden group cursor-pointer"
               onClick={onExplore}
             >
                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-10 left-10 space-y-2">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter truncate max-w-[80%]">{item.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-white/80 font-black text-xl italic font-mono">$ {item.price.toLocaleString()}</p>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest italic group-hover:text-white transition-colors">Explorar Colección</p>
                  </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>
      )}
`;
  
  // Cut out the old code from featuredBlockStart to the end of the small grid
  let endBlockIndex = code.indexOf(endOfSmallGrid, blockIndex);
  if (endBlockIndex !== -1) {
    let oldBlock = code.substring(blockIndex, endBlockIndex + endOfSmallGrid.length);
    code = code.replace(oldBlock, newFeaturedBlock);
  }
}

fs.writeFileSync('src/components/public/PublicHome.tsx', code);
