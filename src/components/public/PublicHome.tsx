import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, ArrowRight, ShieldCheck, Globe, ShoppingCart, Star, 
  TrendingUp, ChevronLeft, ChevronRight, Truck, CreditCard, 
  Percent, Clock, MoveRight
} from 'lucide-react';

const HERO_SLIDES = [
  {
    title1: "LUJO",
    title2: "URBANO",
    subtitle: "Zapatillas, ropa y accesorios premium de las marcas más influyentes del mundo.",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    color: "bg-yellow-400"
  },
  {
    title1: "NUEVA",
    title2: "ERA",
    subtitle: "Colecciones exclusivas importadas directamente para elevar tu estilo personal.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
    color: "bg-emerald-500"
  },
  {
    title1: "STREET",
    title2: "WEAR",
    subtitle: "Curaduría vanguardista de los principales hubs de moda globales.",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c",
    color: "bg-blue-600"
  }
];

const BRANDS = [
  { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'Jordan', logo: 'https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg' },
  { name: 'Yeezy', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Yeezy_logo.svg/2560px-Yeezy_logo.svg.png' },
  { name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/id/3/3d/Logo_puma.png' },
  { name: 'New Balance', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg' }
];

const STYLE_CATEGORIES = [
  { name: 'OUTDOOR', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306' },
  { name: 'RUNNING', image: 'https://images.unsplash.com/photo-1541591044522-bb62323f46f4' },
  { name: 'URBANO', image: 'https://images.unsplash.com/photo-1514477917009-389c71a869ae' },
  { name: 'FÚTBOL', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018' },
  { name: 'INDUSTRIAL', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12' }
];

export default function PublicHome({ onExplore, onProfileClick, onContact, products = [] }: { onExplore: () => void, onProfileClick: () => void, onContact: () => void, products?: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get some random featured products
  const featuredProducts = products.filter(p => !p.name.includes('JORDAN 4')).slice(0, 4);
  const bestSellers = products.slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="space-y-12 bg-black pb-32">
      {/* Dynamic Hero Slider */}
      <section className="relative h-[80vh] w-full flex flex-col items-center justify-center text-center overflow-hidden rounded-[80px] mx-auto max-w-[calc(100%-48px)]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.5] scale-105"
              style={{ backgroundImage: `url("${HERO_SLIDES[currentSlide].image}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 space-y-8 px-6 max-w-5xl"
        >
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full mb-4 mx-auto">
            <span className={`w-2 h-2 rounded-full ${HERO_SLIDES[currentSlide].color} animate-pulse`}></span>
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white">Exclusividad Importada</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-black italic uppercase tracking-tighter text-white leading-[0.8] drop-shadow-2xl">
            {HERO_SLIDES[currentSlide].title1}<br/>
            <span className="text-transparent border-text">{HERO_SLIDES[currentSlide].title2}</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-white/70 text-lg md:text-xl font-medium italic tracking-wide leading-relaxed">
            {HERO_SLIDES[currentSlide].subtitle}
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExplore}
              className={`${HERO_SLIDES[currentSlide].color} text-black px-14 py-6 rounded-[24px] font-black uppercase tracking-[0.2em] italic flex items-center gap-4 text-xs shadow-2xl transition-all`}
            >
              Comprar Ahora <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Slider Controls */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-12">
          <button onClick={prevSlide} className="p-4 rounded-full border border-white/10 hover:bg-white/10 text-white transition-all group active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-4">
            {HERO_SLIDES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-10 bg-white' : 'w-4 bg-white/20'}`} 
              />
            ))}
          </div>
          <button onClick={nextSlide} className="p-4 rounded-full border border-white/10 hover:bg-white/10 text-white transition-all group active:scale-90">
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Encuentra tu Estilo Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Encuentra Tu <span className="text-white/20">Estilo</span></h2>
          <div className="h-0.5 w-24 bg-white/10 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STYLE_CATEGORIES.map((style, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="relative aspect-[4/5] rounded-[32px] overflow-hidden group cursor-pointer border border-white/5"
            >
              <img src={style.image} alt={style.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase italic shadow-2xl group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                  {style.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Grid - "Nuestras Favoritas" Style */}
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
           {[
             { title: "SNEAKERS ELITE", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a", discount: "-50%" },
             { title: "NEW ARRIVALS", img: "https://images.unsplash.com/photo-1556906781-9a412961c28c", discount: "-10%" },
             { title: "ACCESSORIES", img: "https://images.unsplash.com/photo-1595950653303-3467972fc008", discount: "-20%" }
           ].map((item, i) => (
             <motion.div 
               key={i}
               whileHover={{ scale: 0.98 }}
               className="relative h-[500px] rounded-[48px] overflow-hidden group cursor-pointer"
               onClick={onExplore}
             >
                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-8 right-8">
                  <span className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black text-white italic shadow-xl">{item.discount}</span>
                </div>
                <div className="absolute bottom-10 left-10 space-y-2">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">{item.title}</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest italic group-hover:text-white transition-colors">Explorar Colección</p>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Nuestras Favoritas</h2>
            <button onClick={onExplore} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Ver Todo</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden group p-6"
              >
                <div className="aspect-square rounded-[32px] overflow-hidden mb-6 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-[8px] font-black italic px-3 py-1 rounded-full">-10%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{product.category}</p>
                  <h3 className="text-sm font-black uppercase italic tracking-tighter truncate">{product.name}</h3>
                  <div className="flex justify-between items-center pt-4">
                    <p className="text-lg font-black text-emerald-400 italic font-mono">$ {product.price.toLocaleString()}</p>
                    <button onClick={onExplore} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-yellow-400 transition-colors">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Giant Offer Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative h-[250px] rounded-[48px] overflow-hidden group cursor-pointer" onClick={onExplore}>
           <div className="absolute inset-0 bg-blue-600 group-hover:bg-blue-500 transition-colors duration-700" />
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 px-6">
             <h3 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">DESDE 50% DSCTO. EN MILES DE ARTÍCULOS</h3>
             <p className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-white/60">No te pierdas de nuestras mejores ofertas exclusivas</p>
             <button className="mt-4 px-10 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Ver Ofertas</button>
           </div>
           <div className="absolute -right-10 top-0 text-[200px] font-black italic text-white/5 select-none pointer-events-none rotate-12">SALE</div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="relative py-24 bg-white/[0.01] overflow-hidden border-y border-white/5">
        <div className="flex overflow-hidden group">
          <div className="flex animate-scroll-brand whitespace-nowrap gap-24 items-center">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div key={i} className="flex flex-col items-center gap-4 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                <img src={brand.logo} alt={brand.name} className="h-12 w-auto object-contain brightness-0 invert" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Gender Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[600px]">
           {[
             { name: "HOMBRE", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c", bg: "bg-blue-600" },
             { name: "MUJER", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f", bg: "bg-emerald-500" },
             { name: "NIÑO", img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea", bg: "bg-yellow-400" }
           ].map((gender, i) => (
             <motion.div 
               key={i}
               whileHover={{ scale: 0.98 }}
               className="relative rounded-[48px] overflow-hidden group cursor-pointer text-center"
               onClick={onExplore}
             >
                <img src={gender.img} alt={gender.name} className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-10 left-0 right-0">
                  <span className="bg-white text-black px-12 py-3 rounded-full text-sm font-black tracking-[0.2em] italic shadow-2xl group-hover:bg-yellow-400 transition-colors">
                    {gender.name}
                  </span>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Support Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white/[0.02] border border-white/5 p-16 rounded-[80px] flex flex-col justify-center items-center text-center gap-10 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 text-[180px] font-black italic text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700 select-none uppercase">Private</div>
          <div className="relative z-10 space-y-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 mb-4">
               <Zap size={32} />
            </div>
            <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-wide">Atención Concierge</h3>
            <p className="text-white/40 leading-relaxed italic text-lg max-w-2xl">Soporte técnico prioritario y acceso preferente a preventas exclusivas para socios permanentes.</p>
            <button 
              onClick={onContact}
              className="px-14 py-6 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl italic"
            >
              Contactar Ahora
            </button>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-brand {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-brand {
          animation: scroll-brand 40s linear infinite;
        }
        .border-text {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.3);
          color: transparent;
        }
      `}} />
    </div>
  );
}
