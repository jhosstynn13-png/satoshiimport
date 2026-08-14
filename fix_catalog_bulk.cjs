const fs = require('fs');

let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');

// 1. Add imports for Firebase Storage
code = code.replace(
  "import { useCatalog } from '../hooks/useCatalog';",
  "import { useCatalog } from '../hooks/useCatalog';\nimport { storage } from '../firebase';\nimport { ref, uploadBytes, getDownloadURL } from 'firebase/storage';"
);

// 2. Add state for bulk uploading
code = code.replace(
  "  const [productForm, setProductForm] = useState({",
  "  const [isUploading, setIsUploading] = useState(false);\n  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });\n\n  const [productForm, setProductForm] = useState({"
);

// 3. Rewrite handleBulkUpload function
const oldHandleBulkUpload = `  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!selectedSubmodelId) return alert("Selecciona un sub-modelo primero");

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        addProduct(selectedSubmodelId, {
          name: '',
          sku: '',
          image: reader.result as string,
          price: 0,
          sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
          description: '',
          status: 'active'
        });
      };
      reader.readAsDataURL(file);
    });
    
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

code = code.replace(oldHandleBulkUpload, newHandleBulkUpload);

// 4. Update the UI for the bulk upload to show progress
const oldUploadUI = `                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-white">Carga Masiva de Imágenes</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mt-1">Sube múltiples fotos (Crea un ítem por cada foto automáticamente)</p>
                  </div>`;

const newUploadUI = `                  <div className="text-center">
                    {isUploading ? (
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Subiendo... {uploadProgress.current} de {uploadProgress.total}</p>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: \`\${(uploadProgress.current / uploadProgress.total) * 100}%\` }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-black uppercase tracking-widest text-white">Carga Masiva de Imágenes</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mt-1">Sube hasta 10,000 fotos (Optimizado en la nube)</p>
                      </>
                    )}
                  </div>`;

code = code.replace(oldUploadUI, newUploadUI);

fs.writeFileSync('src/components/Catalog.tsx', code);
