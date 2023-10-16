import axios from "axios";
import Cookies from "js-cookie";
import { useContext } from "react";
import { HostContext } from "./contexts/HostContext";
import buildLink from "./urls";
// const cookies = new Cookies();

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
  headers: { Authorization: "Bearer " + Cookies.get("api-token") },
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
  Cookies.set("api-token", token, { expires: 7, path: "/" });
};

// Function to get the token from cookies
const getTokenFromCookie = () => {
  return Cookies.get("api-token");
};

// Add an interceptor to inject the token into requests
axiosServer.interceptors.request.use((config) => {
  // console.log("url" , config.url);
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Check if the request URL contains "undefined"
  // if (config.url && config.url.includes("undefined")) {
  //   const routePathname = window.location.pathname; // Get the route pathname
  //   console.log(`Request URL contains "undefined" at route: ${routePathname}`);
  // }

  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

axiosServer.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error?.response?.status === 401 &&
      !error.config._retry &&
      !isRefreshing
    ) {
      error.config._retry = true;
      isRefreshing = true;

      let requestBody = {
        client_id: "shopping_oauth_client",
        client_secret: "shopping_oauth_secret",
        source_id: 1,
      };
      let requestHeader = {
        Authorization: "Basic dGVzdGNsaWVudDp0ZXN0cGFzcw==",
      };

      try {
        // Request a new token
        const response = await axios.post(buildLink("token"), requestBody, {
          headers: requestHeader,
        });
        const newToken = response.data.access_token;

        // Update the token in your authentication state or cookie
        Cookies.set("api-token", response.data.access_token, { expires: 15 });

        // Trigger the onRefreshed callback to notify other requests
        onRefreshed(newToken);
        // Refresh the page
        if (typeof window !== "undefined") {
          window.location.reload();
        }
        // Retry the original request with the new token
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axiosServer(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export {
  axiosServer,
  setTokenInCookie,
  getTokenFromCookie,
  getToken,
  setAuthorizationHeader,
};
