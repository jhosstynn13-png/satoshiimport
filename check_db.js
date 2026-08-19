import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const configSnap = await getDoc(doc(db, 'store', 'config'));
    console.log("Config exists?", configSnap.exists());
    
    const productsSnap = await getDocs(collection(db, 'products'));
    console.log("Total products:", productsSnap.docs.length);

    const usersSnap = await getDocs(collection(db, 'users'));
    console.log("Total users:", usersSnap.docs.length);

    process.exit(0);
  } catch (e) {
    console.error("Error reading db: ", e);
    process.exit(1);
  }
}
run();
