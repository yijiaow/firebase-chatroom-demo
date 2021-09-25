import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import CreateChannelForm from './CreateChannelForm';

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const { user, auth } = useContext(AuthContext);

  return (
    <div className="flex flex-col h-full">
      <header>
        <div className="flex items-center">
          <Modal
            activator={({ openModal }) => (
              <button
                onClick={openModal}
                className="flex justify-center items-center pl-6 pr-8 py-3 rounded shadow-button focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 bg-white hover:bg-gray-50 text-gray-600 font-medium"
              >
                <span>Create Channel</span>
                <img
                  src="/icons/plus-circle.svg"
                  alt="Plus Icon"
                  width={20}
                  height={20}
                  className="ml-3"
                />
              </button>
            )}
          >
            {({ closeModal }) => <CreateChannelForm onClose={closeModal} />}
          </Modal>
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
    </div>
  );
};

export default Home;
