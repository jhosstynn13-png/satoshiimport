const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicNavbar.tsx', 'utf8');

code = code.replace(
  /interface PublicNavbarProps \{([\s\S]*?)currentUser: any;\n\}/m,
  `interface PublicNavbarProps {$1currentUser: any;\n  logo?: string;\n}`
);

code = code.replace(
  /export default function PublicNavbar\(\{(.*?)\}: PublicNavbarProps\) \{/m,
  `export default function PublicNavbar({$1, logo}: PublicNavbarProps) {`
);

code = code.replace(
  /src="https:\/\/yimuttzzvijmvlxqleor\.supabase\.co\/storage\/v1\/object\/public\/productos\/LOGO_SECO%20\(1\)\.png"/g,
  `src={logo || "https://yimuttzzvijmvlxqleor.supabase.co/storage/v1/object/public/productos/LOGO_SECO%20(1).png"}`
);

fs.writeFileSync('src/components/public/PublicNavbar.tsx', code);
