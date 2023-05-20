import _axios from "@/axios";
import {
  axiosServer,
  getToken,
  setAuthorizationHeader
} from "@/axiosServer.js";
import Layout from "@/components/layout/layout";
import "@/styles/globals.css";
import buildLink from "@/urls";
import useDeviceSize from "@/components/useDeviceSize";
import cookie from "cookie";
import axios from "axios";
import "@/config";

export default function App({ Component, pageProps, header_categories , footer_categories }) {
  return (
    <>
      <Layout header_categories={header_categories} footer_categories={footer_categories}>
        <Component {...pageProps} />

      </Layout>
    </>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  // Get the token from the cookie
  // const token = getTokenFromCookie();
  // console.log(token);

  const { req } = ctx;
  const host = req.headers.host;

  const cookies = req.headers.cookie;

  if (typeof cookies !== "undefined") {
    //localhost
    const parsedCookies = cookie.parse(cookies);

    const token = parsedCookies["api-token"];

    var site_host = parsedCookies["site-local-name"];

    if (typeof site_host === "undefined") {
      site_host = host;
    }

    // Check if the token is invalid, undefined, or expired
    if (
      typeof token === "undefined" ||
      token === undefined ||
      token === "undefined"
    ) {
      try {
        // Request a new token from the server
        const response = await getToken(site_host);

        // Get the new token from the response
        const newToken = response.access_token;

        // Perform any other necessary server-side operations

        axiosServer.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        setAuthorizationHeader(newToken);

        axiosServer.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${newToken}`;

          return config;
        });

        // Fetch data using the new token
        const data = await axiosServer.get(
          buildLink("headerv2", undefined, undefined, site_host)
        );
        // footer

        const footer_data = await axiosServer.get(
          buildLink("footerv2", undefined, undefined, site_host)
        );
        // Return the fetched data as props
        return {
          header_categories: data.data.data,
          footer_categories: footer_data.data.data,
          token: newToken
        };
      } catch (error) {
        // Handle any errors that occurred during the token request
        // For example, redirect to an error page or display an error message
        console.error("Failed to get a new token:", error);
      }
    } else {
      // Fetch data using the existing token
      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies["api-token"];

      var site_host = parsedCookies["site-local-name"];

      if (typeof site_host === "undefined") {
        site_host = host;
      }

      console.log("here");

      var data = [];
      var footer_data = [];
      if (host === "localhost:3001" || host === "localhost:3000") {
        data = await axiosServer.get(
          buildLink(
            "headerv2",
            undefined,
            undefined,
            "https://www.ishtari.com/"
          ),
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        );

        footer_data = await axiosServer.get(
          buildLink("footerv2", undefined, undefined,   "https://www.ishtari.com/") , {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        );
      } else {
        data = await axiosServer.get(
          buildLink("headerv2", undefined, undefined, site_host)
        );

        footer_data = await axiosServer.get(
          buildLink("footerv2", undefined, undefined, site_host)
        );
      }

      // Return the fetched data as props
      return {
        header_categories: data.data.data,
        footer_categories: footer_data.data.data,


      };
    }
  } else {
    //live
    const host = req.headers.host;

    try {
      var response = [];
      // Request a new token from the server
      if (host === "localhost:3001" || host === "localhost:3000") {
        response = await getToken("https://www.ishtari.com/");
      } else {
        response = await getToken(host);
      }

      // Get the new token from the response
      const newToken = response.access_token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      axiosServer.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newToken}`;

      setAuthorizationHeader(newToken);
      axiosServer.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${newToken}`;

        return config;
      });
      

      // Fetch data using the new token
      var data = [];
      if (host === "localhost:3001" || host === "localhost:3000") {
        data = await axiosServer.get(
          buildLink(
            "headerv2",
            undefined,
            undefined,
            "https://www.ishtari.com/"
          )
        );

        footer_data = await axiosServer.get(
          buildLink("footerv2", undefined, undefined,  "https://www.ishtari.com/")
        );
      } else {
        data = await axiosServer.get(
          buildLink("headerv2", undefined, undefined, site_host)
        );

        footer_data = await axiosServer.get(
          buildLink("footerv2", undefined, undefined, site_host)
        );
      }

      // Return the fetched data as props
      return {
        header_categories: data.data.data,
        footer_categories: footer_data.data.data,
        token: newToken
      };
    } catch (error) {
      // Handle any errors that occurred during the token request
      // For example, redirect to an error page or display an error message
      console.error("Failed to get a new token:", error);
    }
  }
  return {};
};
