/**
 * Firebase client initialisation
 * Uses env vars for all config — never hardcoded
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, signInAnonymously, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton — avoid re-initialising on HMR
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | null = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

db = getFirestore(app);
auth = getAuth(app);

// Analytics only runs in browser
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics: _getAnalytics }) => {
    analytics = _getAnalytics(app);
  });
}

/** Ensure the user has an anonymous Firebase identity */
export async function ensureAnonymousAuth(): Promise<string | null> {
  try {
    if (auth.currentUser) return auth.currentUser.uid;
    const { user } = await signInAnonymously(auth);
    return user.uid;
  } catch {
    return null;
  }
}

export { db, auth, analytics };
export default app;
