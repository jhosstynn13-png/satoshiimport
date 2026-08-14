const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

const modalCode = `
      {/* 2FA Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass rounded-[40px] p-10 border-white/10 shadow-2xl"
          >
            <div className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-widest text-white">Seguridad de Master</h3>
              <p className="text-xs text-white/50 leading-relaxed font-bold">
                Está intentando modificar los datos de un administrador. Se ha enviado un código de seguridad al correo original: <br/>
                <span className="text-white">{targetVerifyEmail}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text"
                  maxLength={6}
                  placeholder="CÓDIGO DE 6 DÍGITOS"
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pl-16 pr-6 outline-none focus:border-white/30 transition-all text-2xl font-black tracking-[0.5em] text-center text-white"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                />
              </div>

              {verifyError && (
                <p className="text-[10px] text-red-400 font-black uppercase tracking-widest text-center">{verifyError}</p>
              )}

              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] italic rounded-[28px] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isVerifying ? 'Verificando...' : 'Confirmar Cambios'}
                </button>
                <button 
                  onClick={() => {
                    setShowVerification(false);
                    setVerificationCode('');
                    setPendingUpdatePayload(null);
                    setTargetVerifyEmail('');
                  }}
                  className="w-full py-4 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
                >
                  Cancelar Edición
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
`;

code = code.replace(`    </div>\n  );\n}`, modalCode);
fs.writeFileSync('src/components/Users.tsx', code);
