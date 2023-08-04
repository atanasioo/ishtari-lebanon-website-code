import axios from "axios";
import Cookies from "js-cookie";
import buildLink from "./urls";
// const cookies = new Cookies();

const getToken = async (site_host) => {



  let requestBody = {
    client_id: "shopping_oauth_client",
    client_secret: "shopping_oauth_secret",
    source_id: 1
  };
  let requestHeader = {
    Authorization: "Basic dGVzdGNsaWVudDp0ZXN0cGFzcw=="
  };

  // console.log( "*********************");
     console.log("site_host-1");
  // console.log( "*********************");
  const response = await axios.post(
    buildLink("token", undefined, undefined, site_host),
    requestBody,
    {
      headers: requestHeader
    }

  );


  //   Cookies.set("api-token", response.data.access_token, { expires: 15 });

  //   excuting = false;
  //   if (typeof window !== "undefined") window.location.reload();
  return response.data;
};

// Create an Axios instance with custom configuration
const axiosServer = axios.create({
  headers: { Authorization: "Bearer " + Cookies.get("api-token") }
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
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosServer.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      typeof error.response !== "undefined" &&
      error?.response?.status === 401
    ) {
      let requestBody = {
        client_id: "shopping_oauth_client",
        client_secret: "shopping_oauth_secret",
        source_id: 1
      };
      let requestHeader = {
        Authorization: "Basic dGVzdGNsaWVudDp0ZXN0cGFzcw=="
      };
      axios
        .post(buildLink("token"), requestBody, {
          headers: requestHeader
        })
        .then((response) => {
          Cookies.set("api-token", response.access_token, { expires: 15 });
          window.location.reload();
        });
    }

    return Promise.reject(error);
  }
);

// let isRefreshing = false;
// let refreshSubscribers = [];

// const subscribeTokenRefresh = (callback) => {
//   refreshSubscribers.push(callback);
// };

// const onRefreshed = (token) => {
//   refreshSubscribers.map((callback) => callback(token));
// };


// axiosServer.interceptors.response.use(
//   (response) => {
//     console.log("hello response");
//     return response;
//   },
//   async (error) => {
//     console.log("hello error");
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       let newToken;
//       if (isRefreshing) {
//         // Wait for token refresh
//         return new Promise((resolve) => {
//           subscribeTokenRefresh((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             resolve(axiosServer(originalRequest));
//           });
//         });
//       }

//       isRefreshing = true;
//       originalRequest._retry = true;

//       try {
//         // Request a new token
//         const response = await getToken(); // Replace with your token renewal logic
//         const newToken = response.access_token;

//         // Update the token in your authentication state or cookie
//         Cookies.set("api-token", response.access_token, { expires: 15 });

//         // Retry the original request with the new token
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return axiosServer(originalRequest);
//       } catch (refreshError) {
//         // Handle token renewal error
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//         onRefreshed(newToken);
//         refreshSubscribers = [];
//       }
//     }

//     // Handle other errors
//     return Promise.reject(error);
//   }
// );

export {
  axiosServer,
  setTokenInCookie,
  getTokenFromCookie,
  getToken,
  setAuthorizationHeader
};
