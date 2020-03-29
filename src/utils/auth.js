import { useEffect, createContext, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeAPIRequest } from "./api";

export const UserContext = createContext([null, () => null]);
const SESSION_EXPIRY = "session_expiry";

export const getSessionExpiry = () => {
  const now = new Date();
  const expirySeconds = localStorage.getItem("session_expiry");
  if (expirySeconds && now.getTime() > expirySeconds) {
    return null;
  }
  return localStorage.getItem(SESSION_EXPIRY);
};

export const setSessionExpiry = expiry => {
  // TODO change this expiry date to be consistent with the backend
  localStorage.setItem(SESSION_EXPIRY, expiry);
};

export const useAuthentication = nextRoute => {
  const history = useHistory();
  let [user, setUser] = useContext(UserContext);

  useEffect(() => {
    if (user) return;
    const sessionExists = getSessionExpiry();
    if (!sessionExists) {
      history.push("/login", { nextRoute });
    } else {
      makeAPIRequest("/user/this_users_info/")
        .then(json =>
          setUser({ ...json.userEmployee, bank: json.usersEmployer })
        )
        .catch(err => {
          console.error(err);
          history.push("/login", { nextRoute });
        });
    }
  }, [user, setUser, history, nextRoute]);
};
