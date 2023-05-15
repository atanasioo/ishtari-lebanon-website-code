import axios from "axios";
import Cookies from "js-cookie";
import buildLink from "./urls";
async function getToken() {
  excuting = true;
  let requestBody = {
    client_id: "shopping_oauth_client",
    client_secret: "shopping_oauth_secret",
    source_id: 1
  };
  let requestHeader = {
    Authorization: "Basic dGVzdGNsaWVudDp0ZXN0cGFzcw=="
  };
  console.log("======================");
  console.log("hiiiii");
  axios
    .post(buildLink("token"), requestBody, {
      headers: requestHeader
    })
    .then((response) => {
      Cookies.set("api-token", response.data.access_token, { expires: 15 });
      console.log("======================");
      console.log("generate");
      excuting = false;
      window.location.reload();
    });
}
var excuting = false;
if (typeof Cookies.get("api-token") === "undefined") {
  if (!excuting) {
    getToken();
  }
}

const _axios = axios.create({
  headers: { Authorization: "Bearer " + Cookies.get("api-token") }
});
console.log("======================");
console.log("create");
_axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    console.log("======================");
    console.log("reject");
    return Promise.reject(error);
  }
);
_axios.interceptors.response.use(
  function (response) {
    console.log("======================");
    console.log("use");
    return response;
  },
  function (error) {
    console.log("======================");
    console.log("retry");
    if (
      typeof error.response !== "undefined" &&
      error?.response?.status === 401
    ) {
      window.location.reload();

      // getToken();
      //     if(!excuting){
      // getToken();}
    }
    console.log("======================");
    console.log("reject");
    return Promise.reject(error);
  }
);

export default _axios;
