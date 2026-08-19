const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// 1. Remove the trapped useEffect from inside login
code = code.replace(
`  // Sync structural changes to DB whenever categories array changes length or structure
  // (We debounce this slightly by using a useMemo/useEffect combo, or just direct useEffect)
  useEffect(() => {
    // Only save if we actually have data loaded from DB (prevents overwriting on first boot before load)
    if (data.categories.length > 0) {
      // NOTE: saveCategoriesToDb strips products, so it's safe to pass data.categories
      saveCategoriesToDb(data.categories, data.storeSettings).catch(console.error);
    }
  }, [data.categories, data.storeSettings]);

  return { success: false, message: 'Su cuenta ha sido suspendida por seguridad.' };`,
`        return { success: false, message: 'Su cuenta ha sido suspendida por seguridad.' };`
);

// 2. Add isDbLoaded state and properly place the useEffect
code = code.replace(
`  useEffect(() => {
    const initDb = async () => {`,
`  const [isDbLoaded, setIsDbLoaded] = useState(false);

  useEffect(() => {
    if (isDbLoaded && data.categories.length > 0) {
      saveCategoriesToDb(data.categories, data.storeSettings).catch(console.error);
    }
  }, [data.categories, data.storeSettings, isDbLoaded]);

  useEffect(() => {
    const initDb = async () => {`
);

// 3. Set isDbLoaded to true after loading from DB
code = code.replace(
`        if (data.categories.length > 0) {
           massiveSyncToDb(data).catch(console.error);
        }
      }
    };
    initDb();
  }, []);`,
`        if (data.categories.length > 0) {
           massiveSyncToDb(data).catch(console.error);
        }
      }
      setIsDbLoaded(true);
    };
    initDb();
  }, []);`
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
