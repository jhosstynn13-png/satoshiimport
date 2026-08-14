import { initializeApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import config from '../firebase-applet-config.json';

// Suppress the known warning about the default database not being found when using a named database
setLogLevel('error');

const app = initializeApp(config);
export const db = getFirestore(app, config.firestoreDatabaseId);

export const auth = getAuth(app);

export const storage = getStorage(app);
