import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const uid = () => "rec-" + Math.random().toString(36).slice(2);

async function run() {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    const products = productsSnap.docs.map(d => ({ ...d.data(), _docId: d.id }));
    console.log("Total products found:", products.length);

    const configSnap = await getDoc(doc(db, 'store', 'config'));
    let data = configSnap.exists() ? configSnap.data() : { categories: [] };
    
    let cat = data.categories.find(c => c.name === "CALZADO");
    if (!cat) {
      cat = { id: uid(), name: "CALZADO", subcategories: [] };
      data.categories.push(cat);
    }

    let sub = cat.subcategories.find(s => s.name === "SNEAKERS");
    if (!sub) {
      sub = { id: uid(), name: "SNEAKERS", models: [] };
      cat.subcategories.push(sub);
    }

    let model = sub.models.find(m => m.name === "GENERAL");
    if (!model) {
      model = { id: uid(), name: "GENERAL", submodels: [] };
      sub.models.push(model);
    }
    
    let submodel = model.submodels.find(sm => sm.name === "ESTÁNDAR");
    if (!submodel) {
      submodel = { id: uid(), name: "ESTÁNDAR", products: [] };
      model.submodels.push(submodel);
    }

    let updatedCount = 0;
    // Update all orphaned products to belong to this recovered submodel
    for (const p of products) {
      // Check if the product's submodelId exists in the current tree
      let found = false;
      data.categories.forEach(c => {
        c.subcategories?.forEach(s => {
          s.models?.forEach(m => {
            m.submodels?.forEach(sm => {
              if (sm.id === p.submodelId) found = true;
            });
          });
        });
      });

      if (!found && p.id) { // Ensure it's a real product with an internal ID
         delete p._docId;
         p.categoryId = cat.id;
         p.subcategoryId = sub.id;
         p.modelId = model.id;
         p.submodelId = submodel.id;
         await setDoc(doc(db, 'products', p.id), p);
         updatedCount++;
      }
    }

    // Strip products before saving tree
    const cleanCategories = data.categories.map(c => ({
      ...c,
      subcategories: c.subcategories?.map(s => ({
        ...s,
        models: s.models?.map(m => ({
          ...m,
          submodels: m.submodels?.map(sm => ({
            ...sm,
            products: []
          }))
        }))
      }))
    }));

    await setDoc(doc(db, 'store', 'config'), { categories: cleanCategories }, { merge: true });

    console.log(`Recovered and re-linked ${updatedCount} orphaned products.`);
    process.exit(0);
  } catch (e) {
    console.error("Error: ", e);
    process.exit(1);
  }
}
run();
