const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

const targetFunc = fs.readFileSync('bulk_upload_temp.txt', 'utf8');

const replacementFunc = `  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!selectedSubmodelId) return alert("Selecciona un sub-modelo primero");

    const fileArray = Array.from(files);
    
    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    const BATCH_SIZE = 5;
    try {
      for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
        const batch = fileArray.slice(i, i + BATCH_SIZE);
        
        const newProductsData: any[] = [];
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
    }
  };`;

if (code.includes(targetFunc.trim())) {
  code = code.replace(targetFunc.trim(), replacementFunc);
  fs.writeFileSync('src/components/Catalog.tsx', code);
  console.log("Success replacing handleBulkUpload");
} else {
  // try direct string replace
  let newCode = code.replace(targetFunc.trim(), replacementFunc);
  if (newCode !== code) {
    fs.writeFileSync('src/components/Catalog.tsx', newCode);
    console.log("Success replacing handleBulkUpload via direct match");
  } else {
    console.log("Failed completely");
  }
}
