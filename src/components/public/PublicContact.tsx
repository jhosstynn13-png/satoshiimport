import React from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Instagram, 
  UploadCloud,
  ArrowUpRight,
  MessageCircle,
  Send
} from 'lucide-react';

export default function PublicContact() {
  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-white selection:text-black flex flex-col overflow-x-hidden py-4">
      
      {/* Main Content Area */}
      <main className="flex-grow max-w-[1400px] mx-auto px-4 w-full relative">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
          
          {/* Columna Izquierda: Tarjetas de Contacto */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* WhatsApp Central 1 */}
            <div className="bg-white/[0.08] backdrop-blur-lg p-6 rounded-[24px] border border-white/10 flex flex-col items-start transition-all duration-500 hover:bg-white/10 hover:border-white/20 group">
              <div className="flex justify-between w-full mb-6">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/15 px-2 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[8px] font-bold tracking-widest text-emerald-400 uppercase">En Línea</span>
                </div>
              </div>
              
              <h3 className="text-xl font-black italic tracking-wider text-white uppercase mb-4 leading-tight">
                VENTAS.<br/>WHATSAPP
              </h3>
              
              <div className="space-y-1 mb-8 w-full font-mono text-xs tracking-wider">
                <p className="text-white/80 flex items-center gap-2">
                  <span className="text-white/40">TEL //</span> +51 944 186 522
                </p>
                <p className="text-white/80 flex items-center gap-2">
                  <span className="text-white/40">ENC //</span> SATOSHI
                </p>
              </div>

              <a 
                href="https://wa.me/51944186522" 
                target="_blank" 
                rel="noreferrer"
                className="bg-white text-black font-black uppercase tracking-[0.1em] text-[10px] px-6 py-3 rounded-full w-full flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
              >
                Abrir Chat <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            {/* WhatsApp Central 2 (Socios) */}
            <div className="bg-white/[0.08] backdrop-blur-lg p-6 rounded-[24px] border border-white/10 flex flex-col items-start transition-all duration-500 hover:bg-white/10 hover:border-white/20 group">
              <div className="flex justify-between w-full mb-6">
                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 bg-blue-500/15 px-2 py-1 rounded-full border border-blue-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-[8px] font-bold tracking-widest text-blue-400 uppercase">Socio Senior</span>
                </div>
              </div>
              
              <h3 className="text-xl font-black italic tracking-wider text-white uppercase mb-4 leading-tight">
                SOCIO.<br/>WHATSAPP
              </h3>
              
              <div className="space-y-1 mb-8 w-full font-mono text-xs tracking-wider">
                <p className="text-white/80 flex items-center gap-2">
                  <span className="text-white/40">TEL //</span> +51 991 209 195
                </p>
                <p className="text-white/80 flex items-center gap-2">
                  <span className="text-white/40">ENC //</span> ANDRIANO
                </p>
              </div>

              <a 
                href="https://wa.me/51991209195"
                target="_blank" 
                rel="noreferrer"
                className="bg-white text-black font-black uppercase tracking-[0.1em] text-[10px] px-6 py-3 rounded-full w-full flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
              >
                Abrir Chat <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="lg:col-span-8 bg-white/[0.05] backdrop-blur-2xl p-6 md:p-8 rounded-[32px] border border-white/10 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -top-12 -right-12 text-[120px] font-black italic text-white/[0.04] select-none pointer-events-none">
              S-01
            </div>

            <div className="mb-6 relative z-10">
              <h2 className="text-[8px] font-bold text-white/70 tracking-[0.3em] uppercase mb-2 font-mono">
                [ STUDIO.CONCIERGE ]
              </h2>
              <h1 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-wider leading-none">
                ATENCIÓN PERSONALIZADA
              </h1>
            </div>
            
            <form className="flex flex-col gap-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col group">
                  <label className="text-[9px] font-bold text-white/40 tracking-[0.1em] uppercase mb-1 ml-4">Nombre // Req</label>
                  <input type="text" className="px-5 py-3 rounded-[15px] border border-white/20 bg-white/10 focus:outline-none focus:bg-white/20 text-white placeholder-white/30 font-mono text-xs transition-all uppercase" placeholder="INGRESAR_NOMBRE" />
                </div>
                <div className="flex flex-col group">
                  <label className="text-[9px] font-bold text-white/40 tracking-[0.1em] uppercase mb-1 ml-4">Apellidos // Req</label>
                  <input type="text" className="px-5 py-3 rounded-[15px] border border-white/20 bg-white/10 focus:outline-none focus:bg-white/20 text-white placeholder-white/30 font-mono text-xs transition-all uppercase" placeholder="INGRESAR_APELLIDOS" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-white/40 tracking-[0.1em] uppercase mb-1 ml-4">Departamento</label>
                  <input type="text" className="px-5 py-3 rounded-[15px] border border-white/20 bg-white/10 focus:outline-none focus:bg-white/20 text-white placeholder-white/30 font-mono text-xs transition-all uppercase" placeholder="LIMA_CUZCO..." />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-white/40 tracking-[0.1em] uppercase mb-1 ml-4">Adjuntar // Imagen</label>
                  <label className="border border-dashed border-white/20 rounded-[15px] p-2 bg-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all h-[44px]">
                    <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors">
                      <UploadCloud className="w-4 h-4" />
                      <span className="font-mono text-[9px] tracking-widest uppercase">Cargar <span className="opacity-50">(5MB)</span></span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-white/40 tracking-[0.1em] uppercase mb-1 ml-4">Mensaje // Payload</label>
                <textarea rows={3} className="px-5 py-4 rounded-[15px] border border-white/20 bg-white/10 focus:outline-none focus:bg-white/20 text-white placeholder-white/30 font-mono text-xs resize-none transition-all uppercase" placeholder="MENSAJE..."></textarea>
              </div>

              <div className="flex justify-end mt-2">
                <button type="submit" className="bg-white text-black font-black text-xs uppercase tracking-[0.2em] py-4 px-10 rounded-full hover:bg-gray-200 transition-all active:scale-95 w-full sm:w-auto shadow-sm">
                  Transmitir Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-white/10 bg-black pt-12 pb-6 px-6 md:px-12 mt-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white text-black font-black text-xl w-10 h-10 flex items-center justify-center rounded-[10px]">S</div>
              <span className="font-black text-lg tracking-[0.2em] italic uppercase">SATOSHIMPORT</span>
            </div>
            <p className="text-[10px] font-mono text-white/70 tracking-widest uppercase leading-relaxed">
              [ EST. 2024 ]<br/>
              © SATOSHIMPORT. ALL RIGHTS RESERVED.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <h4 className="text-white font-black italic tracking-widest text-xs uppercase mb-6">DISTRIBUIDORES</h4>
              <ul className="text-xs text-white/70 space-y-4 font-mono tracking-wide">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-white/50" />
                  <p>OLVA COURIER / SHALOM</p>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-black italic tracking-widest text-xs uppercase mb-6">/ NETWORKS_</h4>
              <div className="flex gap-6 text-white/70">
                <a href="https://www.instagram.com/satoshimport?utm_source=qr" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://t.me/+azjtpws9ov1kYjM5" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Send className="w-6 h-6" />
                </a>
                <a href="mailto:SATOSHIMPORT@HOTMAIL.COM?subject=Consulta Satoshimport&body=Estimado equipo de Satoshimport," className="hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
