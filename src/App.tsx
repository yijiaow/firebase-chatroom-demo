import './App.css';
import { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import SignIn from './components/SignIn';
import ConfirmEmailLink from './components/ConfirmEmailLink';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        user ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { referrer: routeProps.location.pathname },
            }}
          />
        )
      }
    ></Route>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <PrivateRoute exact path="/" component={Home} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route path="/confirm-email" component={ConfirmEmailLink} />
      </Router>
    </AuthProvider>
  );
}

export default App;
