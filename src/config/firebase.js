// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Analytics removed - often blocked by ad blockers and not essential for functionality

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPGaSHpPOWiHp-ykTz5Uu36YHRYq66f0E",
  authDomain: "fsfe-surge-70afe.firebaseapp.com",
  projectId: "fsfe-surge-70afe",
  storageBucket: "fsfe-surge-70afe.firebasestorage.app",
  messagingSenderId: "687389496867",
  appId: "1:687389496867:web:00cdd3fa773616c84a4396",
  measurementId: "G-K2X44G8XRR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics removed - it was causing ERR_BLOCKED_BY_CLIENT errors
// (blocked by ad blockers). Not essential for app functionality.

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
