const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

// Your Firebase configuration (from your .env or firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyA9rKpLg7iMYD-E2dbWgGKrcm-JR1qKwSw",
  authDomain: "homesync-2407f.firebaseapp.com",
  projectId: "homesync-2407f",
  storageBucket: "homesync-2407f.firebasestorage.app",
  messagingSenderId: "212471215050",
  appId: "1:212471215050:web:e0d24d11820b5dad175533",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to generate ID token
async function generateIdToken(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();
    console.log("Generated ID Token:", idToken);
    return idToken;
  } catch (error) {
    console.error("Error generating ID token:", error);
  }
}

// Use the function (replace with your test user credentials)
generateIdToken("weezhenhao@gmail.com", "12345678");
