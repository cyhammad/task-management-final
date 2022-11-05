// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaOZ1_2JhaJJf9wUMwAoFid-EE_k2L7vU",
  authDomain: "taskmanagement-a5d8a.firebaseapp.com",
  databaseURL: "https://taskmanagement-a5d8a-default-rtdb.firebaseio.com",
  projectId: "taskmanagement-a5d8a",
  storageBucket: "taskmanagement-a5d8a.appspot.com",
  messagingSenderId: "1023271779969",
  appId: "1:1023271779969:web:893b13f6ba2d89b38c1780",
  databaseURL: "https://taskmanagement-a5d8a-default-rtdb.firebaseio.com/",
  serviceAccountId: "firebase-adminsdk-sl3jh@taskmanagement-a5d8a.iam.gserviceaccount.com",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth(app);
const database = getDatabase(app);
const messaging = {
  init: async() => {
    try {
      const msging = getMessaging(app)
      return msging
    } catch (err) {
      console.log(err)
    }
  }
}
export { app, db, storage, auth, messaging };