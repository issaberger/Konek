import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: any | null;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userData: null,
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string, email: string | null, displayName: string | null) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        // Create new user profile
        const newUser = {
          uid,
          email: email || '',
          displayName: displayName || 'Itilizatè',
          grade_level: 'Not set',
          points: 0,
          badges: ['Nouvo Elèv'],
          streak_days: 0,
          last_active: new Date().toISOString(),
          homework_solved: 0
        };
        await setDoc(userRef, newUser);
        setUserData(newUser);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid, user.email, user.displayName);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid, currentUser.email, currentUser.displayName);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userData, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
