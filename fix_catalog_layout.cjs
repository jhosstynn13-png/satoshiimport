const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// Reduce the width of the 4 selection columns to give more space to the 5th column
code = code.replace(
  'xl:grid-cols-[240px_240px_240px_240px_1fr] gap-6',
  'xl:grid-cols-[200px_200px_200px_200px_1fr] gap-4'
);

// Form layout tweaks
code = code.replace(
  'className="md:col-span-6"',
  'className="md:col-span-12 2xl:col-span-12"' // Denominacion comercial
);

code = code.replace(
  'className="md:col-span-3"',
  'className="md:col-span-6 2xl:col-span-6"' // SKU
);

code = code.replace(
  'className="md:col-span-3"',
  'className="md:col-span-6 2xl:col-span-6"' // Price
);

code = code.replace(
  'className="md:col-span-6"',
  'className="md:col-span-12"' // Image URL
);

code = code.replace(
  'className="md:col-span-3 relative"',
  'className="md:col-span-6 relative"' // Sizes
);

code = code.replace(
  'className="md:col-span-3"',
  'className="md:col-span-6"' // Submit button
);

fs.writeFileSync('src/components/Catalog.tsx', code);
