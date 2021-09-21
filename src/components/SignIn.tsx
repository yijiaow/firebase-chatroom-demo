import { useContext, useCallback } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';

interface SignInProps {}

const SignIn: React.FC<SignInProps> = ({}) => {
  const { user, auth } = useContext(AuthContext);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();

    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err.message);
    }
  };

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

export default SignIn;
