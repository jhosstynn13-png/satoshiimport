import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Store, CreditCard, Shield, Bell, Globe, ChevronRight, X, Lock, Key, Mail, CheckCircle2 } from 'lucide-react';

export default function StoreSettings({ catalog }: { catalog: any }) {
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [step, setStep] = useState(1);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '', code: '' });
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState('');

  const handleRequestCode = async () => {
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      setError('Complete todos los campos de contraseña.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }
    
    // Verify old password first
    const verify = catalog.verifyCredentials(catalog.currentUser.email, passwords.old);
    if (!verify.success) {
      setError(verify.message);
      return;
    }

    setIsRequesting(true);
    setError('');

    try {
      const res = await catalog.requestPasswordChange(catalog.currentUser.email);
      if (res.success) {
        setStep(2);
      } else {
        setError(res.message || 'Error al solicitar el código.');
      }
    } catch (err: any) {
      setError('Error al procesar la solicitud.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleConfirmChange = () => {
    const res = catalog.confirmPasswordChange(
      catalog.currentUser.id, 
      passwords.old, 
      passwords.new, 
      passwords.code
    );
    
    if (res.success) {
      setStep(3);
    } else {
      setError(res.message);
    }
  };

  const sections = [
    { 
      id: 'general', 
      label: 'Información de Tienda', 
      icon: Store, 
      desc: 'Nombre, logo, moneda y zona horaria.' 
    },
    { 
      id: 'payments', 
      label: 'Métodos de Pago', 
      icon: CreditCard, 
      desc: 'Gestión de pasarelas y transferencias locales.' 
    },
    { 
      id: 'security', 
      label: 'Seguridad y Accesos', 
      icon: Shield, 
      desc: 'Roles de administrador y cifrado de datos.' 
    },
    { 
      id: 'notifications', 
      label: 'Notificaciones', 
      icon: Bell, 
      desc: 'Configuración de alertas por email y web push.' 
    },
    { 
      id: 'regional', 
      label: 'Configuración Regional', 
      icon: Globe, 
      desc: 'Idiomas, preferencias y formatos de fecha.' 
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-white/5 border border-white/5 rounded-3xl">
          <Settings size={28} className="text-white/60" />
        </div>
        <div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter">Ajustes Globales</h3>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Sincronización de Tienda v4.2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, i) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass p-8 rounded-[36px] hover:bg-white/[0.04] transition-all cursor-pointer group flex items-center gap-6 relative overflow-hidden"
            onClick={() => section.id === 'security' ? setShowSecurityModal(true) : null}
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
              <section.icon size={24} className="text-white/60 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h4 className="font-black uppercase italic tracking-widest text-lg group-hover:translate-x-2 transition-transform duration-500">{section.label}</h4>
              <p className="text-sm text-white/40 mt-1">{section.desc}</p>
            </div>
            <div className="p-3 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
              <ChevronRight size={20} />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass border-white/10 rounded-[48px] overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Seguridad Avanzada</h2>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Multi-Factor Authentication</p>
                  </div>
                  <button 
                    onClick={() => setShowSecurityModal(false)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="password"
                          placeholder="CONTRASEÑA ANTERIOR"
                          className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-16 pr-6 outline-none focus:border-white/30 transition-all text-[10px] font-black uppercase tracking-widest italic"
                          value={passwords.old}
                          onChange={e => setPasswords({...passwords, old: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="password"
                          placeholder="NUEVA CONTRASEÑA"
                          className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-16 pr-6 outline-none focus:border-white/30 transition-all text-[10px] font-black uppercase tracking-widest italic"
                          value={passwords.new}
                          onChange={e => setPasswords({...passwords, new: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="password"
                          placeholder="CONFIRMAR NUEVA"
                          className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-16 pr-6 outline-none focus:border-white/30 transition-all text-[10px] font-black uppercase tracking-widest italic"
                          value={passwords.confirm}
                          onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center px-4">{error}</p>
                    )}

                    <button 
                      onClick={handleRequestCode}
                      disabled={isRequesting}
                      className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] italic rounded-[28px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isRequesting ? 'Sincronizando...' : 'Solicitar Código QR/Email'}
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-white/40" size={32} />
                      </div>
                      <h3 className="text-lg font-black uppercase italic tracking-widest">Verificación en Curso</h3>
                      <p className="text-xs text-white/40">Se ha enviado un código de 6 dígitos a su correo electrónico corporativo.</p>
                    </div>

                    <div className="relative">
                      <Shield className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        type="text"
                        maxLength={6}
                        placeholder="CÓDIGO DE 6 DÍGITOS"
                        className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pl-16 pr-6 outline-none focus:border-white/30 transition-all text-2xl font-black tracking-[0.5em] text-center"
                        value={passwords.code}
                        onChange={e => setPasswords({...passwords, code: e.target.value})}
                      />
                    </div>

                    {error && (
                      <p className="text-[10px] text-red-400 font-black uppercase tracking-widest text-center">{error}</p>
                    )}

                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={handleConfirmChange}
                        className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] italic rounded-[28px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/10"
                      >
                        Confirmar Cambio
                      </button>
                      <button 
                         onClick={() => setStep(1)}
                         className="text-[10px] text-white/40 uppercase font-black tracking-widest hover:text-white transition-colors"
                      >
                        Volver a intentar
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-widest">Éxito Total</h3>
                      <p className="text-xs text-white/40 mt-2">La contraseña ha sido actualizada y los registros de seguridad sincronizados.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowSecurityModal(false);
                        setStep(1);
                        setPasswords({ old: '', new: '', confirm: '', code: '' });
                      } }
                      className="px-10 py-5 bg-white/10 hover:bg-white text-white hover:text-black font-black uppercase tracking-widest italic rounded-[24px] transition-all"
                    >
                      Cerrar Panel
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="glass rounded-[48px] p-12 relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent border-white/10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 bg-white rounded-[40px] flex items-center justify-center shadow-3xl shadow-white/10 group">
             <Store size={80} className="text-black group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">SATOSHIMPORT Master</h3>
              <p className="text-white/40 uppercase font-black tracking-widest text-xs mt-2">Enterprise Edition License Active</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1">Licencia</div>
                <div className="font-mono text-sm text-white/80">SAT-990-PRO-2024</div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-sm font-bold">Verificada</span>
                  </div>
                </div>
                <button 
                  onClick={() => catalog.loadMassiveDemo()}
                  className="px-6 py-3 bg-white text-black hover:scale-105 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic shadow-2xl shadow-white/20"
                >
                  Generar Datos Masivos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
