import {
  axiosServer,
  getToken,
  setAuthorizationHeader,
} from "@/axiosServer.js";
import Layout from "@/components/layout/layout";
import "@/styles/globals.css";
import buildLink from "@/urls";
import cookie from "cookie";

import "@/config";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookie } from "next-cookie";
import { SessionProvider } from "next-auth/react";
import { AccountProvider } from "@/contexts/AccountContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

export default function App({
  Component,
  pageProps,
  header_categories,
  footer_categories,
  information_data,
}) {
  const router = useRouter();
  const topRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);
  useEffect(() => {
    const handleRouteChange = () => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
  return (
    <SessionProvider>
      <AccountProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="" ref={topRef}>
              {loading && (
                <div className="fixed z-50 w-screen h-screen text-center  opacity-50 bg-dTransparentWhite flex items-center justify-center">
                  <img
                    src={"/images/loader.gif"}
                    alt="loader-gif"
                    heigh="110"
                    width="110"
                  />
                </div>
              )}
              <Layout
                header_categories={header_categories}
                footer_categories={footer_categories}
                information_data={information_data}
              >
                <div className="bg-dprimarybg">
                  <div className="md:container ">
                    <Component {...pageProps} />
                  </div>
                </div>
              </Layout>
            </div>
          </WishlistProvider>
        </CartProvider>
      </AccountProvider>
    </SessionProvider>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  const { req } = ctx;
  const cook = useCookie(ctx);

  const cookies = req?.headers.cookie  || '';
// console.log(cookies)
// if(cookie != undefined){


// const cookieHeader = req.headers.cookie || '';
const parsedCookiesss = cookie.parse(cookies, '; ', '=');

const apiToken = parsedCookiesss['api-token'];
  const parsedCookies = cookie?.parse(cookies);
  const token = parsedCookies["api-token"];

// }
  console.log("whyyyyyyyyyyy")
  console.log(token)
  console.log("hiiiiiiiiiiiiii")
  const host = req?.headers.host;


  // console.log(cookie);
  if (typeof cookies !== "undefined") {
    //localhost

    // const token = parsedCookies["api-token"];
    // console.log("tokennnn")
    // console.log(token)
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
        //const response = await getToken(site_host);
        const response = await getToken("https://www.ishtari.com/");

        // Get the new token from the response
        const newToken = response.access_token;

        // Perform any other necessary server-side operations

        axiosServer.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        // axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

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

        const information_data = await axiosServer.get(
          buildLink("information", undefined, undefined, site_host)
        );
        // Return the fetched data as props
        return {
          header_categories: data.data?.data,
          footer_categories: footer_data.data?.data,
          information_data: information_data.data?.data,
          token: newToken,
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

      var data = [];
      var footer_data = [];
      var information_data = [];

      if (
        host === "localhost:3001" ||
        host === "localhost:3000" ||
        host === "https://cloudgoup.com/" ||
        host === "https://www.cloudgoup.com/" ||
        host === "http://cloudgoup.com" ||
        host === "www.cloudgoup.com"
      ) {
        data = await axiosServer.get(
          buildLink(
            "headerv2",
            undefined,
            undefined,
            "https://www.ishtari.com/"
          ),
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        // console.log("header response is");
        // console.log(data.data.data);
        // console.log("token is :" + token);

        footer_data = await axiosServer.get(
          buildLink(
            "footerv2",
            undefined,
            undefined,
            "https://www.ishtari.com/"
          ),
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        information_data = await axiosServer.get(
          buildLink(
            "information",
            undefined,
            undefined,
            "https://www.ishtari.com/"
          ),
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        return {
          header_categories: data.data.data,
          footer_categories: footer_data.data.data,
          information_data: information_data.data?.data,
        };
      } else {
        data = await axiosServer.get(
          buildLink("headerv2", undefined, undefined, site_host)
        );

        footer_data = await axiosServer.get(
          buildLink("footerv2", undefined, undefined, site_host)
        );

        information_data = await axiosServer.get(
          buildLink("information", undefined, undefined, site_host)
        );
      }

      // Return the fetched data as props
      return {
        header_categories: data.data.data,
        footer_categories: footer_data.data.data,
        information_data: information_data.data?.data,
      };
    }
  } else {
    //live
    const host = req?.headers.host;

    try {
      var response = [];
      // Request a new token from the server
      if (
        host === "localhost:3001" ||
        host === "localhost:3000" ||
        host === "https://cloudgoup.com/" ||
        host === "https://www.cloudgoup.com/" ||
        host === "http://cloudgoup.com" ||
        host === "www.cloudgoup.com"
      ) {
        response = await getToken("https://www.ishtari.com/");
        // console.log("hihiiii");
      } else {
        response = await getToken("https://www.ishtari.com/");
      }

      // console.log("token response is ");
      // console.log(response);

      // Get the new token from the response
      const newToken = response.access_token;
      axiosServer.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newToken}`;

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
      if (
        host === "localhost:3001" ||
        host === "localhost:3000" ||
        host === "http://cloudgoup.com" ||
        host === "www.cloudgoup.com"
      ) {
        data = await axiosServer.get(
          buildLink(
            "headerv2",
            undefined,
            undefined,
            "https://www.ishtari.com/"
          )
        );

        footer_data = await axiosServer.get(
          buildLink(
            "footerv2",
            undefined,
            undefined,
            "https://www.ishtari.com/"
          )
        );
        information_data = await axiosServer.get(
          buildLink(
            "information",
            undefined,
            undefined,
            "https://www.ishtari.com/"
          )
        );
      } else {
        data = await axiosServer.get(
          buildLink("headerv2", undefined, undefined, site_host)
        );

        footer_data = await axiosServer.get(
          buildLink("footerv2", undefined, undefined, site_host)
        );

        information_data = await axiosServer.get(
          buildLink("information", undefined, undefined, site_host)
        );
      }

      const maxAgeInDays = 15;
      const maxAgeInSeconds = maxAgeInDays * 24 * 60 * 60; // Convert days to seconds

      let options = {
        path: "/",
        maxAge: maxAgeInSeconds,
        expires: new Date(Date.now() + maxAgeInSeconds * 1000), // Calculate expiration date
      };

      cook.set("api-token", newToken, options);

      // // Set the token in a cookie
      // // If there are no existing cookies, create a new one
      // const newCookie = serialize("api-token", newToken, {
      //   path: "/",
      //   httpOnly: true,
      //   maxAge: maxAgeInSeconds,
      //   expires: new Date(Date.now() + maxAgeInSeconds * 1000), // Calculate expiration date
      // });

      // console.log(req.headers.cookie);
      // Set the cookie in the response header
      // req.headers.cookie = newCookie;

      // Return the fetched data as props
      return {
        header_categories: data.data.data,
        footer_categories: footer_data.data.data,
        information_data: information_data?.data.data,

        token: newToken,
      };
    } catch (error) {
      // Handle any errors that occurred during the token request

      console.error("host isss:" + site_host);
      console.error("Failed to get a new token:", error);
    }
  }
  return {};
};
