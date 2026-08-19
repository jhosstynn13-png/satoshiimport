import { useState } from 'react';
import PublicNavbar from './PublicNavbar';
import PublicHome from './PublicHome';
import PublicCatalog from './PublicCatalog';
import PublicContact from './PublicContact';
import UserProfile from './UserProfile';
import FloatingCart from './FloatingCart';
import PaymentView from './PaymentView';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Instagram, Mail } from 'lucide-react';

export default function PublicLayout({ catalog, onShowAuth }: { catalog: any, onShowAuth: () => void }) {
  const [currentPublicView, setCurrentPublicView] = useState<'home' | 'catalog' | 'contact' | 'profile' | 'payment'>('home');
  const [initialCategory, setInitialCategory] = useState<string | null>(null);
  const { currentUser, allProducts } = catalog;

  const isPublicDisabled = catalog.data?.storeSettings?.publicAccessEnabled === false;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

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
          <div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            {catalog.data?.storeSettings?.logo ? (
              <img src={catalog.data.storeSettings.logo} alt="Logo" className="w-full h-full object-cover" />
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


  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-500/[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-500/[0.03] rounded-full blur-[120px]"></div>
      </div>

      <PublicNavbar 
        logo={catalog.data?.storeSettings?.logo}
        currentView={currentPublicView} 
        currentCategory={initialCategory}
        categories={catalog.data?.categories || []}
        onViewChange={(view, payload) => {
          if (view === 'catalog' && payload) {
            setCurrentPublicView('catalog');
            setInitialCategory(payload);
          } else {
            setCurrentPublicView(view as any);
            if (view === 'catalog') setInitialCategory(null);
          }
        }} 
        onLoginClick={onShowAuth}
        onProfileClick={() => setCurrentPublicView('profile')}
        currentUser={currentUser}
      />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPublicView}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentPublicView === 'home' && (
              <PublicHome 
                products={allProducts}
                onExplore={() => setCurrentPublicView('catalog')} 
                onProfileClick={() => setCurrentPublicView('profile')}
                onContact={() => setCurrentPublicView('contact')}
              />
            )}
            {currentPublicView === 'catalog' && (
              <PublicCatalog 
                catalog={catalog} 
                initialCategoryName={initialCategory} 
              />
            )}
            {currentPublicView === 'contact' && <PublicContact catalog={{ ...catalog, onShowAuth }} />}
            {currentPublicView === 'profile' && <UserProfile catalog={{ ...catalog, onShowAuth }} />}
            {currentPublicView === 'payment' && <PaymentView onBack={() => setCurrentPublicView('catalog')} catalog={catalog} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {currentUser && currentUser.id !== 'guest' && (
        <FloatingCart onCheckout={() => setCurrentPublicView('payment')} />
      )}

      {/* Footer Branding */}
      <div className="py-12 border-t border-white/5 bg-black/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">©J.M.R.L</p>
          
          <div className="flex items-center gap-8">
            <a href="https://t.me/+azjtpws9ov1kYjM5" target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-colors">
              <Send size={14} />
            </a>
            <a href="https://www.instagram.com/satoshimport?utm_source=qr" target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-colors">
              <Instagram size={14} />
            </a>
            <a href="mailto:SATOSHIMPORT@HOTMAIL.COM?subject=Consulta Satoshimport&body=Estimado equipo de Satoshimport," className="text-white/20 hover:text-white transition-colors">
              <Mail size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
