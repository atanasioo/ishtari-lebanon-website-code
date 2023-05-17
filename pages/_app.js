import _axios from "@/axios";
import axios from "axios";
import Layout from "@/components/layout/layout";
import "@/styles/globals.css";
import buildLink from "@/urls";
import useDeviceSize from "@/components/useDeviceSize";
import cookie from "cookie";

export default function App({ Component, pageProps, all_categories }) {
  return (
    <>
      <Layout all_categories={all_categories}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  //  console.log(buildLink("all_categories", undefined, useDeviceSize.width));
  const { req } = ctx;

  // Retrieve the cookie header from the request
  const cookies = req.headers.cookie;

  // Parse the cookies using the cookie library
  const parsedCookies = cookie.parse(cookies);
  // console.log(parsedCookies);

  // Access the specific variable stored in the cookie
   const token = parsedCookies["api-token"];

   //const host = req.headers.host;

   const host = parsedCookies["site-local-name"];

  const response = await _axios.get(
    buildLink("all_categories", undefined, undefined, host), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        "Content-Type" : 'application/json',
      },
    }
  );

  console.log(buildLink("all_categories", undefined, useDeviceSize.width));
  // console.log(response);

  const all_categories = response.data;
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps, all_categories };
};
