const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

const newBulkUpload = `
    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!selectedSubmodelId) return alert("Selecciona un sub-modelo primero");

    const fileArray = Array.from(files);
    
    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    const BATCH_SIZE = 5;
    const newProductsData: any[] = [];
    
    try {
      for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
        const batch = fileArray.slice(i, i + BATCH_SIZE);
        
        const uploadPromises = batch.map(async (file: File) => {
          try {
            const compressedBlob = await compressImage(file);
            
            const reader = new FileReader();
            const downloadUrl = await new Promise<string>((resolve, reject) => {
               reader.onloadend = () => resolve(reader.result as string);
               reader.onerror = reject;
               reader.readAsDataURL(compressedBlob);
            });
            
            const safeName = file.name.replace(/\\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_\\s]/g, '');
            
            newProductsData.push({
              name: safeName,
              sku: '',
              image: downloadUrl,
              price: 0,
              sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
              description: '',
              status: 'active'
            });
          } catch (error) {
            console.error("Error al procesar archivo:", file.name, error);
          }
        });
        await Promise.all(uploadPromises);
        
        if (newProductsData.length > 0) {
          addProductsBulk(selectedSubmodelId, newProductsData);
          newProductsData.length = 0; // vaciar
        }
        
        setUploadProgress(prev => ({ ...prev, current: Math.min(prev.current + BATCH_SIZE, fileArray.length) }));
        
        if (i + BATCH_SIZE < fileArray.length) {
          await new Promise(resolve => setTimeout(resolve, 50)); 
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
      setTimeout(() => setUploadProgress({ current: 0, total: 0 }), 2000);
    }
  };
`;

code = code.replace(/const handleBulkUpload = async.*?setTimeout\(\(\) => setUploadProgress\(\{ current: 0, total: 0 \}\), 2000\);\n    }\n  };/s, newBulkUpload.trim());

const oldSingleUpload = `
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressedBlob = await compressImage(file);
                            const safeName = file.name.replace(/\\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_\\s]/g, '');
                            const storageRef = ref(storage, \`catalog_images/\${Date.now()}_\${safeName}.webp\`);
                            await uploadBytes(storageRef, compressedBlob);
                            const downloadUrl = await getDownloadURL(storageRef);
                            setProductForm({...productForm, image: downloadUrl});
                          } catch(err) {
                            console.error("Error subiendo imagen:", err);
                            alert("Error al subir imagen a la nube.");
                          }
                        }
                      }}
`;

const newSingleUpload = `
                      onChange={async (e) => {
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
                      }}
`;

code = code.replace(oldSingleUpload.trim(), newSingleUpload.trim());

fs.writeFileSync('src/components/Catalog.tsx', code);
