import _axios from "@/axios";
import axios from "axios";
import Layout from "@/components/layout/layout";
import "@/styles/globals.css";
import buildLink from "@/urls";
import useDeviceSize from "@/components/useDeviceSize";
import cookie from "cookie";

export default function App({ Component, pageProps, header_categories }) {
  return (
<<<<<<< HEAD
    <>
      <Layout header_categories={header_categories}>
        <Component {...pageProps} />
      </Layout>
    </>
=======
    <div className="container px-12">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
>>>>>>> c2fdc4c (...)
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  //  console.log(buildLink("all_categories", undefined, useDeviceSize.width));
  const { req } = ctx;

  // Retrieve the cookie header from the request
  const cookies = req.headers.cookie;
  if (typeof cookies !== "undefined") {
    // Parse the cookies using the cookie library
    const parsedCookies = cookie.parse(cookies);


    // Access the specific variable stored in the cookie
    const token = parsedCookies["api-token"];


    if (typeof token !== "undefined") {
      const host = req.headers.host;

      var site_host = parsedCookies["site-local-name"];

      if (typeof site_host === "undefined") {
        site_host = host;
      }

      // const response = await _axios.get(
      //   buildLink("all_categories", undefined, undefined, host), {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       Accept: 'application/json',
      //       "Content-Type" : 'application/json',
      //     },
      //   }
      // );

      const response = await _axios.get(
        buildLink("headerv2", undefined, undefined, site_host),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      var header_categories = [];
      let pageProps = {};
      if (response.data.success) {
        header_categories = response.data.data;

        if (Component.getInitialProps) {
          pageProps = await Component.getInitialProps(ctx);
        }
      }
      return { pageProps, header_categories };
    }
  }
  return {};
};
