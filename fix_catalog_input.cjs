const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

code = code.replace(
  'onChange={handleBulkUpload}',
  'onChange={handleBulkUpload}\n                    disabled={isUploading}'
);
code = code.replace(
  'className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-[32px] hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group gap-2"',
  'className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-[32px] hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group gap-2 ${isUploading ? "opacity-50 pointer-events-none" : ""}`}'
);

fs.writeFileSync('src/components/Catalog.tsx', code);
