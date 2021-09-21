import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const { user, auth } = useContext(AuthContext);

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
    </div>
  );
};

export default Home;
