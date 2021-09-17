import './App.css';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import Channel from './components/Channel';
import Loader from './components/Loader';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MSG_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

initializeApp(firebaseConfig);

function App() {
  const auth = getAuth();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      console.log('currentUser', user);

      if (authUser) {
        setUser(authUser);
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [auth, initializing]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();

    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err.message);
    }
  };

  const render = () => {
    if (initializing)
      return (
        <div className="flex justify-center items-center h-full">
          <Loader variant="primary" size="lg" />
        </div>
      );

    if (user) return <Channel user={user} />;

    return (
      <div className="flex justify-center items-center h-full">
        <button
          onClick={signInWithGoogle}
          className="flex justify-center items-center pl-6 pr-8 py-3 rounded shadow-button focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-white hover:bg-gray-50 text-gray-600 font-medium "
        >
          Sign In with Google
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <header>
        <div className="flex items-center">
          {user && (
            <button
              onClick={async () => {
                auth.signOut();
              }}
              className="mr-4 py-2 px-4 rounded focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-transparent hover:bg-primary-50 font-medium text-sm text-primary-500 hover:text-white tracking-wide transition-all"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>
      <main className="flex-1">{render()}</main>
    </div>
  );
}

export default App;
