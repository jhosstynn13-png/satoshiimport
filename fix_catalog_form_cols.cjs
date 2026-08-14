const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// I will just use regex to replace all the `className="md:col-span-X"` with `className="md:col-span-12"` to make the form a clean vertical stack inside that panel, except maybe for SKU and Price, but let's just make them 12 as well for maximum space, or 6 and 6.

code = code.replace(/<div className="md:col-span-6">/g, '<div className="col-span-1 md:col-span-12">');
code = code.replace(/<div className="md:col-span-3">/g, '<div className="col-span-1 md:col-span-6">');
code = code.replace(/<div className="md:col-span-3 relative">/g, '<div className="col-span-1 md:col-span-12 relative">');
code = code.replace(/<div className="md:col-span-6 2xl:col-span-6">/g, '<div className="col-span-1 md:col-span-6">'); // Price and SKU
code = code.replace(/<div className="md:col-span-12 2xl:col-span-12">/g, '<div className="col-span-1 md:col-span-12">'); // Name
code = code.replace(/<div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white\/5">/g, '<div className="col-span-1 md:col-span-12 grid grid-cols-1 gap-4 pt-6 border-t border-white/5">'); // Personalization

fs.writeFileSync('src/components/Catalog.tsx', code);
