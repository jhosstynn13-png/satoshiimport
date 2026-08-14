const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// Update destructuring from useCatalog
code = code.replace(
  'addProduct,',
  'addProduct,\n    addProductsBulk,'
);

// Update handleBulkUpload
const oldHandleBulkUpload = `  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!selectedSubmodelId) return alert("Selecciona un sub-modelo primero");

    const fileArray = Array.from(files);
    
    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    // Process in batches to avoid overwhelming the browser/network
    const BATCH_SIZE = 5;
    for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
      const batch = fileArray.slice(i, i + BATCH_SIZE);
      
      const uploadPromises = batch.map(async (file) => {
        try {
          // Upload to Firebase Storage
          const storageRef = ref(storage, \`productos/\${Date.now()}_\${file.name}\`);
          await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(storageRef);
          
          // Generate name from filename without extension
          const nameFromFilename = file.name.replace(/\\.[^/.]+$/, "");

          addProduct(selectedSubmodelId, {
            name: nameFromFilename,
            sku: '',
            image: downloadUrl,
            price: 0,
            sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
            description: '',
            status: 'active'
          });
        } catch (error) {
          console.error("Error uploading file:", file.name, error);
        }
      });

      await Promise.all(uploadPromises);
      setUploadProgress(prev => ({ ...prev, current: Math.min(prev.current + BATCH_SIZE, fileArray.length) }));
    }

    setIsUploading(false);
    
    // Reset file input
    e.target.value = '';
  };`;

const newHandleBulkUpload = `  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!selectedSubmodelId) return alert("Selecciona un sub-modelo primero");

    const fileArray = Array.from(files);
    
    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    // Process in batches to avoid overwhelming the browser/network
    const BATCH_SIZE = 10;
    for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
      const batch = fileArray.slice(i, i + BATCH_SIZE);
      
      const newProductsData = [];
      const uploadPromises = batch.map(async (file) => {
        try {
          // Upload to Firebase Storage
          const storageRef = ref(storage, \`productos/\${Date.now()}_\${file.name}\`);
          await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(storageRef);
          
          // Generate name from filename without extension
          const nameFromFilename = file.name.replace(/\\.[^/.]+$/, "");

          newProductsData.push({
            name: nameFromFilename,
            sku: '',
            image: downloadUrl,
            price: 0,
            sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
            description: '',
            status: 'active'
          });
        } catch (error) {
          console.error("Error uploading file:", file.name, error);
        }
      });

      await Promise.all(uploadPromises);
      
      // Save the batch of products all at once
      if (newProductsData.length > 0) {
        addProductsBulk(selectedSubmodelId, newProductsData as any);
      }
      
      setUploadProgress(prev => ({ ...prev, current: Math.min(prev.current + BATCH_SIZE, fileArray.length) }));
    }

    setIsUploading(false);
    
    // Reset file input
    e.target.value = '';
  };`;

code = code.replace(oldHandleBulkUpload, newHandleBulkUpload);

fs.writeFileSync('src/components/Catalog.tsx', code);
