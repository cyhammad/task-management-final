import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from './serviceAccountKey.json';

const app = !getApps().length ? initializeApp({
  credential: cert(serviceAccount)
}) : getApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth(app);
export { app, db, storage, auth };