import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, Mail, Shield, ArrowRight, User as UserIcon, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { UserRole } from '../types';
import { sendVerificationCode, generateCode } from '../services/emailService';

interface AuthProps {
  onLogin: (email: string, password?: string) => { success: boolean; message?: string };
  onVerifyCredentials?: (email: string, password?: string) => { success: boolean; message?: string; user?: any };
  onRegister: (data: any) => { success: boolean; message?: string };
  onGuestLogin: () => void;
  isModal?: boolean;
  clientLoginEnabled?: boolean;
}

export default function Auth({ onLogin, onVerifyCredentials, onRegister, onGuestLogin, isModal = false, clientLoginEnabled = true }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  
  const [role, setRole] = useState<UserRole>('client');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Verification Code State
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [tempAdminData, setTempAdminData] = useState<{email: string; password?: string} | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  React.useEffect(() => {
    if (!clientLoginEnabled && !isLogin) {
      setIsLogin(true);
    }
  }, [clientLoginEnabled, isLogin]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !tempAdminData) return;
    
    setLoading(true);
    setError(null);
    try {
      const code = generateCode();
      setSentCode(code);
      await sendVerificationCode(tempAdminData.email, code);
      setResendCooldown(60);
    } catch (err: any) {
      setError('Error al reenviar el código: ' + (err.message || 'Desconocido'));
    } finally {
      setLoading(false);
    }
  };



  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (verificationCode.trim().toUpperCase() === sentCode.trim().toUpperCase()) {
      if (tempAdminData) {
        const result = onLogin(tempAdminData.email, tempAdminData.password);
        if (!result.success) {
          setError(result.message || 'Error al iniciar sesión después de la verificación.');
        }
      }
    } else {
      setError('Código de verificación incorrecto.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showVerification) {
      handleVerifyCode(e);
      return;
    }
    setError(null);
    setLoading(true);

    if (isLogin) {
      let isUserAdmin = false;
      if (onVerifyCredentials) {
        const verifyRes = onVerifyCredentials(email, password);
        if (!verifyRes.success) {
          setError(verifyRes.message || 'Credenciales incorrectas.');
          setLoading(false);
          return;
        }
        if (verifyRes.user && verifyRes.user.role === 'superadmin') {
          isUserAdmin = true;
        }
      }

      if (isUserAdmin) {
        try {
          const code = generateCode();
          setSentCode(code);
          setTempAdminData({ email, password });
          
          await sendVerificationCode(email, code);
          setShowVerification(true);
          setResendCooldown(60);
          setLoading(false);
          return;
        } catch (err: any) {
          setError('Error al enviar el código de seguridad: ' + (err.message || 'Desconocido'));
          setLoading(false);
          return;
        }
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const result = onLogin(email, password);
      if (!result.success) {
        setError(result.message || 'Error de autenticación');
      }
    } else {
      // Validation for DNI
      if (!/^\d{8}$/.test(dni)) {
        setError('El DNI debe tener exactamente 8 dígitos numéricos.');
        setLoading(false);
        return;
      }

      // Validation for Passwords
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        setLoading(false);
        return;
      }

      if (password.length < 4) {
        setError('La contraseña debe tener al menos 4 caracteres.');
        setLoading(false);
        return;
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const fullName = `${firstName}${middleName ? ' ' + middleName : ''} ${lastName}${secondLastName ? ' ' + secondLastName : ''}`.trim().toUpperCase();
      
      const result = onRegister({ 
        name: fullName,
        firstName,
        middleName,
        lastName,
        secondLastName,
        dni,
        phone,
        email, 
        password,
        role 
      });

      if (!result.success) {
        setError(result.message || 'Error en el registro');
      } else {
        // Switch to login after successful register or auto-login
        onLogin(email, password);
      }
    }
    setLoading(false);
  };

  const containerClasses = isModal 
    ? "relative w-full max-w-md" 
    : "fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black";

  return (
    <div className={containerClasses}>
      {!isModal && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
        </div>
      )}

      <motion.div 
        initial={!isModal ? { opacity: 0, y: 20 } : {}}
        animate={!isModal ? { opacity: 1, y: 0 } : {}}
        className={isModal ? "w-full" : "relative w-full max-w-md"}
      >
        {!isModal && (
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-white rounded-[32px] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] mb-8"
            >
              <Shield size={40} className="text-black" />
            </motion.div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2">SATOSHIMPORT</h1>
            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.4em]">Protocolo de Acceso Seguro</p>
          </div>
        )}

        <div className="glass-rich rounded-[50px] p-10 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          {clientLoginEnabled ? (
          <div className="flex bg-white/5 p-2 rounded-[24px] mb-10 overflow-hidden">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all ${isLogin ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all ${!isLogin ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            >
              Registro
            </button>
          </div>
          ) : (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-10 text-center">
            <p className="text-red-400 text-xs font-bold uppercase">La tienda se encuentra en mantenimiento privado. Solo personal autorizado puede acceder en este momento.</p>
          </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {showVerification ? (
                <motion.div
                  key="verification-fields"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2 mb-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto flex items-center justify-center text-white mb-4">
                      <Key size={32} />
                    </div>
                    <h3 className="text-white font-black uppercase text-xs tracking-widest">Verificación de Admin</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                      Se ha enviado un código a su correo master para validar su identidad de administrador.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">Código de Seguridad</label>
                    <input 
                      type="text"
                      required
                      value={verificationCode}
                      onChange={e => setVerificationCode(e.target.value.toUpperCase())}
                      className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[28px] outline-none focus:bg-white/10 focus:border-white transition-all text-2xl font-black text-center tracking-[0.5em] text-white uppercase"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 mt-2">
                    <button 
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleResendCode}
                      className={`text-[9px] uppercase font-black tracking-widest transition-all ${
                        resendCooldown > 0 
                          ? 'text-white/20 cursor-not-allowed' 
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {resendCooldown > 0 
                        ? `Reenviar código en ${resendCooldown}s` 
                        : '¿No recibiste el código? Reenviar'}
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        setShowVerification(false);
                        setVerificationCode('');
                        setResendCooldown(0);
                      }}
                      className="text-[9px] text-white/40 hover:text-white uppercase font-black tracking-widest"
                    >
                      Volver al login
                    </button>
                  </div>
                </motion.div>
              ) : !isLogin ? (
                <motion.div
                  key="reg-fields"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Primer Nombre</label>
                       <input 
                         type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                         className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest text-white shadow-inner"
                         placeholder="EJ: JUAN"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Segundo Nombre</label>
                       <input 
                         type="text" value={middleName} onChange={e => setMiddleName(e.target.value)}
                         className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest text-white shadow-inner"
                         placeholder="EJ: CARLOS"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Primer Apellido</label>
                       <input 
                         type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                         className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest text-white shadow-inner"
                         placeholder="EJ: PEREZ"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Segundo Apellido</label>
                       <input 
                         type="text" value={secondLastName} onChange={e => setSecondLastName(e.target.value)}
                         className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest text-white shadow-inner"
                         placeholder="EJ: GARCIA"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">DNI (8 DÍGITOS)</label>
                       <input 
                         type="text" required maxLength={8} value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, ''))}
                         className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest text-white shadow-inner"
                         placeholder="00000000"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Número de Celular</label>
                       <input 
                         type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                         className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest text-white shadow-inner"
                         placeholder="999888777"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Email Identity</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                      <input 
                        type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest text-white shadow-inner"
                        placeholder="CORREO@EJEMPLO.COM"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Contraseña</label>
                       <input 
                         type="password" required value={password} onChange={e => setPassword(e.target.value)}
                         className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest text-white shadow-inner"
                         placeholder="••••••••"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] ml-2">Confirmar</label>
                       <input 
                         type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                         className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[20px] outline-none focus:bg-white/10 focus:border-white transition-all text-[10px] font-bold uppercase tracking-widest text-white shadow-inner"
                         placeholder="••••••••"
                       />
                    </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="login-fields"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">Email Identity</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/5 rounded-[28px] outline-none focus:bg-white/10 focus:border-white transition-all text-xs font-bold uppercase tracking-widest text-white"
                        placeholder="CORREO@EJEMPLO.COM"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] ml-2">Contraseña de Protocolo</label>
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[28px] outline-none focus:bg-white/10 focus:border-white transition-all text-xs font-bold uppercase tracking-widest text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-900/20 border border-red-900/50 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-white text-black font-black rounded-[28px] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 uppercase tracking-widest text-[10px] mt-4 italic disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {showVerification ? (
                    <>
                      <CheckCircle size={20} />
                      Verificar Código
                    </>
                  ) : (
                    <>
                      {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </>
                  )}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] leading-loose">
            Al acceder, usted acepta los protocolos de seguridad y manejo de datos locales de Satoshimport Master Edition.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
