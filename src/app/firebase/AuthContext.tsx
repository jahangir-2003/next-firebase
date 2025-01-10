"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "./config";
import { User as FirebaseUser } from "firebase/auth"; // Import the correct Firebase User type
import { toast } from "react-toastify";

// User Type
interface User {
  uid: string;
  email: string | null;
  username: string | null;
}

// Context Type
interface AuthContextType {
  authUser: User | null;
  isLoading: boolean;
  signOut: () => void;
  setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthUserContext = createContext<AuthContextType>({
  authUser: null,
  isLoading: true,
  signOut: () => {},
  setAuthUser: () => {},
});

export default function useFirebaseAuth(): AuthContextType {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };

  const authStateChanged = async (user: FirebaseUser | null) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }
    setAuthUser({
      uid: user.uid,
      email: user.email,
      username: user.displayName,
    });
    setIsLoading(false);
  };

  const signOut = () => {
    authSignOut(auth)
      .then(() => clear())
      .then(() => {
        setAuthUser(null);
        toast("logged out successfully");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    isLoading,
    signOut,
    setAuthUser,
  };
}

export const AuthUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthUserContext);
