import { useContext, useEffect } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import * as qs from 'qs';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';

interface ConfirmEmailLinkProps extends RouteComponentProps {}

const ConfirmEmailLink: React.FC<ConfirmEmailLinkProps> = ({ location }) => {
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  const confirmEmailLink = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email =
        window.localStorage.getItem('emailForSignIn') ||
        window.prompt('Please provide your email for confirmation');

      if (email) {
        let result;
        try {
          result = await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');

          const { channelId } = qs.parse(location.search, {
            ignoreQueryPrefix: true,
          });

          history.push(`/channels/${channelId}`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  useEffect(() => {
    confirmEmailLink();
  }, []);

  return <div></div>;
};

export default ConfirmEmailLink;
