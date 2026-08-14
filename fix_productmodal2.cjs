const fs = require('fs');
let code = fs.readFileSync('src/components/ProductModal.tsx', 'utf8');

code = code.replace(
  "      status: form.status,\n      description: form.description\n    };",
  "      status: form.status,\n      description: form.description,\n      isFavorite: form.isFavorite,\n      featuredStyle: form.featuredStyle\n    };"
);

fs.writeFileSync('src/components/ProductModal.tsx', code);
