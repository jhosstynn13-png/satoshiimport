const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

const target = `{confirmDeleteId === user.id ? (
                                     <button 
                                        title="Confirmar Eliminación"
                                        className="px-4 py-3 bg-red-600 text-white font-black uppercase tracking-widest text-[8px] rounded-xl transition-all animate-pulse"
                                        onClick={() => {
                                           deleteUser(user.id);
                                           setConfirmDeleteId(null);
                                        }}
                                     >
                                        CONFIRMAR
                                     </button>
                                   ) : (`;

const replacement = `{confirmDeleteId === user.id ? (
                                     <>
                                       <div 
                                         className="fixed inset-0 z-40 cursor-default" 
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           setConfirmDeleteId(null);
                                         }}
                                       />
                                       <button 
                                          title="Confirmar Eliminación"
                                          className="relative z-50 px-4 py-3 bg-red-600 text-white font-black uppercase tracking-widest text-[8px] rounded-xl transition-all animate-pulse shadow-2xl shadow-red-500/50"
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             deleteUser(user.id);
                                             setConfirmDeleteId(null);
                                          }}
                                       >
                                          CONFIRMAR
                                       </button>
                                     </>
                                   ) : (`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/Users.tsx', code);
  console.log('Success');
} else {
  console.log('Target not found');
}
