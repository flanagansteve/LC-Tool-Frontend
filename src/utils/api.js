import { setSessionExpiry } from "./auth";
import { snakeCase, camelCase } from "lodash";
// import history from "../history";

const API_BASEURL = "/api";

export const objectToSnakeCase = object => {
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

export const objectToCamelCase = object => {
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
  const fetchParams = {
    method: requestType,
  };
  if (requestType && requestType !== "GET") {
    fetchParams.body = JSON.stringify(objectToSnakeCase(params));
  }
  const response = await fetch(requestURL, fetchParams);
  if (response.status === 401 || response.status === 403) {
    // history.push("/login");
    // // TODO show this error to the user
    // return Promise.reject(
    //   "Error: Attempted to make unauthenticated API request. Redirecting to login."
    // );
  } else if (response.status < 200 || response.status >= 400) {
    // TODO show this error to the user
    if (returnFullResponse) {
      return response;
    } else {
      return Promise.reject(response);
    }
  }

  if (returnFullResponse) return response;
  return objectToCamelCase(await response.json());
};

export const postFile = async (url, file, returnFullResponse) => {
  const requestURL = API_BASEURL + url;
  const form = new FormData();
  form.append("file", file);
  const headers = new Headers();
  headers.append("Content-Type", "application/pdf");
  const response = await fetch(requestURL, {
    method: "POST",
    body: form,
    headers
  });
  if (response.status === 401 || response.status === 403) {
    // history.push("/login");
    // // TODO show this error to the user
    // return Promise.reject(
    //   "Error: Attempted to make unauthenticated API request. Redirecting to login."
    // );
  } else if (response.status < 200 || response.status >= 400) {
    // TODO show this error to the user
    if (returnFullResponse) {
      return response;
    } else {
      return Promise.reject(response);
    }
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
  if (json.userEmployee.employer)
    return { ...json.userEmployee, business: json.usersEmployer };
  else return { ...json.userEmployee, bank: json.usersEmployer };
};

export const logOut = async setUser => {
  const requestURL = "/api/user/logout/";
  const response = await fetch(requestURL, {
    method: "POST"
  });
  if (response.status !== 200) {
    console.error("Error logging out: recieved status code " + response.status);
  }
  setSessionExpiry(null);
  setUser(null);
  // TODO figure out why this doesn't work
  // history.push("/login");
};
