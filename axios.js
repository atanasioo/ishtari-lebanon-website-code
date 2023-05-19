import axios from "axios";
import Cookies from "js-cookie";
import buildLink from "./urls";
async function getToken() {

  excuting = true;
  let requestBody = {
    client_id: "shopping_oauth_client",
    client_secret: "shopping_oauth_secret",
    source_id: 1,
  };
  let requestHeader = {
    Authorization: "Basic dGVzdGNsaWVudDp0ZXN0cGFzcw==",
  };

  axios.post(buildLink("token"), requestBody, {
      headers: requestHeader
    })
    .then((response) => {
      Cookies.set("api-token", response.data.access_token, { expires: 15 });
    
      excuting = false;
      if (typeof window !== "undefined") window.location.reload();
    });
}
var excuting = false;
if (typeof Cookies.get("api-token") === "undefined") {
  if (!excuting) {
    getToken();
  }
}

const _axios = axios.create({
  headers: { Authorization: "Bearer " + Cookies.get("api-token") },
});

_axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
_axios.interceptors.response.use(
  function (response) {

    return response;
  },
  function (error) {

    if (
      typeof error.response !== "undefined" &&
      error?.response?.status === 401
    ) {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export default _axios;
