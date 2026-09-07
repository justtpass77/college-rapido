// ===========================================================
// Firebase configuration (kept modular so it can be swapped in
// for the mock services with minimal changes).
//
// For this demo/prototype we run entirely on mock data + localStorage
// (see authService.ts / rideService.ts), so Firebase is NOT actually
// initialized unless valid environment variables are supplied.
//
// To go live with real Firebase Auth + Firestore:
//  1. `npm install firebase` (already installed)
//  2. Fill in the config values below (or via import.meta.env vars)
//  3. Flip `USE_FIREBASE` to true
//  4. Implement the Firebase-backed versions of the functions inside
//     authService.ts / rideService.ts (the interfaces already match
//     what onAuthStateChanged / Firestore collections would need).
// ===========================================================

export const USE_FIREBASE = false;

const env = (import.meta as any).env ?? {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: env.VITE_FIREBASE_APP_ID ?? "",
};

let app: unknown = null;

export const getFirebaseApp = async () => {
  if (!USE_FIREBASE) return null;
  if (app) return app;
  const { initializeApp } = await import("firebase/app");
  app = initializeApp(firebaseConfig);
  return app;
};
