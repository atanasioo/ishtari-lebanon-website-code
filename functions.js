import { axiosServer } from "@/axiosServer.js";

import buildLink from "@/urls";

const getHost = async (host) => {
  let url = "";
  if (
    host === "ishtari" ||
    // (host === "localhost:3001" ||
    // host === "localhost:3000") ||
    host === "ishtari.com" ||
    host === "www.ishtari.com" ||
    host === "https://cloudgoup.com/" ||
    host === "https://www.cloudgoup.com/" ||
    host === "http://cloudgoup.com" ||
    host === "www.cloudgoup.com"
  ) {
    // url = "https://www.ishtari.com/";
    url = "https://www.ishtari.com/";
  } else if (
    host === "ishtari-ghana" ||
    host === "https://www.ishtari.com.gh/" ||
    host === "ishtari.com.gh"
  ) {
    url = "https://www.ishtari.com.gh/";
  } else if (
    host === "flo" ||
    host === "www.flo-lebanon.com" ||
    host === "www.flo-lebanon.com" ||
    host === "flo-lebanon.com"
  ) {
    url = "https://www.flo-lebanon.com/";
  } else if (
    host === "flo-bey" ||
    host === "www.flo-lebanon.com" ||
    host === "flo-lebanon.com"
  ) {
    url = "https://www.flo-lebanon.com/";
  } else if (
    host === "aalbeit" ||
    host === "www.aalbeit.com" ||
    host === "aalbeit.com"
  ) {
    url = "https://www.aalbeit.com/";
  } else if (host === "ishtari-usd" || host === "www.ishtari-usd.com") {
    url = "https://www.ishtari-usd.com/";
  } else if (
    host === "energy-plus" ||
    host === "www.energyplus-lb.com" ||
    host === "energyplus-lb.com"
  ) {
    url = "https://energyplus-lb.com/";
  }
  return url;
};

const getMainData = async (token, host) => {
  var data = [];
  var footer_data = [];
  var information_data = [];
  let response = {};

  data = await axiosServer.get(
    buildLink("headerv2", undefined, undefined, host),
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  footer_data = await axiosServer.get(
    buildLink("footerv2", undefined, undefined, host),
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  information_data = await axiosServer.get(
    buildLink("information", undefined, undefined, host),
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return (response = {
    data: data,
    footer_data: footer_data,
    information_data: information_data,
  });
};

export { getHost, getMainData };
