const fs = require('fs');
let code = fs.readFileSync('src/components/Catalog.tsx', 'utf8');
code = code.replace(`    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };
  };`, `    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };`);
fs.writeFileSync('src/components/Catalog.tsx', code);
