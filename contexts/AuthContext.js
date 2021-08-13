import { createContext, useContext } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export function AuthWrapper({ children }) {
  const getUser = () => {
    const token = getToken();
    if (token != null) return jwtDecode(token);
    return null;
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || null;
    } else {
      return null;
    }
  };

  const isLoggedIn = () => {
    const data = getUser();
    if (data === null) return false;

    const now = Math.round(Date.now().valueOf() / 1000);
    if (data.exp == null) {
      removeUserSession();
      return false;
    } else if (data.exp < now) {
      removeUserSession();
      return false;
    }

    return true;
  };

  const isLoggedInAsAdmin = () => {
    const data = getUser();
    if (data === null) return false;

    const now = Math.round(Date.now().valueOf() / 1000);
    if (data.exp == null) {
      removeUserSession();
      return false;
    } else if (data.exp < now) {
      removeUserSession();
      return false;
    }

    if (data.role === 'admin') return true;

    return false;
  };

  const setUserSession = (token) => {
    localStorage.setItem('token', token);
  };

  const removeUserSession = () => {
    localStorage.removeItem('token');
  };

  const clickMe = () => {
    alert('Hello!');
  };

  let sharedState = {
    name: 'Auth Context',
    getToken,
    getUser,
    isLoggedIn,
    isLoggedInAsAdmin,
    setUserSession,
    removeUserSession,
    clickMe,
  };

  return (
    <AuthContext.Provider value={sharedState}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
