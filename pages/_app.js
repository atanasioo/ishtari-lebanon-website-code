import { axiosServer, getToken } from "@/axiosServer.js";
import { getHost } from "@/functions";
import Layout from "@/components/layout/layout";
import "@/styles/globals.css";
import cookie from "cookie";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import "@/config";
import { useRef, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { useCookie } from "next-cookie";
import { SessionProvider } from "next-auth/react";
import { AccountProvider } from "@/contexts/AccountContext";
// import { AccountContext } from "@/contexts/AccountContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SellerProvider, useSellerContext } from "@/contexts/SellerContext";
import packageJson from "@/package.json";
import moment from "moment";
// import AsideMenu from "@/components/layout/AsideMenu";
import Head from "next/head";
import buildInfo from "@/build-info.json";
import { HostProvider } from "@/contexts/HostContext";
import { MarketingProvider } from "@/contexts/MarketingContext";
import { ReviewCenterProvider } from "@/contexts/ReviewCenterContext";
import Script from "next/script";
import Cookies from "js-cookie";
import { HeaderProvider } from "@/contexts/HeaderContext";
import CartSideModal from "@/components/product/CartSideModal";
import { SuggestionProvider } from "@/contexts/SuggestionContext";
import { MessageProvider } from "@/contexts/MessageContext";

export default function App({
  Component,
  pageProps,

  host
}) {
  const router = useRouter();
  const topRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const buildTimestamp = buildInfo.buildDate;
  const lastUpdateMoment = moment.unix(buildTimestamp / 1000);
  const formattedDate = lastUpdateMoment.format("DD.MM.YYYY HH:mm:ss");

  useEffect(() => {
    const handleStart = (url) => {
      // const excludeHome = url === "/";
      // if (!excludeHome) {
      setLoading(true);
      //}
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
      topRef.current?.scrollIntoView();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);





  var favicon = "/favicon-1.ico";
  var title = "ishtari | online Shopping in lebanon";
  if (host?.indexOf("flo") > -1) {
    favicon = "images/logo/favicon-flo.ico";
    title = "Flo Lebanon";
  } else if (host?.indexOf("energy") > -1) {
    favicon = "images/logo/favicon-energyplus.ico";
    title = "energyplus";
  } else if (host?.indexOf(".gh") > -1) {
    // title = "energyplus";
    title = "ishtari | online Shopping in Ghana";
  }


  useEffect(() => {
    // Add an event listener to the 'load' event of the window
    const clearLocalStorageOnLoad = () => {
      // Clear the entire localStorage
      localStorage.clear();
    
    };

    window.addEventListener('beforeunload', clearLocalStorageOnLoad);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', clearLocalStorageOnLoad);
    };
  }, []);

  useEffect(() => {
    if (
      Cookies.get("site-local-name") === "ishtari" ||
      window.location.host === "www.ishtari.com" ||
      window.location.host === "next.ishtari.com" ||
      window.location.host === "ishtari-mobile.com"
    ) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "AW-991347483");
    } else if (
      Cookies.get("site-local-name") === "ishtari-ghana" ||
      window.location.host === "www.ishtari.com.gh" ||
      window.location.host === "next.ishtari.com.gh"
    ) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "AW-10993907106");
    }
  }, []);

  return (
    <SessionProvider>
      <Head>
        <link rel="icon" href={favicon} />
        <title>{title}</title>
        {(host === "https://www.ishtari.com.gh" ||
          host === "ishtari-ghana" ||
          (typeof window !== "undefined" &&
            (window.location.host === "www.ishtari.com.gh" ||
              window.location.host === "next.ishtari.com.gh"))) && (
          <meta
            id="csp"
            http-equiv="Content-Security-Policy"
            content="default-src 'self' data:; script-src 'self' 'unsafe-inline' https://www.ishtari.com/ https://www.ishtari.com.gh/ *.ishtari.com/ *.ishtari.com.gh/ 'unsafe-eval' https: ; style-src 'self' 'unsafe-inline' ; base-uri 'self' https://www.ishtari.com/ https://www.ishtari.com.gh/ *.ishtari.com/ *.ishtari.com.gh/ ; img-src 'self' https://www.ishtari.com/ https://www.ishtari.com.gh/ https://ishtari.com *.ishtari.com/ *.ishtari.com.gh/ *.sari3.com *.google.com/ *.google.com.lb/ *.facebook.com *.connect.facebook.net  data:; manifest-src 'self'; frame-src 'self' https://td.doubleclick.net/ *.facebook.com https://test-gateway.mastercard.com/ ; connect-src 'self' https:;"
          />
        )}
      </Head>
      {host === "https://www.ishtari.com" ||
      host === "ishtari" ||
      (typeof window !== "undefined" &&
        (window.location.host === "www.ishtari.com" ||
          window.location.host === "next.ishtari.com" ||
          window.location.host === "ishtari-mobile.com")) ? (
        <Script
          id="tag"
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-991347483"
        />
      ) : host === "https://www.ishtari.com.gh" ||
        host === "ishtari-ghana" ||
        (typeof window !== "undefined" &&
          (window.location.host === "www.ishtari.com.gh" ||
            window.location.host === "next.ishtari.com.gh")) ? (
        <Script
          id="tag"
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-10993907106"
        />
      ) : (
        <></>
      )}

      <AccountProvider>
        <SuggestionProvider>
        <CartProvider>
          <WishlistProvider>
            <CurrencyProvider>
              <SellerProvider>
                <HostProvider>
                  <MarketingProvider>
                    <ReviewCenterProvider>
                      <HeaderProvider>
                        <MessageProvider>
                        <div className="" ref={topRef}>
                          {/* {!isUserSeller ? <TopHeader /> : <AsideMenu />} */}
                          {loading && (
                            <div className="fixed z-50 w-screen h-screen  text-center  opacity-50 bg-dTransparentWhite flex items-center justify-center">
                              <img
                                src={"/images/loader.gif"}
                                alt="loader-gif"
                                heigh="110"
                                width="110"
                              />
                            </div>
                          )}

                          {router.asPath.indexOf("posSystem") < 0 ? (
                            <Layout host={host}>
                              <div className="bg-dprimarybg min-h-screen">
                                <div className="md:container ">
                                  <Component {...pageProps} />
                                </div>
                              </div>
                            </Layout>
                          ) : (
                            <div className="bg-dprimarybg min-h-screen">
                              <div className="md:container ">
                                <Component {...pageProps} />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-dgrey1">
                          {"V" + packageJson.version}
                          {"."}
                          {buildTimestamp} {"("}
                          {formattedDate}
                          {")"}
                        </div>
                        </MessageProvider>
                      </HeaderProvider>
                    </ReviewCenterProvider>
                  </MarketingProvider>
                </HostProvider>
              </SellerProvider>
            </CurrencyProvider>
          </WishlistProvider>
        </CartProvider>
        </SuggestionProvider>
      </AccountProvider>

    </SessionProvider>
  );
}

// App.getInitialProps = async ({ Component, ctx }) => {
//   const { req } = ctx;
//   const cook = useCookie(ctx);

//   const cookies = req?.headers.cookie || "";

//   const parsedCookiesss = cookie.parse(cookies, "; ", "=");

//   const parsedCookies = cookie?.parse(cookies);
//   const token = parsedCookiesss["api-token"];

//   const maxAgeInDays = 15;
//   const maxAgeInSeconds = maxAgeInDays * 24 * 60 * 60; // Convert days to seconds

//   let options = {
//     path: "/",
//     maxAge: maxAgeInSeconds,
//     expires: new Date(Date.now() + maxAgeInSeconds * 1000), // Calculate expiration date
//   };

//   let host_url = "";

//   const host = req?.headers.host;

//   if (typeof cookies !== "undefined" && cookies !== "") {
//     var site_host = parsedCookies["site-local-name"];

//     if (typeof site_host === "undefined") {
//       site_host = host;
//     }

//     host_url = await getHost(site_host);

//     // Check if the token is invalid, undefined, or expired
//     if (
//       typeof token === "undefined" ||
//       token === undefined ||
//       token === "undefined"
//     ) {
//       try {
//         // Request a new token from the server

//         const response = await getToken(host_url);

//         const newToken = response.access_token;

//         if (newToken != undefined) {
//           cook.set("api-token", newToken, options);
//         }
//         setAuthorizationHeader(newToken);

//         // Return the fetched data as props
//         return {

//           token: newToken,
//           host: site_host,
//         };
//       } catch (error) {
//         console.error(
//           "Failed to get a new token, or to fetch data heree:",
//           error
//         );
//       }
//     } else {
//       // Fetch data using the existing token
//       const parsedCookies = cookie.parse(cookies);
//       const token = parsedCookies["api-token"];

//       var site_host = parsedCookies["site-local-name"];

//       if (typeof site_host === "undefined") {
//         site_host = host;
//       }

//       host_url = await getHost(site_host);

//       // Fetch header, footer, footer_information data using the existing token
//       // const resp = await getMainData(token, host_url);

//       // Return the fetched data as props

//       return {
//         host: site_host,
//       };
//     }
//   } else {
//     //live
//     if (typeof window === "undefined") {
//       host_url = await getHost(host);

//       try {
//         // Request a new token from the server

//         const response = await getToken(host_url);

//         const newToken = response.access_token;

//         cook.set("api-token", newToken, options);

//         setAuthorizationHeader(newToken);

//         // Return the fetched data as props
//         return {
//           token: newToken,
//           host: host,
//         };
//       } catch (error) {
//         // Handle any errors that occurred during the token request

//         // console.error("host isss:" + site_host);
//         console.error("Failed to get a new token:", error);
//       }
//     }
//   }
//   return {
//     host: host_url,
//   };
// };
