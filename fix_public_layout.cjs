const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicLayout.tsx', 'utf8');

const target = `  const { currentUser, allProducts } = catalog;`;
const replacement = `  const { currentUser, allProducts } = catalog;

  const isPublicDisabled = catalog.data?.storeSettings?.publicAccessEnabled === false;
  const isAdmin = currentUser?.role === 'admin';

  if (isPublicDisabled && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambience */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.05),transparent_50%)]"></div>
        </div>

        {/* Massive Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <h1 className="text-[12vw] font-black uppercase italic tracking-tighter text-white whitespace-nowrap rotate-[-15deg] select-none">
            CERRADO TEMPORALMENTE
          </h1>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-10 p-10 max-w-2xl">
          <div className="w-24 h-24 bg-white/5 rounded-3xl mx-auto flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            {catalog.data?.storeSettings?.logo ? (
              <img src={catalog.data.storeSettings.logo} alt="Logo" className="w-12 h-auto object-contain" />
            ) : (
              <div className="text-4xl font-black italic">S</div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-widest text-white">
              {catalog.data?.storeSettings?.storeName || 'SATOSHIMPORT'}
            </h2>
            <p className="text-xs text-white/40 uppercase tracking-widest leading-loose">
              Nuestra tienda se encuentra actualmente en mantenimiento privado.<br/>
              Agradecemos su comprensión.
            </p>
          </div>

          <div className="pt-8">
            <button 
              onClick={onShowAuth}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Acceso Administrativo
            </button>
          </div>
        </div>
      </div>
    );
  }
`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/public/PublicLayout.tsx', code);
