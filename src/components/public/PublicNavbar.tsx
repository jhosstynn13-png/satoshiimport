import { ShoppingCart, User, LogIn, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface PublicNavbarProps {
  currentView: string;
  currentCategory?: string | null;
  categories: any[];
  onViewChange: (view: string, payload?: string | null) => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
  currentUser: any;
}

export default function PublicNavbar({ currentView, currentCategory, categories = [], onViewChange, onLoginClick, onProfileClick, currentUser }: PublicNavbarProps) {
  const { totalItems, totalPrice } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categoryLinks = categories.map((cat: any) => ({
    id: `category_${cat.id}`,
    label: cat.name,
    type: 'category',
    categoryName: cat.name
  }));

  const navLinks = [
    { id: 'home', label: 'Inicio', type: 'page' },
    ...categoryLinks,
    { id: 'contact', label: 'Contacto', type: 'page' }
  ];

  return (
    <nav className="bg-black/50 backdrop-blur-xl border-b border-white/5 py-2 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onViewChange('home')}>
        {/* Logo High-Contrast */}
        <div className="bg-white text-black font-black text-lg w-10 h-10 flex items-center justify-center rounded-[12px] transition-all duration-700 group-hover:scale-105 overflow-hidden p-1">
          <img 
            src="https://yimuttzzvijmvlxqleor.supabase.co/storage/v1/object/public/productos/LOGO_SECO%20(1).png" 
            alt="Logo Satoshimport" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-black text-sm md:text-md tracking-[0.2em] italic uppercase hidden sm:block">
          SATOSHIMPORT
        </span>
      </div>
      
      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-12 flex-grow justify-center">
        <div className="flex gap-8 text-[9px] font-black tracking-[0.25em] uppercase text-white/50">
          {navLinks.map(link => {
            const isActive = link.type === 'category' 
              ? currentView === 'catalog' && currentCategory === (link as any).categoryName
              : currentView === link.id;
              
            return (
              <button 
                key={link.id}
                onClick={() => {
                  if (link.type === 'category') {
                    onViewChange('catalog', (link as any).categoryName);
                  } else {
                    onViewChange(link.id);
                  }
                }}
                className={`transition-all duration-300 relative py-1 ${
                  isActive 
                    ? 'text-white after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' 
                    : 'hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dynamic Cart */}
        <div className="hidden sm:flex relative group px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full items-center gap-3 hover:bg-white/10 transition-all cursor-pointer">
          <ShoppingCart className="w-4 h-4 text-white/40 group-hover:text-white" />
          {totalItems > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-white italic">x{totalItems}</span>
              <div className="h-3 w-[1px] bg-white/10"></div>
              <span className="text-[9px] font-black text-emerald-400">$ {totalPrice.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Login Button */}
        <button 
          onClick={(!currentUser || currentUser.id === 'guest') ? onLoginClick : onProfileClick}
          className={`${(!currentUser || currentUser.id === 'guest') 
            ? 'px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest' 
            : 'w-10 h-10 bg-white/10 text-white'
          } border border-white/20 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_10px_20px_rgba(255,255,255,0.05)] ${currentView === 'profile' ? 'ring-1 ring-white ring-offset-2 ring-offset-black' : ''}`}
        >
          {(!currentUser || currentUser.id === 'guest') ? (
            <span className="whitespace-nowrap">Iniciar Sesión</span>
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black border-b border-white/5 p-8 flex flex-col gap-6 md:hidden z-40"
          >
            {navLinks.map(link => {
              const isActive = link.type === 'category' 
                ? currentView === 'catalog' && currentCategory === (link as any).categoryName
                : currentView === link.id;

              return (
                <button 
                  key={link.id}
                  onClick={() => {
                    if (link.type === 'category') {
                      onViewChange('catalog', (link as any).categoryName);
                    } else {
                      onViewChange(link.id);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`text-[10px] font-black tracking-widest uppercase text-left ${isActive ? 'text-white' : 'text-white/40'}`}
                >
                  {link.label}
                </button>
              );
            })}
            <button 
              onClick={() => { currentUser ? onProfileClick() : onLoginClick(); setMobileMenuOpen(false); }}
              className={`text-[10px] font-black tracking-widest uppercase text-left ${currentView === 'profile' ? 'text-white' : 'text-white/40'}`}
            >
              {currentUser ? 'Mi Perfil' : 'Iniciar Sesión'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
