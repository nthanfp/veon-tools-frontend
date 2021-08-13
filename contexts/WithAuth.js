import { useRouter } from 'next/router';
import { useAuthContext } from './AuthContext';

const WithAuth = (WrappedComponent) => {
  return (props) => {
    // checks whether we are on client / browser or server.
    const AuthContext = useAuthContext();
    if (typeof window !== 'undefined') {
      const Router = useRouter();

      const accessToken = AuthContext.isLoggedIn();
      // If there is no access token we redirect to "/" page.
      if (accessToken === false) {
        Router.replace('/users/login');
        return null;
      }

      // If this is an accessToken we just render the component that was passed With all its props

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

const WithoutAuth = (WrappedComponent) => {
  return (props) => {
    // checks whether we are on client / browser or server.
    const AuthContext = useAuthContext();
    if (typeof window !== 'undefined') {
      const Router = useRouter();

      const accessToken = AuthContext.isLoggedIn();
      // If there is no access token we redirect to "/" page.
      if (accessToken === true) {
        Router.replace('/');
        return null;
      }

      // If this is an accessToken we just render the component that was passed With all its props

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export { WithAuth, WithoutAuth };
