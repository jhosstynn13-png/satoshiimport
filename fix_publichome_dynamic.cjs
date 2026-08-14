const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicHome.tsx', 'utf8');

// The original STYLE_CATEGORIES:
// const STYLE_CATEGORIES = [
//   { name: 'OUTDOOR', image: '...' },
//   ...
// ];
// We will modify the rendering of STYLE_CATEGORIES.

code = code.replace(
  "  const featuredProducts = products.filter(p => !p.name.includes('JORDAN 4')).slice(0, 4);",
  "  const featuredProducts = products.filter(p => p.isFavorite);"
);

// We should replace the map rendering of STYLE_CATEGORIES to use the product's image if available.
const findStyleImage = `
  const getStyleImage = (styleName: string, defaultImage: string) => {
    const p = products.find(p => p.featuredStyle === styleName);
    return p?.image || defaultImage;
  };
`;

code = code.replace(
  "export default function PublicHome({ onExplore, onProfileClick, onContact, products = [] }: { onExplore: () => void, onProfileClick: () => void, onContact: () => void, products?: any[] }) {",
  "export default function PublicHome({ onExplore, onProfileClick, onContact, products = [] }: { onExplore: () => void, onProfileClick: () => void, onContact: () => void, products?: any[] }) {\n" + findStyleImage
);

code = code.replace(
  "<img src={style.image} alt={style.name}",
  "<img src={getStyleImage(style.name, style.image)} alt={style.name}"
);

// The first "Nuestras Favoritas" block (the one with 3 big cards) was already removed in the last step?
// Wait, did I remove the 3 big cards? Let's check `PublicHome.tsx`.
fs.writeFileSync('src/components/public/PublicHome.tsx', code);
