import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const configSnap = await getDoc(doc(db, 'store', 'config'));
    if (configSnap.exists()) {
       console.log(JSON.stringify(configSnap.data().categories, null, 2));
    }

    process.exit(0);
  } catch (e) {
    console.error("Error reading db: ", e);
    process.exit(1);
  }
}
run();
