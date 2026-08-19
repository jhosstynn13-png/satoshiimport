import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      name: 'Test Product ' + Date.now(),
      submodelId: 'test'
    });
    console.log("Document written with ID: ", docRef.id);
    
    const snap = await getDocs(collection(db, 'products'));
    console.log("Total products: ", snap.docs.length);
    process.exit(0);
  } catch (e) {
    console.error("Error adding document: ", e);
    process.exit(1);
  }
}
run();
