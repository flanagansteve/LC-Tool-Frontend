import { useEffect, createContext, useContext } from 'react';
import { useHistory } from 'react-router-dom';

export const UserContext = createContext([null, () => null]);
const SESSION_EXPIRY = 'session_expiry';

export const getSessionExpiry = () => {
  return false;
  /* will return to persistence at a later time */
  // const now = new Date();
  // const expirySeconds = localStorage.getItem("session_expiry");
  // if (expirySeconds && now.getTime() > expirySeconds) {
  //   return null;
  // }
  // return localStorage.getItem("auth_token");
}

export const setSessionExpiry = (expiry) => {
  // TODO change this expiry date to be consistent with the backend
  localStorage.setItem(SESSION_EXPIRY, expiry);
}

export const useAuthentication = (nextRoute) => {
  const history = useHistory();
  const [user] = useContext(UserContext);
  useEffect(() => {
    if (user) return;
    const sessionExists = getSessionExpiry();
    if (!sessionExists) {
      history.push("/login", { nextRoute });
    }
  }, [user, history, nextRoute])
}