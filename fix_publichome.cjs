const fs = require('fs');

let code = fs.readFileSync('src/components/public/PublicHome.tsx', 'utf8');

// 1. Remove the discount badge from Hero gallery
code = code.replace(
  `                <div className="absolute top-8 right-8">
                  <span className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black text-white italic shadow-xl">{item.discount}</span>
                </div>`,
  ""
);

// 2. Remove the -10% badge from featured products
code = code.replace(
  `                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-[8px] font-black italic px-3 py-1 rounded-full">-10%</span>
                  </div>`,
  ""
);

// 3. Let's slice out the specific sections at the end of the file
const startBanner = "{/* Giant Offer Banner */}";
const brandShowcase = "{/* Brand Showcase */}";
const endStyle = "<style dangerouslySetInnerHTML={{ __html: `";

// We want to keep Brand Showcase.
// Wait, do we want to keep Brand Showcase? The user crossed out the whole bottom, but Brand showcase is above Shop By Gender.
// Actually, let's just remove Giant Offer Banner, Shop By Gender, and Support Section explicitly.

let startIndex1 = code.indexOf(startBanner);
let endIndex1 = code.indexOf(brandShowcase);

if (startIndex1 !== -1 && endIndex1 !== -1) {
  code = code.substring(0, startIndex1) + code.substring(endIndex1);
}

const shopByGender = "{/* Shop By Gender Section */}";
let startIndex2 = code.indexOf(shopByGender);
let endIndex2 = code.indexOf(endStyle);

if (startIndex2 !== -1 && endIndex2 !== -1) {
  code = code.substring(0, startIndex2) + code.substring(endIndex2);
}

fs.writeFileSync('src/components/public/PublicHome.tsx', code);
