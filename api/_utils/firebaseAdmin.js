import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Parse the service account JSON from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

// Initialize Firebase Admin SDK
// This (getApps().length === 0) check prevents re-initialization in Vercel's dev environment
const app = getApps().length === 0 
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };