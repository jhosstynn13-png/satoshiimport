const fs = require('fs');

let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// Import localforage
code = code.replace(
  "import { doc, setDoc, onSnapshot } from 'firebase/firestore';",
  "import { doc, setDoc, onSnapshot } from 'firebase/firestore';\nimport localforage from 'localforage';"
);

// We need to change how state is initialized. We can't do sync initialization.
// We'll initialize with starterData, then load from localforage inside a useEffect.

const oldStateDecl = `  const [data, _setData] = useState<CatalogData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : starterData;
    
    // Migration: ensure subcategories have models and models have submodels
    if (parsed.categories && Array.isArray(parsed.categories)) {
      parsed.categories.forEach((cat: Category) => {
        if (cat.subcategories && Array.isArray(cat.subcategories)) {
          cat.subcategories.forEach((sub: any) => {
            if (!sub.models) {
              sub.models = [];
              if (sub.products && Array.isArray(sub.products) && sub.products.length > 0) {
                sub.models.push({
                  id: 'mod-legacy-' + sub.id,
                  name: 'GENERAL',
                  submodels: [{
                    id: 'submod-legacy-' + sub.id,
                    name: 'GENERAL',
                    products: sub.products
                  }]
                });
                delete sub.products;
              }
            } else {
              sub.models.forEach((mod: any) => {
                if (!mod.submodels) {
                  mod.submodels = [];
                  if (mod.products && Array.isArray(mod.products) && mod.products.length > 0) {
                    mod.submodels.push({
                      id: 'submod-legacy-' + mod.id,
                      name: 'GENERAL',
                      products: mod.products
                    });
                    delete mod.products;
                  }
                }
              });
            }
          });
        }
      });
    }

    return parsed;
  });

  const setData = (value: CatalogData | ((prev: CatalogData) => CatalogData)) => {
    _setData(prev => {
      const newData = typeof value === 'function' ? value(prev) : value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      // setDoc(doc(db, "catalogs", "main"), JSON.parse(JSON.stringify(newData))); // Disabled to avoid quota issues
      return newData;
    });
  };

  useEffect(() => {
    // Firebase sync disabled temporarily to avoid quota limits
    // const unsub = onSnapshot(doc(db, "catalogs", "main"), (snapshot) => {
    //   if (snapshot.exists()) {
    //     _setData(snapshot.data() as CatalogData);
    //   }
    // });
    // return () => unsub();
  }, []);`;

const newStateDecl = `  const [data, _setData] = useState<CatalogData>(starterData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    localforage.getItem(STORAGE_KEY).then((saved) => {
      let parsed = saved as CatalogData;
      
      if (!parsed) {
        parsed = starterData;
      }
      
      // Migration: ensure subcategories have models and models have submodels
      if (parsed.categories && Array.isArray(parsed.categories)) {
        parsed.categories.forEach((cat: Category) => {
          if (cat.subcategories && Array.isArray(cat.subcategories)) {
            cat.subcategories.forEach((sub: any) => {
              if (!sub.models) {
                sub.models = [];
                if (sub.products && Array.isArray(sub.products) && sub.products.length > 0) {
                  sub.models.push({
                    id: 'mod-legacy-' + sub.id,
                    name: 'GENERAL',
                    submodels: [{
                      id: 'submod-legacy-' + sub.id,
                      name: 'GENERAL',
                      products: sub.products
                    }]
                  });
                  delete sub.products;
                }
              } else {
                sub.models.forEach((mod: any) => {
                  if (!mod.submodels) {
                    mod.submodels = [];
                    if (mod.products && Array.isArray(mod.products) && mod.products.length > 0) {
                      mod.submodels.push({
                        id: 'submod-legacy-' + mod.id,
                        name: 'GENERAL',
                        products: mod.products
                      });
                      delete mod.products;
                    }
                  }
                });
              }
            });
          }
        });
      }

      _setData(parsed);
      setIsLoaded(true);
    });
  }, []);

  const setData = (value: CatalogData | ((prev: CatalogData) => CatalogData)) => {
    _setData(prev => {
      const newData = typeof value === 'function' ? value(prev) : value;
      // Guardar de forma asíncrona sin bloquear la UI ni chocar con el límite de 5MB
      localforage.setItem(STORAGE_KEY, JSON.parse(JSON.stringify(newData)));
      return newData;
    });
  };`;

code = code.replace(oldStateDecl, newStateDecl);

// We need to add `isLoaded` to the return of useCatalog
code = code.replace(
  "return {\n    data,\n    addLog",
  "return {\n    isLoaded,\n    data,\n    addLog"
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
