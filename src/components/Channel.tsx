import { useState, useEffect, useRef } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { useCollectionData } from '../hooks/useCollectionData';
import Message from '../components/Message';

const Channel = ({ user }) => {
  const db = getFirestore();
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));
  const { docs: messages, error } = useCollectionData(q);

  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>();
  const bottomRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewMessage(e.currentTarget.value);
  };

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const trimmed = newMessage.trim();
    if (trimmed) {
      addDoc(collection(db, 'messages'), {
        content: trimmed,
        createdAt: serverTimestamp(),
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto h-full">
        <div className="max-w-screen-lg mx-auto py-4">
          <div className="border-b dark:border-gray-600 border-gray-200 py-8 mb-4">
            <div className="font-bold text-3xl text-center">
              <p className="mb-1">Welcome to</p>
              <p className="mb-3">React FireChat</p>
            </div>
            <p className="text-gray-400 text-center">
              This is the beginning of this chat.
            </p>
          </div>
          <ul>
            {messages.map((message) => (
              <Message key={message.id} {...message} />
            ))}
          </ul>
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-4 mb-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-row max-w-screen-lg mx-auto px-4 py-3 rounded-md shadow-md bg-gray-200 dark:bg-coolDark-400 dark:text-white "
        >
          <input
            ref={inputRef}
            value={newMessage}
            onChange={handleChange}
            placeholder="Say something..."
            className="flex-1 bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage}
            className="font-semibold text-sm tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Channel;
