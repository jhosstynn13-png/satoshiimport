const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// Replace p-8 with p-5 in the 4 category columns
code = code.replace(/glass rounded-\[48px\] p-8/g, 'glass rounded-[40px] p-5');

// For the last column (the form), let's also reduce padding from p-10 to p-6 or p-8
code = code.replace(/glass rounded-\[48px\] p-10/g, 'glass rounded-[40px] p-6 lg:p-8');

// Make the layout wrap nicely
// Make the form fields all stack into 12 cols for breathing room
// Let's replace the grid inside the form to stack better.

fs.writeFileSync('src/components/Catalog.tsx', code);
