import { setSessionUser } from './auth'
import { snakeCase } from 'lodash';
import history from '../history'

const API_BASEURL = "http://127.0.0.1:8000"

const objectToSnakeCase = (object) => {
  let newObject = {};
  if (typeof object !== "object" || object === null) {
    return object;
  } else if (Array.isArray(object)) {
    return object.map(objectToSnakeCase);
  } else if (typeof object === "object" && object !== null) {
    Object.keys(object).forEach((key) => {
      newObject[snakeCase(key)] = objectToSnakeCase(object[key]);
    })
  } else {
    console.error("objectToSnakeCase failed - unrecognized type.");
  }
  return newObject;
}

export const makeAPIRequest = async (url, requestType, params) => {
  const requestURL = API_BASEURL + url;
  const response = await fetch(requestURL, {
    method: requestType,
    body: JSON.stringify(objectToSnakeCase(params)),
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
  const requestURL = API_BASEURL + "/user/login/";
  const response = await fetch(requestURL, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (response.status !== 200) {
    throw new Error("Error logging in: recieved status code " + response.status);
  }
  const json = response.json();
  setSessionUser(json.user);
}