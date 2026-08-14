const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicLayout.tsx', 'utf8');

code = code.replace(
  "{currentPublicView === 'contact' && <PublicContact />}",
  "{currentPublicView === 'contact' && <PublicContact catalog={{ ...catalog, onShowAuth }} />}"
);

fs.writeFileSync('src/components/public/PublicLayout.tsx', code);
