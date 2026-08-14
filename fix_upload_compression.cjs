const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

const oldHandleBulkUpload = `  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const uploadPromises = batch.map(async (file: File) => {
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

const newHandleBulkUpload = `  // Helper para comprimir imágenes en el navegador antes de subirlas
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Resolución optimizada para catálogo
          let scaleSize = 1;
          if (img.width > MAX_WIDTH) {
            scaleSize = MAX_WIDTH / img.width;
          }
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convertir a formato WebP ligero con 80% de calidad
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Fallo al comprimir imagen'));
          }, 'image/webp', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!selectedSubmodelId) return alert("Selecciona un sub-modelo primero");

    const fileArray = Array.from(files);
    
    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    // Lotes más pequeños para no congelar la memoria del navegador con miles de Canvas
    const BATCH_SIZE = 5;
    for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
      const batch = fileArray.slice(i, i + BATCH_SIZE);
      
      const newProductsData: any[] = [];
      const uploadPromises = batch.map(async (file: File) => {
        try {
          // 1. Comprimir imagen en el lado del cliente (Ahorra un 95% de tamaño)
          const compressedBlob = await compressImage(file);
          
          // 2. Subir a Firebase Storage con extensión .webp
          const safeName = file.name.replace(/\\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_\s]/g, '');
          const storageRef = ref(storage, \`productos/\${Date.now()}_\${safeName}.webp\`);
          await uploadBytes(storageRef, compressedBlob);
          const downloadUrl = await getDownloadURL(storageRef);
          
          // 3. Crear data del producto
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
      
      // Guardar el lote en el estado local
      if (newProductsData.length > 0) {
        addProductsBulk(selectedSubmodelId, newProductsData);
      }
      
      setUploadProgress(prev => ({ ...prev, current: Math.min(prev.current + BATCH_SIZE, fileArray.length) }));
      
      // Pequeña pausa (throttle) para evitar errores 429 Too Many Requests de Firebase
      if (i + BATCH_SIZE < fileArray.length) {
        await new Promise(resolve => setTimeout(resolve, 500)); 
      }
    }

    setIsUploading(false);
    e.target.value = '';
  };`;

code = code.replace(oldHandleBulkUpload, newHandleBulkUpload);
fs.writeFileSync('src/components/Catalog.tsx', code);
