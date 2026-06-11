import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDTyRxogzAvxIgPysZarLIKqEdk1oNwU4o",
  authDomain: "memoly-d1fc6.firebaseapp.com",
  projectId: "memoly-d1fc6",
  storageBucket: "memoly-d1fc6.firebasestorage.app",
  messagingSenderId: "122907120070",
  appId: "1:122907120070:web:f1cfe7528320a546b0a2c7",
  measurementId: "G-0V1M5VV8NT",
  databaseURL:
    "https://memoly-d1fc6-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const db = getDatabase(app);
