const API_BASEURL = "http://localhost:8080"

export async const makeAPIRequest = (url, requestType, params) => {
  const requestURL = API_BASEURL + url;
  const response = await fetch(requestURL, {
    mode: requestType,
    ...params,
  });
  return response
};