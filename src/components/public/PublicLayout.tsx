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

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-500/[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-500/[0.03] rounded-full blur-[120px]"></div>
      </div>

      <PublicNavbar 
        currentView={currentPublicView} 
        onViewChange={(view) => {
          if (['calzado', 'ropa', 'accesorios'].includes(view)) {
            setCurrentPublicView('catalog');
            // Professional mapping for navigation
            const categoryMap: { [key: string]: string } = {
              'calzado': 'CALZADO',
              'ropa': 'ROPA',
              'accesorios': 'ACCESORIOS'
            };
            setInitialCategory(categoryMap[view]);
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
            {currentPublicView === 'contact' && <PublicContact />}
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
          <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/20">Protocolo SATOSHIMPORT // Sistema v2.04 // Base.Local.Sync.2026</p>
          
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
