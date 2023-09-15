import { useContext } from "react";
import { axiosServer } from "@/axiosServer";
import { AccountContext } from "@/contexts/AccountContext";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import PointsLoader from "@/components/PointsLoader";
import SingleProduct from "@/components/product/SingleProduct";
import useDeviceSize from "@/components/useDeviceSize";
import { useReviewCenterData } from "@/contexts/ReviewCenterContext";
import buildLink from "@/urls";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BsClockFill, BsStarFill } from "react-icons/bs";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";
import cookie from "cookie";
import { getHost } from "@/functions";

function reviewCenter() {
  const [state, dispatch] = useContext(AccountContext);
  const [width] = useDeviceSize();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [awaitingReview, setAwaitingReview] = useState(true);
  const { reviewCenterData, setReviewCenterData } = useReviewCenterData();
  const router = useRouter()
  useEffect(() => {
    setLoading(true);
    if (awaitingReview) {
      axiosServer
        .get(
          buildLink("unreviewedProtuctsCenter", undefined, window.innerWidth)
        )
        .then((response) => {
          setLoading(false);
          const data = response.data.data;
          setData(data);
          if (!state.loged) {
            router.push("/");
          }
        });
    } else {
      axiosServer
        .get(buildLink("reviewedProtuctsCenter", undefined, window.innerWidth))
        .then((response) => {
          setLoading(false);
          const data = response.data.data;
          setData(data);
          if ( !state.loged) {
            router.push("/");
          }
        });
    }
  }, [awaitingReview]);

  const handleClick = (product_id) => {
    setReviewCenterData({
      product_id: product_id,
      scrollToReview: true,
    });
  };


  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div className="pb-2">
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"reviewCenter"} />
            ) : (
              <UserSidebarMobile active={"reviewCenter"} />
            )}
          </div>

          <div className="w-full px-2 md:w-4/5 md:pl-8 my-5">
            <h1 className="text-lg pr-semibold">Review Center </h1>
            <div className="mt-8 tabs">
              <div className="w-full flex items-center gap-8">
                <div
                  className={`flex items-center gap-3 cursor-pointer pb-1.5 border-b-2 ${
                    awaitingReview ? "text-dblue" : "border-transparent"
                  }`}
                  onClick={() => setAwaitingReview(true)}
                >
                  <p>Awaiting Review</p>
                  <BsClockFill />
                </div>
                <div
                  className={`flex items-center gap-3 cursor-pointer pb-1.5 border-b-2 ${
                    !awaitingReview ? "text-dblue" : "border-transparent"
                  }`}
                  onClick={() => setAwaitingReview(false)}
                >
                  <p>Reviewed</p>
                  <BsStarFill />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center w-full">
                <PointsLoader />
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-8 gap-2 pt-4">
                {data?.products.map((item) => (
                  <div
                    key={item.product_id}
                    onClick={() => handleClick(item.product_id)}
                  >
                    <SingleProduct item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default reviewCenter;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { req } = context;

  if (!session) {
    //check whether the user is logged using facebook login

    var site_host = "";
    let host_url = "";

    const host = req.headers.host;

    let token = "";

    const cookies = req?.headers.cookie || "";
    if (typeof cookies !== "undefined" && cookies !== "") {
      const parsedCookies = cookie?.parse(cookies);
      site_host = parsedCookies["site-local-name"];
      token = parsedCookies["api-token"];

      if (typeof site_host === "undefined") {
        site_host = host;
      }
    }

    host_url = await getHost(site_host);
    try {
      const response = await axiosServer.get(
        buildLink("login", undefined, undefined, host_url),
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response.data);
      if (response.data.data.customer_id === 0) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    } catch(error) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}
