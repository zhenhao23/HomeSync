import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/config";

// Define the shape of your auth context
interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  signup: (email: string, password: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  getToken: () => Promise<string>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Provider component that wraps your app and makes auth object available to any
// child component that calls useAuth().
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sign up function
  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => userCredential.user
    );
  }

  // Sign in function
  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => userCredential.user
    );
  }

  // Sign out function
  function logout() {
    return signOut(auth);
  }

  // Function to get the Firebase ID token
  async function getToken() {
    if (!currentUser) throw new Error("Not authenticated");
    return await currentUser.getIdToken(true);
  }

  // Subscribe to user on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
