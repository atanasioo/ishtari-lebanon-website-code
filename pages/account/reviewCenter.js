import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import PointsLoader from "@/components/PointsLoader";
import SingleProduct from "@/components/product/SingleProduct";
import useDeviceSize from "@/components/useDeviceSize";
import { useReviewCenterData } from "@/contexts/ReviewCenterContext";
import buildLink from "@/urls";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BsClockFill, BsStarFill } from "react-icons/bs";

function reviewCenter() {
  const [width] = useDeviceSize();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [awaitingReview, setAwaitingReview] = useState(true);
  const { reviewCenterData, setReviewCenterData } = useReviewCenterData();

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
          console.log(data);
        });
    } else {
      axiosServer
        .get(buildLink("reviewedProtuctsCenter", undefined, window.innerWidth))
        .then((response) => {
          setLoading(false);
          const data = response.data.data;
          setData(data);
          console.log(data);
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
