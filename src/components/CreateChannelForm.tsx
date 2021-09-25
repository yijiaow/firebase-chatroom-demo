import { useState, useContext } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AuthContext } from '../contexts/AuthContext';
import EmailChips from '../components/EmailChips';

interface CreateChannelFormProps {
  onClose: () => void;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({ onClose }) => {
  const { auth, user } = useContext(AuthContext);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [invites, setInvites] = useState<string[]>([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let docRef;
    try {
      docRef = await addDoc(collection(db, 'channels'), {
        name,
        createdAt: serverTimestamp(),
        uid: user.uid,
        members: [],
      });
      setName('');
      onClose();
    } catch (err) {
      console.error(err);
    }

    if (docRef) {
      const actionCodeSettings = {
        url: `http://localhost:3000/channels/${docRef.id}}`,
        handleCodeInApp: true,
      };
      let email = invites.length > 0 ? invites[0] : 'wangyijiaoo@gmail.com';
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      // // Obtain emailLink from the user.
      // if (isSignInWithEmailLink(auth, emailLink)) {
      //   await signInWithEmailLink(
      //     'user@example.com',
      //     'user@example.com',
      //     emailLink
      //   );
      // }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-72 mx-auto px-4 py-3 rounded-md shadow-md"
    >
      <h2 className="text-center text-lg mb-4">New Channel</h2>
      {step === 0 && (
        <>
          <input
            placeholder="Channel Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 pt-2 pb-1 border-b-2 border-gray-500 bg-transparent outline-none placeholder-gray-500 placeholder-opacity-50"
          />
          <button
            onClick={() => setStep(1)}
            className="mr-4 py-2 px-4 rounded focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-transparent hover:bg-primary-50 font-medium text-sm text-primary-500 hover:text-white tracking-wide transition-all"
          >
            Invite Friends
          </button>
        </>
      )}

      {step === 1 && (
        <EmailChips
          emails={invites}
          onAdd={(toBeAdded) => setInvites([...invites, toBeAdded])}
          onRemove={(toBeRemoved) =>
            setInvites(invites.filter((email) => email !== toBeRemoved))
          }
        />
      )}

      <button
        type="submit"
        className="mt-8 py-3 rounded shadow-button bg-white font-semibold text-sm tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateChannelForm;
