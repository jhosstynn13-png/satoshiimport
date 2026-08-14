import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Store, CreditCard, Shield, Bell, Globe, ChevronRight, X, Lock, Key, Mail, CheckCircle2, Save } from 'lucide-react';

export default function StoreSettings({ catalog }: { catalog: any }) {
  const { data, updateStoreSettings } = catalog;
  const storeSettings = data.storeSettings || {
    storeName: 'SATOSHIMPORT',
    currency: 'PEN',
    timezone: 'America/Lima',
    paymentMethods: ['yape', 'transfer'],
    notifications: { email: true, push: false },
    regional: { language: 'es', dateFormat: 'DD/MM/YYYY' }
  };

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [step, setStep] = useState(1);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '', code: '' });
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState('');
  
  // Local states for editing settings
  const [editSettings, setEditSettings] = useState(storeSettings);

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

  const handleSaveSettings = () => {
    updateStoreSettings(editSettings);
    setActiveModal(null);
  };

  const handleOpenModal = (id: string) => {
    setEditSettings(data.storeSettings || storeSettings);
    setActiveModal(id);
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

  const renderModalContent = () => {
    switch (activeModal) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Logo de la Tienda</label>
              <div className="flex items-center gap-4">
                <div className="h-16 flex items-center justify-center shrink-0">
                  {editSettings.logo ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-white/5">
                      <img src={editSettings.logo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                      <Store className="text-white/20" size={24} />
                    </div>
                  )}
                </div>
                <label className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors">
                  Subir Nueva Imagen
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditSettings({...editSettings, logo: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </label>
                {editSettings.logo && (
                  <button 
                    onClick={() => setEditSettings({...editSettings, logo: ''})}
                    className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Nombre de la Tienda</label>
              <input 
                type="text" 
                value={editSettings.storeName}
                onChange={e => setEditSettings({...editSettings, storeName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-white/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Moneda Principal</label>
              <select 
                value={editSettings.currency}
                onChange={e => setEditSettings({...editSettings, currency: e.target.value})}
                className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-white/30"
              >
                <option value="PEN">Soles (PEN - S/)</option>
                <option value="USD">Dólares (USD - $)</option>
                <option value="EUR">Euros (EUR - €)</option>
                <option value="MXN">Pesos Mexicanos (MXN - $)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Zona Horaria</label>
              <select 
                value={editSettings.timezone}
                onChange={e => setEditSettings({...editSettings, timezone: e.target.value})}
                className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-white/30"
              >
                <option value="America/Lima">Lima, Perú (GMT-5)</option>
                <option value="America/Bogota">Bogotá, Colombia (GMT-5)</option>
                <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                <option value="America/Argentina/Buenos_Aires">Buenos Aires, Argentina (GMT-3)</option>
                <option value="America/Santiago">Santiago, Chile (GMT-4)</option>
              </select>
            </div>
          </div>
        );
      case 'payments':
        const togglePayment = (method: string) => {
          const methods = editSettings.paymentMethods.includes(method)
            ? editSettings.paymentMethods.filter((m: string) => m !== method)
            : [...editSettings.paymentMethods, method];
          setEditSettings({...editSettings, paymentMethods: methods});
        };
        return (
          <div className="space-y-4">
            <p className="text-xs text-white/40 mb-4">Seleccione los métodos de pago activos para su tienda.</p>
            {[
              { id: 'yape', name: 'Yape / Plin', desc: 'Pagos con código QR o número' },
              { id: 'transfer', name: 'Transferencia Bancaria', desc: 'Transferencias directas BCP, BBVA, etc.' },
              { id: 'card', name: 'Tarjetas (Stripe/MercadoPago)', desc: 'Pasarela de pagos con tarjetas (Próximamente)' },
              { id: 'cash', name: 'Efectivo', desc: 'Pago contra entrega' }
            ].map(pm => (
              <div 
                key={pm.id} 
                onClick={() => togglePayment(pm.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  editSettings.paymentMethods.includes(pm.id) 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-80'
                }`}
              >
                <div>
                  <h4 className="font-bold">{pm.name}</h4>
                  <p className="text-[10px] text-white/40">{pm.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  editSettings.paymentMethods.includes(pm.id) ? 'bg-white text-black' : 'bg-white/10'
                }`}>
                  {editSettings.paymentMethods.includes(pm.id) && <CheckCircle2 size={14} />}
                </div>
              </div>
            ))}
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <p className="text-xs text-white/40 mb-4">Gestione el acceso público y las credenciales de administrador.</p>
            
            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold">Acceso de Clientes</h4>
                <p className="text-[10px] text-white/40 mt-1">Permitir que los clientes inicien sesión y compren.</p>
              </div>
              <button 
                onClick={() => setEditSettings({
                  ...editSettings, 
                  clientLoginEnabled: editSettings.clientLoginEnabled === false
                })}
                className={`w-12 h-6 rounded-full transition-all relative ${editSettings.clientLoginEnabled !== false ? 'bg-green-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${editSettings.clientLoginEnabled !== false ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold">Acceso Público (Visitantes)</h4>
                <p className="text-[10px] text-white/40 mt-1">Permitir que el catálogo sea visible públicamente.</p>
              </div>
              <button 
                onClick={() => setEditSettings({
                  ...editSettings, 
                  publicAccessEnabled: editSettings.publicAccessEnabled === false
                })}
                className={`w-12 h-6 rounded-full transition-all relative ${editSettings.publicAccessEnabled !== false ? 'bg-green-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${editSettings.publicAccessEnabled !== false ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold text-red-400">Contraseña de Administrador</h4>
                <p className="text-[10px] text-white/40 mt-1">Modificar su contraseña maestra actual.</p>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setShowSecurityModal(true); }}
                className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs rounded-xl transition-colors"
              >
                Modificar
              </button>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <p className="text-xs text-white/40 mb-4">Configure cómo y cuándo desea recibir alertas del sistema.</p>
            
            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold">Notificaciones por Email</h4>
                <p className="text-[10px] text-white/40 mt-1">Recibir correos sobre nuevos pedidos y alertas.</p>
              </div>
              <button 
                onClick={() => setEditSettings({
                  ...editSettings, 
                  notifications: {...editSettings.notifications, email: !editSettings.notifications.email}
                })}
                className={`w-12 h-6 rounded-full transition-all relative ${editSettings.notifications.email ? 'bg-green-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${editSettings.notifications.email ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <h4 className="font-bold">Alertas Web Push</h4>
                <p className="text-[10px] text-white/40 mt-1">Mostrar notificaciones en el navegador.</p>
              </div>
              <button 
                onClick={() => setEditSettings({
                  ...editSettings, 
                  notifications: {...editSettings.notifications, push: !editSettings.notifications.push}
                })}
                className={`w-12 h-6 rounded-full transition-all relative ${editSettings.notifications.push ? 'bg-green-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${editSettings.notifications.push ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        );
      case 'regional':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Idioma del Sistema</label>
              <select 
                value={editSettings.regional.language}
                onChange={e => setEditSettings({
                  ...editSettings, 
                  regional: {...editSettings.regional, language: e.target.value}
                })}
                className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-white/30"
              >
                <option value="es">Español</option>
                <option value="en">English (Coming Soon)</option>
                <option value="pt">Português (Coming Soon)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Formato de Fecha</label>
              <select 
                value={editSettings.regional.dateFormat}
                onChange={e => setEditSettings({
                  ...editSettings, 
                  regional: {...editSettings.regional, dateFormat: e.target.value}
                })}
                className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-white/30"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (Ej: 14/08/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (Ej: 08/14/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (Ej: 2026-08-14)</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
            onClick={() => handleOpenModal(section.id)}
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

      {/* Generic Settings Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                  {sections.find(s => s.id === activeModal)?.label}
                </h2>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors text-white/60 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {renderModalContent()}
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                <button 
                  onClick={handleSaveSettings}
                  className="px-8 py-4 bg-white text-black hover:scale-105 active:scale-95 transition-all font-black uppercase italic tracking-[0.2em] text-[10px] rounded-2xl flex items-center gap-2 shadow-xl shadow-white/10"
                >
                  <Save size={16} /> Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                    <Lock size={20} className="text-white/60" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Seguridad</h2>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Cambio de Contraseña</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSecurityModal(false)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors text-white/60 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-10">
                {step === 1 && (
                  <div className="space-y-6">
                    <p className="text-xs text-white/40 leading-relaxed text-center mb-8">
                      Para modificar sus credenciales de acceso, deberá verificar su identidad mediante su contraseña actual y un código OTP que será enviado a su correo registrado.
                    </p>

                    <div className="space-y-4">
                      <div className="relative">
                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
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
                      className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] italic rounded-[28px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
