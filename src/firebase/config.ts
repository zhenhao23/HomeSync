import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
// Import getAnalytics conditionally
let analytics = null;

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Analytics only in browser environment and only if needed
if (typeof window !== "undefined") {
  // Dynamically import analytics to prevent SSR issues
  import("firebase/analytics")
    .then(({ getAnalytics }) => {
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.error("Analytics initialization error:", error);
      }
    })
    .catch((err) => {
      console.error("Failed to load analytics module:", err);
    });
}

export { analytics };
export default app;
