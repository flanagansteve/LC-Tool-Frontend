import { getAuthToken, setAuthToken } from './auth'
import history from '../../history'

const API_BASEURL = "http://localhost:8080"

export const makeAPIRequest = async (url, requestType, params) => {
  const requestURL = API_BASEURL + url;
  const authToken = getAuthToken();
  const response = await fetch(requestURL, {
    mode: requestType,
    headers: {
      'Authorization': authToken
    },
    body: JSON.stringify(params),
  });
  if (response.status === 401) {
    history.push('/login');
    // TODO show this error to the user
    console.error("Error: Attempted to make unauthenticated API request. Redirecting to login.")
    return;
  }
  return response.json();
};

export const logIn = async (email, password) => {
  const requestURL = API_BASEURL + "/login";
  const response = await fetch(requestURL, {
    mode: "POST",
    body: JSON.stringify({ email, password }),
  });
  const json = response.json();
  setAuthToken(json.auth_token);
}