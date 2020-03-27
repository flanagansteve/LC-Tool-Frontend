import { setSessionExpiry } from "./auth";
import { snakeCase, camelCase } from "lodash";
import history from "../history";

const API_BASEURL = "/api";

const objectToSnakeCase = object => {
  let newObject = {};
  if (typeof object !== "object" || object === null) {
    return object;
  } else if (Array.isArray(object)) {
    return object.map(objectToSnakeCase);
  } else if (typeof object === "object" && object !== null) {
    Object.keys(object).forEach(key => {
      newObject[snakeCase(key)] = objectToSnakeCase(object[key]);
    });
  } else {
    console.error("objectToSnakeCase failed - unrecognized type.");
  }
  return newObject;
};

const objectToCamelCase = object => {
  let newObject = {};
  if (typeof object !== "object" || object === null) {
    return object;
  } else if (Array.isArray(object)) {
    return object.map(objectToCamelCase);
  } else if (typeof object === "object" && object !== null) {
    Object.keys(object).forEach(key => {
      newObject[camelCase(key)] = objectToCamelCase(object[key]);
    });
  } else {
    console.error("objectToCamelCase failed - unrecognized type.");
  }
  return newObject;
};

export const makeAPIRequest = async (
  url,
  requestType,
  params,
  returnFullResponse
) => {
  const requestURL = API_BASEURL + url;
  const response = await fetch(requestURL, {
    method: requestType,
    body: JSON.stringify(objectToSnakeCase(params))
  });
  if (response.status === 401) {
    history.push("/login");
    // TODO show this error to the user
    console.error(
      "Error: Attempted to make unauthenticated API request. Redirecting to login."
    );
    return;
  } else if (response.status < 200 || response.status >= 400) {
    // TODO show this error to the user
    console.error("Error: Nonstandard status code received in API response.");
  }

  if (returnFullResponse) return response;
  return objectToCamelCase(await response.json());
};

export const logIn = async (email, password) => {
  const requestURL = "/api/user/login/";
  const response = await fetch(requestURL, {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  if (response.status !== 200) {
    throw new Error(
      "Error logging in: recieved status code " + response.status
    );
  }
  const json = objectToCamelCase(await response.json());
  setSessionExpiry(new Date(json.sessionExpiry).getTime());
  return { ...json.userEmployee, bank: json.usersEmployer };
};
