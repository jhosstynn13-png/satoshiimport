const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div className="h-full flex flex-col" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAuthModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />`;

const replacement = `<div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAuthModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
