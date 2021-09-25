import { useState } from 'react';
import { XIcon } from '@heroicons/react/solid';

interface EmailChipsProps {
  emails: string[];
  onAdd: (email: string) => void;
  onRemove: (email: string) => void;
}

const EmailChips: React.FC<EmailChipsProps> = ({ emails, onAdd, onRemove }) => {
  const [val, setVal] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleKeyDown = (e) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      const email = val.trim();

      if (email && !error) {
        onAdd(email);
      }
    }
  };

  const isEmail = (email: string) => {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  };

  const isInList = (email: string) => {
    return emails.includes(email);
  };

  const isValid = () => {
    if (!isEmail(val)) {
      setError('Invalid email address');
    }

    if (isInList(val)) {
      setError('Email has already been added');
    }
  };

  const handleRemove = (toBeRemoved: string) => {
    onRemove(toBeRemoved);
  };

  return (
    <div className="flex flex-col">
      {/* {emails.map(
        (email) =>
          console.log('email!!!', email) || (
            <div key={email} className="w-full">
              <span className="bg-green-500">{email}</span>
              <button onClick={() => handleRemove(email)}>
                <XIcon />
              </button>
            </div>
          )
      )} */}
      <div className="rounded-md">
        <span className="bg-green-500">ttwyj250@gmail.com</span>
        <button
          onClick={() => handleRemove('ttwyj250@gmail.com')}
          className="flex justify-center items-center focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-white hover:bg-gray-50 text-gray-600 font-medium"
        >
          <XIcon />
        </button>
      </div>
      <input
        placeholder="Press `Enter` to add email address"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={isValid}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default EmailChips;
