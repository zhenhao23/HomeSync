import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

// Safer parsing of service account credentials
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
};

// Defensive initialization with more robust error checking
if (!admin.apps.length) {
  try {
    // Validate required credentials
    if (!serviceAccount.projectId) {
      throw new Error("Missing FIREBASE_PROJECT_ID");
    }
    if (!serviceAccount.clientEmail) {
      throw new Error("Missing FIREBASE_CLIENT_EMAIL");
    }
    if (!serviceAccount.privateKey) {
      throw new Error("Missing FIREBASE_PRIVATE_KEY");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    // Optionally, you might want to exit the process if Firebase can't initialize
    // process.exit(1);
  }
}

export const verifyToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const getFirebaseAdmin = () => admin;
