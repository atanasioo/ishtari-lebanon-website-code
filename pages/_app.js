import {
  axiosServer,
  getToken,
  setAuthorizationHeader,
} from "@/axiosServer.js";
import { getHost, getMainData } from "@/functions";
import Layout from "@/components/layout/layout";
import "@/styles/globals.css";
import buildLink from "@/urls";
import cookie from "cookie";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
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
            <CurrencyProvider>
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
                <div className="bg-dprimarybg min-h-screen">
                  <div className="md:container ">
                    <Component {...pageProps} />
                  </div>
                </div>
              </Layout>
            </div>
            </CurrencyProvider>
          </WishlistProvider>
        </CartProvider>
      </AccountProvider>
    </SessionProvider>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  const { req } = ctx;
  const cook = useCookie(ctx);

  const cookies = req?.headers.cookie || "";

  const parsedCookiesss = cookie.parse(cookies, "; ", "=");

  const parsedCookies = cookie?.parse(cookies);
  const token = parsedCookiesss["api-token"];

  const maxAgeInDays = 15;
  const maxAgeInSeconds = maxAgeInDays * 24 * 60 * 60; // Convert days to seconds

  let options = {
    path: "/",
    maxAge: maxAgeInSeconds,
    expires: new Date(Date.now() + maxAgeInSeconds * 1000), // Calculate expiration date
  };

  let host_url = "";

  const host = req?.headers.host;

  if (typeof cookies !== "undefined" && cookies !== "") {
    var site_host = parsedCookies["site-local-name"];

    if (typeof site_host === "undefined") {
      site_host = host;
    }

    host_url = await getHost(site_host);

    // Check if the token is invalid, undefined, or expired
    if (
      typeof token === "undefined" ||
      token === undefined ||
      token === "undefined"
    ) {
      try {
        // Request a new token from the server

        const response = await getToken(host_url);

        const newToken = response.access_token;
        cook.set("api-token", newToken, options);

        setAuthorizationHeader(newToken);

        // Fetch header, footer, footer_information data using the new token
        const resp = await getMainData(newToken, host_url);

        // Return the fetched data as props
        return {
          header_categories: resp.data.data?.data,
          footer_categories: resp.footer_data.data?.data,
          information_data: resp.information_data.data?.data,
          token: newToken,
        };
      } catch (error) {
        console.error("Failed to get a new token, or to fetch data:", error);
      }
    } else {
      // Fetch data using the existing token
      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies["api-token"];

      var site_host = parsedCookies["site-local-name"];

      if (typeof site_host === "undefined") {
        site_host = host;
      }

      host_url = await getHost(site_host);

      // Fetch header, footer, footer_information data using the existing token
      const resp = await getMainData(token, host_url);

      // Return the fetched data as props
      return {
        header_categories: resp.data.data.data,
    
      };
    }
  } else {
    //live

    host_url = await getHost(host);

    try {
      // Request a new token from the server

      const response = await getToken(host_url);

      const newToken = response.access_token;

      // cook.set("api-token", newToken, options);

      setAuthorizationHeader(newToken);

      // Fetch header, footer, footer_information data using the new token

      const resp = await getMainData(token, host_url);

      // Return the fetched data as props
      return {
        header_categories: resp.data.data.data,
        footer_categories: resp.footer_data.data.data,
        information_data: resp.information_data?.data.data,
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
