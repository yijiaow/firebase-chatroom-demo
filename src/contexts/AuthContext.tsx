import { createContext, useState, useEffect } from 'react';
import { signOut as _signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User } from 'firebase/auth';
import Loader from '../components/Loader';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);

      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [auth, initializing]);

  const signOut = async () => _signOut(auth);

  if (initializing)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader variant="primary" size="lg" />
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, auth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
