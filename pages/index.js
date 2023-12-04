import buildLink from "@/urls";
import { axiosServer } from "@/axiosServer";
import WidgetsLoop from "@/components/WidgetsLoop";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import Head from "next/head";
import useDeviceSize from "@/components/useDeviceSize";
import ScrollToTop from "react-scroll-to-top";
import { useCookie } from "next-cookie";
import cookie from "cookie";
import { getHost } from "@/functions";
import DownloadAppImg from "@/components/DownloadAppImg";
import { AccountContext } from "@/contexts/AccountContext";
import PointsLoader from "@/components/PointsLoader";
import { useHeaderColor } from "@/contexts/HeaderContext";
import { useMarketingData } from "@/contexts/MarketingContext";
import { useSession } from "next-auth/react";

export default function Home(props) {
  const host_url = props.host;
  const { data: session } = useSession();

  const [hasMore, setIsHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [state] = useContext(AccountContext);
  const [width] = useDeviceSize();
  const sentinelRef = useRef(null);
  const observer = useRef(null);
  const { headerColor, setHeaderColor } = useHeaderColor();
  const { showStats } = useMarketingData();
  const [bannerStats, setBannerStats] = useState([]);

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          entries[0].intersectionRatio > 0 &&
          entries[0].intersectionRatio < 1 &&
          hasMore
        ) {
          setPage((prevPage) => prevPage + 1);
          // setIsLoading(true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // const [data, setData] = useState([]);
  const dataRef = useRef([]);

  useEffect(() => {
    // if (page > 1) {
      setIsLoading(true);
      var obj = {
      view: window.innerWidth > 650 ? "web_desktop" : "web_mobile",
      limit: 10,
      page: page,
    };
    let link =
      buildLink("home", undefined, undefined, window.config["site-url"]) +
      "&source_id=1";
    axiosServer.post(link, obj).then((response) => {
      if (response?.data?.success) {
        const newData = response?.data?.data?.widgets;
        // setData((prevData) => [...prevData, ...newData]);

        // setData((prevWidgets) => {
        //   return [
        //     ...new Set([...prevWidgets, ...response?.data?.data?.widgets]),
        //   ];
        // });
        dataRef.current = [
          ...dataRef.current,
          ...response?.data?.data?.widgets,
        ];

        if (
          page === 1 &&
          response?.data?.data?.widgets[0].cover_header === "1"
        ) {
          //setHeaderColor("#0000FF");
          setHeaderColor(response?.data?.data?.widgets[0].background_color);
        }

        // setTimeout(() => {
        //   setInitialLoading(false)
        // }, 200);

        if (page >= response?.data?.data?.meta?.total_pages)
          setIsHasMore(false);
        else setIsHasMore(true);
        setIsLoading(false);
      }
    });
    // }

    // setIsLoading(false);
  }, [page]);

  const WidgetsList = useMemo(() => {
    return dataRef.current.map((widget, index) => {
      if (dataRef.current.length === index + 1) {
        return (
          <div
            className="theHome "
            ref={lastElementRef}
            key={widget.mobile_widget_id}
          >
            {" "}
            <WidgetsLoop widget={widget} bannerStats={bannerStats} />{" "}
          </div>
        );
      } else {
        return (
          <div className="" key={widget.mobile_widget_id}>
            <WidgetsLoop widget={widget} bannerStats={bannerStats} />{" "}
          </div>
        );
      }
    });
  }, [lastElementRef, bannerStats]);

  //page view conversion google ads
  useEffect(() => {
    if (!state.admin) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }

      if (
        window.location.host === "www.ishtari.com" ||
        window.location.host === "next.ishtari.com" ||
        window.location.host === "ishtari-mobile.com"
      ) {
        gtag("event", "conversion", {
          send_to: "AW-991347483/pc3dCIaww44YEJuG29gD",
        });
      } else if (
        window.location.host === "www.ishtari.com.gh" ||
        window.location.host === "next.ishtari.com.gh"
      ) {
        gtag("event", "conversion", {
          send_to: "AW-10993907106/31DICLmKppEYEKLrpvoo",
        });
      }
    }


    // try {
    //   // alert(buildLink("social"))
    //   const obj = {
    //      provider: "facebook",
    //      social_access_token: session.accessToken,
    //      id: session.user.id,
    //     //  name: session.user.name,
    //      email: session.user.email  ? session.user.email : session.user.id + "@ishtari-mobile.com",
       
    //   };

    //   axiosServer.post(buildLink("social"), obj).then(() => {
    //     checkLogin();
    //     // window.location.reload();
    //   });
    //   console.log("User data saved successfully");
    // } catch (error) {
    //   console.log("Error saving user data:", error);
    // }
  }, []);


  //banner click statistics
  useEffect(() => {
    if (state.admin && showStats) {
      const banner_image_ids = [];
      dataRef.current.map((widget) => {
        if (widget.display === "grid" || widget.display === "slider") {
          widget.items.map((item) => {
            banner_image_ids.push(item.banner_image_id);
          });
        }
      });

      const obj = {
        source_type: "home",
        banner_image_ids: banner_image_ids.join(',') ,
      };

      axiosServer.post(buildLink("banner_stats"),  obj).then((response) => {
        // console.log(response.data);
        setBannerStats(response.data.data);
      });
    }
  }, [state.admin, showStats, dataRef.current]);


  return (
    <div>
      <Head>
        {host_url === "https://www.ishtari.com" ? (
          <>
            <title>Ishtari | Online Shopping in Lebanon</title>
            <meta
              name="description"
              content="Discover ishtari- Lebanese best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery. موقع اشتري٬ تسوق اونلاين توصيل إلى جميع المناطق اللبنانية"
            ></meta>
          </>
        ) : (
          <>
            <title>Ishtari | Online Shopping in Ghana</title>
            <meta
              name="description"
              content="Discover ishtari- Ghana best online shopping experience✓ Full service - best prices✓ Huge selection of products ✓ Enjoy pay on delivery."
            ></meta>
            <meta name="google-site-verification" content="JrQwV0UHq3vKvlz2hPTgo3ZgucjuLNK1LhZ1gvVOp4M" />
          </>
        )}
      </Head>
      <DownloadAppImg host_url={host_url} />
      <div className={`overflow-hidden container`}>
        {width < 650 && (
          <ScrollToTop
            smooth
            className="rounded-full  bg-dgreyBlack text-white text-center opacity-70"
            width="36"
            height="30"
            color="white"
            top="1000"
            style={{ width: "50px", height: "50px", padding: "7px" }}
          />
        )}

        {WidgetsList}

        {/* {data?.map((widget, index) => {
          if (data.length === index + 1) {
            return (
              <div
                className="theHome "
                ref={lastElementRef}
                key={widget.mobile_widget_id}
              >
                {" "}
                <WidgetsLoop
                  widget={widget}
                  // width={widgets.screentype}
                />{" "}
              </div>
            );
          } else {
            return (
              <div
                className=""
                //  style={{minHeight: initialLoading && widget.banner_height ? widget.banner_height : ""  }}
                key={widget.mobile_widget_id}
              >
                <WidgetsLoop
                  widget={widget}
                  // width={widgets.screentype}
                />{" "}
              </div>
            );
          }
        })} */}

        {isLoading && <PointsLoader />}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cook = useCookie(context);
  const host = req.headers.host;
  const cookies = req.headers.cookie;
  if (typeof cookies !== "undefined") {
    const parsedCookies = cookie.parse(cookies);
    const host_cookie = parsedCookies["site-local-name"];
    let site_host = "";
    if (
      typeof host_cookie === "undefined" &&
      host !== "localhost:3000" &&
      host !== "localhost:3001"
    ) {
      site_host = host;
    } else if (
      (host_cookie === undefined || typeof host_cookie === "undefined") &&
      (host === "localhost:3000" || host === "localhost:3001")
    ) {
      cook.set("site-local-name", "ishtari");
      site_host = "ishtari";
    } else {
      site_host = host_cookie;
    }
    const host_url = await getHost(site_host);

    // console.log("host_url iss" +host_url);
    return {
      props: {
        host: host_url,
      },
    };
  } else {
    return {
      props: {
        host: host,
      },
    };
  }
}

