import Image from "next/image";
import { Inter } from "next/font/google";
import cookie from "cookie";
import buildLink from "@/urls";
import { axiosServer } from "@/axiosServer";
import WidgetsLoop from "@/components/WidgetsLoop";
import { useEffect, useRef, useState, useCallback } from "react";
import Cookies from "js-cookie";
const inter = Inter({ subsets: ["latin"] });
import PointsLoader from "@/components/PointsLoader";
import Head from "next/head";
import { useCookie } from "next-cookie";
export default function Home(widgets) {
  // const data = widgets.data.widgets;

  const [hasMore, setIsHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef(null);
  const observer = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      // if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          setIsLoading(true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    // if (page > 1) {
      setIsLoading(true);
      var obj = {
        view: window.innerWidth > 650 ? "web_desktop" : "web_mobile",
        limit: 10,
        page: page,
      };
      let link = buildLink("home", undefined, undefined) + "&source_id=1";
      axiosServer.post(link, obj).then((response) => {
        if (response?.data?.success) {
          const newData = response?.data?.data?.widgets;
          // setData((prevData) => [...prevData, ...newData]);

          setData((prevWidgets) => {
            return [
              ...new Set([...prevWidgets, ...response?.data?.data?.widgets]),
            ];
          });
          setIsLoading(false);
          if (page >= response?.data?.data?.meta?.total_pages)
            setIsHasMore(false);
          else setIsHasMore(true);
        }
      });
    // }

    setIsLoading(false);
  }, [page]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     const sentinel = entries[0];
  //     if (sentinel.isIntersecting) {
  //       setPage(page + 1);

  //       // loadMoreData();
  //     }
  //   });

  //   observer.observe(sentinelRef.current);

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, []);

  // useEffect(() =>{
  //   console.log(window.config);
  // },[])

  return (
    <div>
      <Head>
        <title>Ishtari | Online Shopping in Lebanon</title>
        <meta
          name="description"
          content="Discover ishtari- Lebanese best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery. موقع اشتري٬ تسوق اونلاين توصيل إلى جميع المناطق اللبنانية"
        ></meta>
      </Head>
      <div className="overflow-x-hidden">
        {data?.map((widget, index) => {
          if (data.length === index + 1) {
            return (
              <div
                className="theHome"
                ref={lastElementRef}
                key={widget.mobile_widget_id}
              >
                {" "}
                <WidgetsLoop widget={widget} width={widgets.screentype} />{" "}
              </div>
            );
          } else {
            return (
              <div className="" key={widget.mobile_widget_id}>
                <WidgetsLoop widget={widget} width={widgets.screentype} />{" "}
              </div>
            );
          }
        })}

        {isLoading && <PointsLoader />}
      </div>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   // Fetch the corresponding API endpoint based on the page type
//   const { req } = context;
//   const cook = useCookie(context);
//   let data = null;
//   let host_url = "";
//   const userAgent = context.req.headers["user-agent"];
//   // console.log({ userAgent });
//   // console.log("userAgent");
//   const screenWidth = parseScreenWidth(userAgent);
//   // console.log("width=" + screenWidth);
//   const host = req.headers.host;
//   const cookies = req.headers.cookie;
//   if (typeof cookies !== "undefined") {
//     const parsedCookies = cookie.parse(cookies);

//     const host_cookie = parsedCookies["site-local-name"];
//     const token = parsedCookies["api-token"];

//     let site_host = "";
//     if ((host_cookie === undefined || typeof host_cookie === "undefined") && host !== "localhost:3000" && host !== "localhost:3001") {
//       site_host = host;
//     }else if((host_cookie === undefined || typeof host_cookie === "undefined") && (host === "localhost:3000" || host === "localhost:3001")){
//       cook.set("site-local-name", "ishtari");
//       site_host= "ishtari";
//     } else {
//       site_host = host_cookie;
//     }
    
//     var obj = {
//       view: screenWidth == "mobile" ? "web_mobile" : "web_desktop",
//       limit: 10,
//       page: 1,
//     };
//   //  console.log(obj);
//     //fetch product data
//     let link = buildLink("home", undefined, undefined, site_host) + "&source_id=1";
//      console.log(link)
//      console.log(site_host)
//     const response = await axiosServer.post(link, obj, {
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//     });
//     if (!response.data.success) {
//       return {
//         notFound: true,
//       };
//     }

//     data = response.data.data;

//     return {
//       props: { data, screentype: screenWidth },
//     };
//   } else {
//     return {
//       props: {},
//     };
//   }
// }

function parseScreenWidth(userAgent) {
  // var screenWidth
  // console.log(match)
  // if (userAgent) {
  //   const match = userAgent.match(/(?:^|\s)(\d+)x(\d+)(?:\s|$)/);
  //   if (match && match.length >= 3) {
  //     screenWidth = parseInt(match[1], 10);
  //   }
  // }
  //console.log(userAgent);
  if (userAgent.includes("Mobile") && !userAgent.includes("iPad")) {
    return "mobile";
  }
  // Return a default width if the extraction fails
  return "desktop"; // Default width of 1920 pixels
}
