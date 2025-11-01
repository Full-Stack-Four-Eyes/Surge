import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase Configuration
// IMPORTANT: Set up your Firebase credentials in .env file
// 1. Copy .env.example to .env
// 2. Get your Firebase config from: Firebase Console > Project Settings > Your apps
// 3. Replace placeholder values in .env with your actual Firebase credentials
// See README.md and QUICK_FIREBASE_SETUP.md for detailed instructions

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Validate that Firebase config is provided
const hasValidConfig = firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your-api-key-here' &&
  firebaseConfig.apiKey !== undefined &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your-project-id'

if (!hasValidConfig) {
  console.error(
    '⚠️ Firebase configuration is missing or invalid!\n' +
    'Please set up your .env file with Firebase credentials.\n' +
    '1. Copy .env.example to .env\n' +
    '2. Get your Firebase config from Firebase Console\n' +
    '3. Replace placeholder values in .env\n' +
    '4. Restart the dev server after updating .env\n' +
    'See README.md for detailed instructions.'
  )
  console.error('Current config:', {
    apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
    projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
    authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing'
  })
}

// Initialize Firebase
let app
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  console.error('Failed to initialize Firebase:', error)
  throw error
}

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app

