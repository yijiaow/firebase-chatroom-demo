import { useContext, useEffect } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { LocationState } from 'history';
import * as qs from 'qs';
import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
} from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SignInProps
  extends RouteComponentProps<
    {},
    StaticContext,
    LocationState & { referrer: string }
  > {}

const SignIn: React.FC<SignInProps> = ({ location }) => {
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  const signInWithProvider = async (authProvider: string) => {
    let provider;
    switch (authProvider) {
      case 'google':
        provider = new GoogleAuthProvider();
        break;
      case 'twitter':
        provider = new TwitterAuthProvider();
        console.log('clicked Twitter sign in');
        break;
      case 'github':
        provider = new GithubAuthProvider();
        break;
    }
    auth.useDeviceLanguage();

    try {
      const { user } = await signInWithPopup(auth, provider);

      const userRef = await doc(db, 'users', user.uid);
      setDoc(
        userRef,
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          authProvider: authProvider,
        },
        { merge: true }
      );

      history.push(location.state.referrer as string);
    } catch (err: unknown) {
      if (err instanceof Error)
        console.error(`Things exploded! ${err.message}`);
    }
  };

  const signInWithToken = async () => {
    const { token } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    try {
      await signInWithCustomToken(auth, token);

      history.push(location.state.referrer as string);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(JSON.stringify(err));
      }
    }
  };

  useEffect(() => {
    signInWithToken();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <button
        onClick={() => signInWithProvider('google')}
        className="flex justify-center items-center pl-6 pr-8 py-3 rounded shadow-button focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-white hover:bg-gray-50 text-gray-600 font-medium"
      >
        Sign In with Google
      </button>
      <button
        onClick={() => signInWithProvider('twitter')}
        className="flex justify-center items-center pl-6 pr-8 py-3 rounded shadow-button focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-white hover:bg-gray-50 text-gray-600 font-medium"
      >
        Sign In with Twitter
      </button>
      <button
        onClick={() => signInWithProvider('github')}
        className="flex justify-center items-center pl-6 pr-8 py-3 rounded shadow-button focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-white hover:bg-gray-50 text-gray-600 font-medium"
      >
        Sign In with GitHub
      </button>
    </div>
  );
};

export default SignIn;
