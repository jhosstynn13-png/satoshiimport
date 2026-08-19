import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const uid = () => "test-id";

const categories = [
  {
    id: "cat-1",
    name: "CALZADO",
    subcategories: [
      {
        id: uid(),
        name: "SNEAKERS",
        models: [
          {
            id: uid(),
            name: "GENERAL",
            submodels: [
              {
                id: uid(),
                name: "ESTÁNDAR",
                products: [ { id: uid(), name: "test" } ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const cleanCategories = categories.map(cat => ({
  ...cat,
  subcategories: cat.subcategories?.map(sub => ({
    ...sub,
    models: sub.models?.map(mod => ({
      ...mod,
      submodels: mod.submodels?.map(submod => ({
        ...submod,
        products: [] // Strip products before saving structural tree!
      }))
    }))
  }))
}));

async function run() {
  try {
    await setDoc(doc(db, 'store', 'test_config'), { 
      categories: cleanCategories,
      storeSettings: null
    }, { merge: true });
    console.log("Saved successfully");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
