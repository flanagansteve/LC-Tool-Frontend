import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const getAuthToken = () => {
  const now = new Date();
  const expirySeconds = localStorage.getItem("auth_token_expiry");
  if (expirySeconds && now.getTime() > expirySeconds) {
    return undefined;
  }
  return localStorage.getItem("auth_token");
}

export const setAuthToken = (newToken) => {
  // TODO change this expiry date to be consistent with the backend
  localStorage.setItem("auth_token_expiry", new Date().getTime() + 86400000);
  localStorage.setItem("auth_token", newToken);
}

export const useAuthentication = () => {
  const history = useHistory();
  useEffect(() => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      history.push("/login");
    }
  }, [history])
}