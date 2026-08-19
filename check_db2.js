import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.docs.length > 0) {
      console.log("Sample product: ", JSON.stringify(productsSnap.docs[0].data(), null, 2));
    }
    
    const configSnap = await getDoc(doc(db, 'store', 'config'));
    if (configSnap.exists()) {
       const cat = configSnap.data().categories[0];
       console.log("Sample config submodel id: ", cat?.subcategories?.[0]?.models?.[0]?.submodels?.[0]?.id);
       console.log("Does it match a product?", productsSnap.docs.some(d => d.data().submodelId === cat?.subcategories?.[0]?.models?.[0]?.submodels?.[0]?.id));
    }

    process.exit(0);
  } catch (e) {
    console.error("Error reading db: ", e);
    process.exit(1);
  }
}
run();
