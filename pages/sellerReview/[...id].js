import { axiosServer } from "@/axiosServer";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import Slider from "react-slick/lib/slider";
import SingleProduct from "@/components/product/SingleProduct";
import SingleProductTest from "@/components/product/SingleProductTest";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import StarRatings from "react-star-ratings";
import ReviewSellerPlaceholder from "@/components/ReviewSellerPlaceholder";
import ReviewSellerPlaceholderMobile from "@/components/ReviewSellerPlaceholderMobile";
import { LinkedinIcon } from "react-share";
import { slugify } from "@/components/Utils";
import Link from "next/link";
import { BsHandThumbsUp } from "react-icons/bs";
import Image from "next/image";
// import CustomPrevArrows
export default function sellerReview() {
  const router = useRouter();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { id } = router.query;
  const [follow, setFollow] = useState(false);
  const [accountState, dispatch] = useContext(AccountContext);
  const [ disabled , setDisabled] = useState(false)
  useEffect(() => {
    console.log(id);
    if (id !== "undefined")
      axiosServer
        .get(buildLink("seller", undefined, window.location.host) + id)
        .then((resp) => {
          setData(resp.data.data);
          setLoading(false);
        });
  }, [router, follow]);

  const settings = {
    speed: 200,
    slidesToShow: 6,
    slidesToScroll: 7,
    vertical: false,
    infinite: false,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />
  };

  const color = {
    a: "#ffad35",
    b: "#00BFFF",
    c: "#00BFFF",
    d: "#00BFFF",
    e: "LightGray",
    f: "#ff9900",
    g: "#008000",
    h: "#008000",
    i: "#bf1b26",
    j: "#008000",
    k: "#008000",
    l: "LightCoral",
    m: "#008000",
    n: "#008000",
    o: "#F08080	",
    p: "#bf1b26",
    q: "#bf1b26",
    r: "#DC143C",
    t: "#FFD700",
    u: "#000066",
    v: "#bf1b26",
    w: "#bf1b26",
    x: "#bf1b26",
    y: "#00BFFF",
    z: "LightGray",
    s: "#DC143C"
  };

  const textColor = {
    a: "#FFEBCD",
    b: "white",
    c: "white",
    d: "white",
    e: "#000066",
    f: "white",
    g: "white",
    h: "white",
    i: "white",
    j: "white",
    k: "white",
    l: "white",
    m: "white",
    n: "white",
    o: "white",
    p: "#bf1b26",
    q: "#bf1b26",
    r: "#DC143C",
    t: "#b39700",
    u: "#ffcc00",
    v: "white",
    w: "white",
    x: "white",
    y: "#00BFFF",
    z: "#00708b",
    s: "white"
  };
  function CustomPrevArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px" }}
        onClick={onClick}
        className="mySwiper "
      >
        <div className="swiper-button-prev flex justify-center items-center cursor-pointer">
          <BsChevronLeft className="text-dblack" />
        </div>
      </div>
    );
  }

  function CustomNextArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px" }}
        onClick={onClick}
        className="mySwiper "
      >
        <div className="swiper-button-next flex justify-center items-center cursor-pointer">
          <BsChevronRight className="text-dblack" />
        </div>
      </div>
    );
  }

  function followAction() {
    if (!accountState.loged) {
      dispatch({ type: "setShowOver", payload: true });
      dispatch({ type: "setShowLogin", payload: true });
    }
    setFollow("");
    setDisabled(true)
    console.log(id);
    var obj = {
      type: "seller",
      type_id: id[0]
    };

    axiosServer
      .post(
        buildLink("follow", undefined, undefined, window.location.host),
        obj
      )
      .then((resp) => {
        if (resp.data.data.follow === true) {
          setFollow(true);
          setDisabled(false)
        }
        if (resp.data.data.follow === false) {
          setFollow(false);
          setDisabled(false)
        }
      });
  }

  return (
    <div className="">
      {loading ? (
        <>
          <div className="mobile:hidden">
            {" "}
            <ReviewSellerPlaceholderMobile />
          </div>
          <div className="hidden mobile:block">
            {" "}
            <ReviewSellerPlaceholder />
          </div>
        </>
      ) : (
        <>
          <div className="mobile:bg-white mobile:pb-10">
            <div
              className="relative w-full h-48 flex justify-center items-center text-d28 mobile:text-6xl  font-sans"
              style={{
                backgroundColor:
                  color[
                    data?.social_data?.name
                      .replace(/\s+/g, "")
                      .charAt(0)
                      .toLowerCase()
                  ],
                color:
                  textColor[
                    data?.social_data?.name
                      .replace(/\s+/g, "")
                      .charAt(0)
                      .toLowerCase()
                  ] || "white"
              }}
            >
                             <div className="uppercase">{ data?.social_data?.name}</div>

              <div
                className={`${!data?.seller_reviews?.image &&  "w-28 h-28 mobile:w-32 mobile:h-32 flex items-center justify-center" } " absolute z-20 rounded-full  -bottom-16 left-10  text-d14 "`} style={{border:" 4px solid rgb(243, 244, 248)",
                  backgroundColor:
                    color[
                      data?.social_data?.name
                        .replace(/\s+/g, "")
                        .charAt(0)
                        .toLowerCase()
                    ],
                  color:
                    textColor[
                      data?.social_data?.name
                        .replace(/\s+/g, "")
                        .charAt(0)
                        .toLowerCase()
                    ] || "white"
                }}
              >
                {" "}
              {data?.seller_reviews?.image ?  <Image src={data?.seller_reviews?.image }  width="200" height="200"  className="rounded-full  w-28 h-28 mobile:w-32 mobile:h-32"/>  : data?.social_data?.name}
              </div>
              <div
                className={`${ disabled && 'bg-opacity-95 text-opacity-40 pointer-events-none' } " absolute z-20 right-10 bottom-5 text-d14 p-2 rounded-full bg-white border-dgreyProduct text-dblack pr-semibold px-4 mobile:px-5 "`}
                onClick={followAction}
              >
                {" "}
                {(follow) ? (
                  <span className="">Following  </span>
                ) : (
                  <span className="">+ Follow </span>
                )}

              </div>
            </div>
            <div className="w-full mt-20  pl-12">
              <Link
                className="text-dblue pr-bold text-d22 underline"
                href={`/${
                  data?.social_data?.name &&
                  slugify(data?.social_data?.name) + "/s=" + id
                }`}
              >
                {data?.social_data?.name}
              </Link>
            </div>
            {data?.seller_reviews?.grouped_rating  ? (
              <div className="flex flex-col mobile:flex-row mt-6 pl-5 ">
                <div className="flex  w-full mobile:w-6/12  mobile:space-x-5 flex-col mobile:flex-row pr-6  h-full mobile:h-32">
                  <div className="w-full mobile:w-1/2 mobile:border border-dgrey1 text-d14 flex flex-col rounded-lg border-opacity-20 p-5 space-y-0.5 bg-white">
                    <span className="text-d16 pr-semibold text-dblackOverlay3">
                      Seller Rating
                    </span>
                    <div className="flex items-center pr-semibold">
                      <span className=" text-2xl pr-semibold">
                        {data?.seller_reviews?.average_rating}
                      </span>{" "}
                      <AiFillStar
                        className="text-d18 ml-1"
                        style={{
                          color:
                            data?.seller_reviews?.average_rating >= 4.5
                              ? "rgb(0,158,0)"
                              : data?.seller_reviews?.average_rating < 4.5 &&
                                data?.seller_reviews?.average_rating >= 4
                              ? "rgb(110, 159, 0)"
                              : data?.seller_reviews?.average_rating < 4 &&
                                data?.seller_reviews?.average_rating >= 3.5
                              ? "rgb(243, 153, 22)"
                              : "rgb(246,90,31)"
                        }}
                      />
                    </div>
                    <div className="flex">
                      {" "}
                      <span className=" text-d14">
                        {data?.seller_reviews?.percentage}
                      </span>{" "}
                      <span className="text-dgrey1 pl-1 text-opacity-70 text-d14">
                        {" "}
                        Positive Ratings
                      </span>
                    </div>
                  </div>

                  <div className="w-full mobile:w-1/2 mobile:border border-dgrey1 text-d14 flex flex-col rounded-lg border-opacity-20 p-5 mt-5 mobile:mt-0  h-32 bg-white">
                    <span className="text-d16 pr-semibold text-dblackOverlay3">
                      Customers
                    </span>
                    <div className="flex items-center pr-semibold text-2xl">
                      {( Number(data?.total_followers)) }
                    </div>
                    <div className="flex">
                      {" "}
                      <span className="text-dgrey1 pl-1 text-opacity-70 text-d14">
                        {" "}
                        During the last 90 days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full mobile:w-6/12 flex flex-col   mobile:pl-6 mt-5 mobile:-mt-12 mobile:border-l border-dgrey1 border-opacity-20 ">
                  <div className="text-d18 mobile:text-d22 pr-semibold px-5 mobile:px-2">
                    Seller Ratings & Reviews
                  </div>
                  <div className="flex flex-col mobile:flex-row  border-dgrey1 border-opacity-10 mobile:pl-2 mobile:space-x-5 mt-5 px-5 bg-white mr-5 pb-6">
                    <div className="flex justify-end flex-col w-full mobile:w-4/12 ">
                      <div className=" pr-semibold text-5xxl -mb-2">
                        {data?.seller_reviews?.average_rating}
                      </div>
                      <StarRatings
                        starDimension="25px"
                        starEmptyColor="#e3e3e3"
                        starRatedColor={
                          data?.seller_reviews?.average_rating >= 4.5
                            ? "rgb(0,158,0)"
                            : data?.seller_reviews?.average_rating < 4.5 &&
                              data?.seller_reviews?.average_rating >= 4
                            ? "rgb(110, 159, 0)"
                            : data?.seller_reviews?.average_rating < 4 &&
                              data?.seller_reviews?.average_rating >= 3.5
                            ? "rgb(243, 153, 22)"
                            : "rgb(246,90,31)"
                        }
                        starSpacing="0"
                        rating={
                          data?.seller_reviews?.average_rating &&
                          Number(data?.seller_reviews?.average_rating)
                        }
                      />
                      <div className="text-d14">
                        Based on <span>{data?.seller_reviews?.total} </span>
                        ratings
                      </div>
                    </div>

                    <div className="flex flex-col w-full mt-5  mobile:mt-0">
                      <div className="flex flex-row w-full items-center space-x-1">
                        <div className="w-2 text-center">5</div>

                        <div>
                          {" "}
                          <AiFillStar
                            className="text-d18 ml-1"
                            style={{
                              color: "rgb(0,158,0)"
                            }}
                          />{" "}
                        </div>
                        <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                          <div
                            className="h-full"
                            style={{
                              backgroundColor: "rgb(0,158,0)",
                              width:
                                (data?.seller_reviews?.grouped_rating["5*"] /
                                  data?.seller_reviews?.total) *
                                  100 +
                                "%"
                            }}
                          ></div>
                        </div>
                        <div className="w-2 text-center opacity-40">
                          ({data?.seller_reviews?.grouped_rating["5*"]})
                        </div>
                      </div>
                      <div className="flex flex-row w-full items-center space-x-1">
                        <div className="w-2 text-center op">4</div>

                        <div>
                          {" "}
                          <AiFillStar
                            className="text-d18 ml-1"
                            style={{
                              color: "rgb(110, 159, 0)"
                            }}
                          />{" "}
                        </div>
                        <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                          <div
                            className="h-full"
                            style={{
                              backgroundColor: "rgb(110, 159, 0)",
                              width:
                                (data?.seller_reviews?.grouped_rating["4*"] /
                                  data?.seller_reviews?.total) *
                                  100 +
                                "%"
                            }}
                          ></div>
                        </div>
                        <div className="w-2 text-center opacity-40">
                          ({data?.seller_reviews?.grouped_rating["4*"]})
                        </div>
                      </div>
                      <div className="flex flex-row w-full items-center space-x-1">
                        <div className="w-2 text-center">3</div>

                        <div>
                          {" "}
                          <AiFillStar
                            className="text-d18 ml-1"
                            style={{
                              color: "rgb(243, 153, 22)"
                            }}
                          />{" "}
                        </div>
                        <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                          <div
                            className="h-full"
                            style={{
                              backgroundColor: "rgb(243, 153, 22)",
                              width:
                                (data?.seller_reviews?.grouped_rating["3*"] /
                                  data?.seller_reviews?.total) *
                                  100 +
                                "%"
                            }}
                          ></div>
                        </div>
                        <div className="w-2 text-center opacity-40">
                          ({data?.seller_reviews?.grouped_rating["3*"]})
                        </div>
                      </div>
                      <div className="flex flex-row w-full items-center space-x-1">
                        <div className="w-2 text-center">2</div>

                        <div>
                          {" "}
                          <AiFillStar
                            className="text-d18 ml-1"
                            style={{
                              color: "rgb(246,90,31)"
                            }}
                          />{" "}
                        </div>
                        <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                          <div
                            className="h-full"
                            style={{
                              backgroundColor: "rgb(246,90,31)",
                              width:
                                (data?.seller_reviews?.grouped_rating["2*"] /
                                  data?.seller_reviews?.total) *
                                  100 +
                                "%"
                            }}
                          ></div>
                        </div>
                        <div className="w-2 text-center opacity-40">
                          ({data?.seller_reviews?.grouped_rating["2*"]})
                        </div>
                      </div>
                      <div className="flex flex-row w-full items-center space-x-1">
                        <div className="w-2 text-center">1</div>

                        <div>
                          {" "}
                          <AiFillStar
                            className="text-d18 ml-1"
                            style={{
                              color: "rgb(246,90,31)"
                            }}
                          />{" "}
                        </div>
                        <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                          <div
                            className="h-full"
                            style={{
                              backgroundColor: "rgb(246,90,31)",
                              width:
                                (data?.seller_reviews?.grouped_rating["*"] /
                                  data?.seller_reviews?.total) *
                                  100 +
                                "%"
                            }}
                          ></div>
                        </div>
                        <div className="w-2 text-center opacity-40">
                          ({data?.seller_reviews?.grouped_rating["*"]})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
             !loading && <div className="w-full flex  justify-center items-center text-d28 mt-12">
                {" "}
                {/* No Reviews Available */}
              </div>
            )}
          </div>
          <div className="hidden mobile:block w-full py-5 ">
            <div className="flex justify-between text-d22 pr-semibold px-2 py-3">
              All products by this seller
              <Link
                href={`/${
                  data?.social_data?.name &&
                  slugify(data?.social_data?.name) + "/s=" + id
                }`}
              >
                <h1 className="font-bold text-xs border px-2 py-1 cursor-pointer hover:opacity-80">
                  VIEW ALL
                </h1>
              </Link>
            </div>
            <Slider {...settings}>
              {data?.products.map((item) => [<SingleProduct item={item} />])}
            </Slider>
          </div>
          <div className=" mobile:hidden pb-5">
            <div className="text-d16 pr-semibold   px-5 flex justify-between  py-5">
              All products by this seller{" "}
              <Link
                href={`/${
                  data?.social_data?.name &&
                  slugify(data?.social_data?.name) + "/s=" + id
                }`}
              >
                <h1 className="font-bold text-xs border px-2 py-1 cursor-pointer hover:opacity-80">
                  VIEW ALL
                </h1>
              </Link>
            </div>
            <div className="flex overflow-x-scroll overflow-hidden pr-6">
              {data?.products.map((item) => [
                <div>
                  <SingleProduct scroll={true} item={item} />
                </div>
              ])}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
