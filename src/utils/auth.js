import { useEffect, createContext, useContext } from 'react';
import { useHistory } from 'react-router-dom';

export const UserContext = createContext([null, () => null]);

export const getSessionUser = () => {
  const now = new Date();
  const expirySeconds = localStorage.getItem("session_expiry");
  if (expirySeconds && now.getTime() > expirySeconds) {
    return undefined;
  }
  return localStorage.getItem("auth_token");
}

export const setSessionUser = (newUser) => {
  // TODO change this expiry date to be consistent with the backend
  localStorage.setItem("session_expiry", new Date().getTime() + 60);
  localStorage.setItem("session_user", newUser);
}

export const useAuthentication = () => {
  const history = useHistory();
  const [user] = useContext(UserContext);
  useEffect(() => {
    if (user) return;
    const currentToken = getSessionUser();
    if (!currentToken) {
      history.push("/login");
    }
  }, [user, history])
}