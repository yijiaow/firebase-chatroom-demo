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
  OAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
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

  const signInWithProvider = async (providerId: string) => {
    const provider = getProviderForProviderId(providerId);

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
          providerId,
        },
        { merge: true }
      );

      history.push(location.state.referrer as string);
    } catch (err: unknown) {
      if (
        err instanceof FirebaseError &&
        err.code === 'auth/account-exists-with-different-credential'
      ) {
        const email = err.customData!.email as string;
        const pendingCredential = OAuthProvider.credentialFromError(err);

        fetchSignInMethodsForEmail(auth, email).then((methods) => {
          var provider = getProviderForProviderId(methods[0]);
          // TODO: Let the user know that they already have an account with a different provider,
          // and let them validate the fact they want to sign in with this provider.

          // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
          // so in real scenario you should ask the user to click on a "continue" button
          // that will trigger the signInWithPopup.
          if (pendingCredential) {
            signInWithPopup(auth, provider).then((result) =>
              linkWithCredential(result.user, pendingCredential)
            );
          }
        });
      }
    }
  };

  const getProviderForProviderId = (providerId: string) => {
    switch (providerId) {
      case 'google.com':
        return new GoogleAuthProvider();
      case 'twitter.com':
        return new TwitterAuthProvider();
      case 'github.com':
        return new GithubAuthProvider();
      default:
        return new GoogleAuthProvider();
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

  // useEffect(() => {
  //   signInWithToken();
  // }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <button
        onClick={() => signInWithProvider('google.com')}
        className="flex justify-center items-center pl-6 pr-8 py-3 rounded shadow-button focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-white hover:bg-gray-50 text-gray-600 font-medium"
      >
        Sign In with Google
      </button>
      <button
        onClick={() => signInWithProvider('twitter.com')}
        className="flex justify-center items-center pl-6 pr-8 py-3 rounded shadow-button focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-white hover:bg-gray-50 text-gray-600 font-medium"
      >
        Sign In with Twitter
      </button>
      <button
        onClick={() => signInWithProvider('github.com')}
        className="flex justify-center items-center pl-6 pr-8 py-3 rounded shadow-button focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-white hover:bg-gray-50 text-gray-600 font-medium"
      >
        Sign In with GitHub
      </button>
    </div>
  );
};

export default SignIn;
