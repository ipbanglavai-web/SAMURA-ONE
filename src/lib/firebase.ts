import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  projectId: "gen-lang-client-0477283342",
  appId: "1:1005502270346:web:56d412b31cb2f0159c9673",
  apiKey: "AIzaSyD3DUaQXTMtRV-G7pLxUPYE9bv6ymKe2Gc",
  authDomain: "gen-lang-client-0477283342.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-samuraone-6351e0be-e401-4ebd-af5e-7f0ce1d63bf9",
  storageBucket: "gen-lang-client-0477283342.firebasestorage.app",
  messagingSenderId: "1005502270346",
  measurementId: "",
  oAuthClientId: "1005502270346-ip4kk92thtvd0r2dnfjlr55ria2c93eb.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

function initFirestoreInstance(): Firestore {
  try {
    if (firebaseConfig.firestoreDatabaseId) {
      try {
        return getFirestore(app, firebaseConfig.firestoreDatabaseId);
      } catch {
        return getFirestore(app);
      }
    }
    return getFirestore(app);
  } catch {
    return getFirestore(app);
  }
}

export const db = initFirestoreInstance();
export const auth = getAuth(app);
export default app;
