import axios from "axios";
import Cookies from "universal-cookie";
import buildLink from "./urls";

const cookies = new Cookies();

const getToken = async (site_host) => {
  let requestBody = {
    client_id: "shopping_oauth_client",
    client_secret: "shopping_oauth_secret",
    source_id: 1,
  };
  let requestHeader = {
    Authorization: "Basic dGVzdGNsaWVudDp0ZXN0cGFzcw==",
  };

  const response = await axios.post(
    buildLink("token", undefined, undefined, site_host),
    requestBody,
    {
      headers: requestHeader,
    }
  );

  //   Cookies.set("api-token", response.data.access_token, { expires: 15 });

  //   excuting = false;
  //   if (typeof window !== "undefined") window.location.reload();
  return response.data;
};

// Create an Axios instance with custom configuration
const axiosServer = axios.create({
  headers: { Authorization: "Bearer " + cookies.get("api-token") },
});

// Function to set the token in the axios instance headers
const setAuthorizationHeader = (token) => {
  axiosServer.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axiosServer.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  });
};

// Function to set the token in cookies
const setTokenInCookie = (token) => {
  cookies.set("api-token", token, { expires: 7, path: "/" });
};

// Function to get the token from cookies
const getTokenFromCookie = () => {
  return cookies.get("api-token");
};

// Add an interceptor to inject the token into requests
axiosServer.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export {
  axiosServer,
  setTokenInCookie,
  getTokenFromCookie,
  getToken,
  setAuthorizationHeader,
};
