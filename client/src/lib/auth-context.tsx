import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  auth, 
  User, 
  createUserWithEmailAndPassword,
  sendEmailVerification,  
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from "./firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ Updated signup with verification
  async function signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user); // Send verification email
      await signOut(auth); // Logout until verified
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  // ✅ Updated login with verification check
  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth); // Logout unverified user
        throw new Error("Email not verified. Please check your inbox.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  const value = {
    currentUser,
    loading,
    signUp,
    login,
    logout,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
