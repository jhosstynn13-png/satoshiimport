const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// I should compress the single image upload as well, just to be safe, because large images might cause localStorage limits.

const targetFunc = `                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProductForm({...productForm, image: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}`;

const replacementFunc = `                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressedBlob = await compressImage(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProductForm({...productForm, image: reader.result as string});
                            };
                            reader.readAsDataURL(compressedBlob);
                          } catch(err) {
                            console.error(err);
                          }
                        }
                      }}`;

code = code.replace(targetFunc, replacementFunc);
fs.writeFileSync('src/components/Catalog.tsx', code);
