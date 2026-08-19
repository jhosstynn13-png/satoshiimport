const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicLayout.tsx', 'utf8');

code = code.replace(
  /<PublicNavbar\s+currentView={currentPublicView}/m,
  `<PublicNavbar 
        logo={catalog.data?.storeSettings?.logo}
        currentView={currentPublicView}`
);

fs.writeFileSync('src/components/public/PublicLayout.tsx', code);
