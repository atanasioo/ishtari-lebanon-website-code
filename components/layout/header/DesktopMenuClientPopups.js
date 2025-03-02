import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { slugify } from "@/components/Utils";
import { sanitizeHTML } from "@/components/Utils";
import { useRouter } from "next/router";
import { useMarketingData } from "@/contexts/MarketingContext";
import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import SingleProduct from "@/components/product/SingleProduct";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { HostContext } from "@/contexts/HostContext";
import PointsLoader from "@/components/PointsLoader";
import Cookies from "js-cookie";
import { HiChevronRight } from "react-icons/hi";
import { FaAngleUp, FaArrowUp, FaSortUp } from "react-icons/fa";

function DesktopMenuClientPopups(props) {
  const {
    viewMenuCategories2,
    viewSubAllCategories2,
    selectedMenuCategory2,
    handleState,
    allCategories,
    selectedTopCategory,
    overlay,
  } = props;

  // console.log(props)
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [categoryLatest, setCategoryLatest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topSelling, setTopSelling] = useState([]);
  const [hover, setHover] = useState(false);
  const { host } = useContext(HostContext);

  const types = {
    1: "product",
    2: "category",
    3: "manufacturer",
    4: "seller",
  };

  const settings = {
    slidesPerRow: 3,
    rows: 2,
    infinite: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesPerRow: 1,
          rows: 2,
        },
      },
    ],
    arrows: true,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />,
  };

  function CustomPrevArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px", marginLeft: "15px" }}
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
        style={{ ...style, padding: "2px 15px", marginRight: " 15px" }}
        onClick={onClick}
        className="mySwiper"
      >
        <div className="swiper-button-next flex justify-center items-center cursor-pointer">
          <BsChevronRight className="text-dblack" />
        </div>
      </div>
    );
  }

  const router = useRouter();
  const { setMarketingData } = useMarketingData();
  const path = "";

  async function getTopSelling(category) {
    if (
      (window.location.host === "www.ishtari.com" ||
        window.location.host === "next.ishtari.com" ||
        window.location.host === "localhost:3000" ||
        window.location.host === "next.ishtari.com.gh" ||
        window.location.host === "ishtari.com.gh" ||
        window.location.host === "ishtari-mobile.com" ||
        Cookies.get("site-local-name") === "ishtari") &&
      window.innerWidth > 1024 &&
      category &&
      viewSubAllCategories2 &&
      typeof category !== "undefined"
    ) {
      setHover(false);
      setLoading(true);
      if (category) {
        var myObject = localStorage.getItem("topSelling-" + category);
        const myObjectParse = JSON.parse(myObject);
        if (
          category &&
          (myObjectParse == null ||
            myObjectParse == undefined ||
            myObjectParse == [])
        ) {
          await axiosServer
            .get(
              buildLink(
                "getAllTopSellingbyCategoryid",
                undefined,
                window.innerWidth
              ) +
                "&category_id=" +
                category +
                "&limit=20"
            )
            .then((response) => {
              if (
                typeof response.data.data?.products !== "undefined" &&
                response.data.data.products.length > 0
              ) {
                setTopSelling(response.data.data.products);

                localStorage.setItem(
                  "topSelling-" + category,
                  JSON.stringify(response.data.data.products)
                );
              } else {
                localStorage.setItem(
                  "topSelling-" + category,
                  JSON.stringify([])
                );
                setTopSelling([]);
              }
              setLoading(false);
            });
        } else {
          setTopSelling(myObjectParse);
          setLoading(false);
        }
      }
    }
  }

  useEffect(() => {
    if (selectedTopCategory) {
      getTopSelling(selectedTopCategory.category_id);
      getCategoryLatest(selectedTopCategory.category_id);
    }
  }, [selectedTopCategory, viewMenuCategories2, viewSubAllCategories2]);

  const handleMouseLeave = () => {
    setHover(false);
    setTopSelling([]);
    setCategoryLatest([]);
    // You can perform additional actions here when the mouse leaves the div.
  };

  const getCategoryLatest = (category_id) => {
    var myObject = localStorage.getItem(
      "latestTopSelling-" + selectedTopCategory.category_id
    );
    if (myObject && myObject?.length > 0) {
      setCategoryLatest(JSON.parse(myObject));
    } else {
      setLoadingLatest(true);
      axiosServer
        .get(
          buildLink("dynamicproducts", undefined, undefined) +
            "latest&nourtest&category_id=" +
            category_id
        )
        .then((response) => {
          // console.log(response);
          if (response.data.success) {
            setCategoryLatest(response.data.data.products);
            localStorage.setItem(
              "latestTopSelling-" + selectedTopCategory.category_id,
              JSON.stringify(response.data.data.products)
            );
          }
          setLoadingLatest(false);
        });
    }
  };

  return (
    <>
      {/* Subcategories' menu */}

      <div className=" w-screen bg-white ">
        {selectedTopCategory && (
          <div
            className={`  relative px-5 `}
            onMouseEnter={() => {
              handleState("viewSubAllCategories2", true);
              handleState("overlay", true);
            }}
          >
            <div
              className={`absolute overflow-hidden duration-800 ease-in-out left-5 transition-all ${
                viewSubAllCategories2
                  ? "h-fit z-40 top-0 opacity-100"
                  : "h-0 top-10 opacity-0 -z-40"
              }`}
            >
              <div className=" relative ">
                <div className=" ml-36  translate-y-3">
                  <FaSortUp className="text-xl text-dsearchGrey" />
                </div>
                <div className="flex w-full bg-white rounded-md relative overflow-auto ">
                  <div className="bg-dsearchGrey py-3 w-fit  max-h-[600px]   overflow-auto">
                    {allCategories?.map((category) => (
                      <div
                        key={category.category_id}
                        onMouseEnter={() => {
                          //   getCategoryLatest(category.category_id)
                          //  getTopSelling(category)
                          handleState("selectedTopCategory", category);
                          // getTopSelling(category.category_id);
                          // getCategoryLatest(category.category_id)
                        }}
                      >
                        <Link
                          href={`/${slugify(category.name)}/c=${
                            category.category_id
                          }`}
                          onClick={() =>
                            setMarketingData({
                              ignore: false,
                              banner_image_id: "",
                              source_type: "categories",
                              source_type_id: "",
                            })
                          }
                          className="flex items-center py-1 hover:text-dblue px-4"
                        >
                          <img
                            alt={category.name}
                            src={category.image}
                            width={40}
                            height={40}
                          />
                          <div className=" w-full flex justify-between flex-row  gap-4">
                            <span
                              className="ml-3 font-light text-d13"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHTML(category.name),
                              }}
                            ></span>
                            <span>
                              <HiChevronRight />
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="flex divide-x-2 divide-dgrey gap-4 flex-row pl-2  max-h-[600px] w-fit overflow-auto">
                    <div className=" bg-white">
                      <div className="flex item-center w-[300px] justify-between py-5 border-b border-dinputBorder mb-2">
                        <h2
                          className=" font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: selectedTopCategory.name,
                          }}
                        ></h2>
                        <Link
                          className="text-dblue text-sm"
                          href={`/category/${selectedTopCategory.category_id}`}
                          onClick={() =>
                            setMarketingData({
                              ignore: false,
                              banner_image_id: "",
                              source_type: "categories",
                              source_type_id: "",
                            })
                          }
                        >
                          <span>View All </span>
                          <i className="icon icon-angle-right"></i>
                        </Link>
                      </div>
                      {selectedTopCategory?.categories &&
                        selectedTopCategory["categories"]?.map(
                          (sub_category) => (
                            <Link
                              key={Math.random()}
                              href={`/category/${sub_category.category_id}`}
                              className=" flex items-center py-1 hover:bg-dsearchGrey"
                              onClick={() =>
                                setMarketingData({
                                  ignore: false,
                                  banner_image_id: "",
                                  source_type: "categories",
                                  source_type_id: "",
                                })
                              }
                            >
                              <img
                                alt={sub_category.name}
                                src={sub_category.image}
                                width={35}
                                height={35}
                              />
                              <span
                                className="ml-3 font-light text-xs"
                                dangerouslySetInnerHTML={{
                                  __html: sub_category.name,
                                }}
                              ></span>
                            </Link>
                          )
                        )}
                    </div>
                    <div
                      // onMouseLeave={handleMouseLeave}

                      className=" w-[600px]  px-5"
                    >
                      <div>
                        <div className="flex items-center mt-4 text-dblack">
                          <Link
                            href={{
                              pathname: "/categoryTopSelling",
                              query: {
                                category_id: selectedTopCategory.category_id,
                              },
                            }}
                            className="pr-semibold cursor-pointer hover:text-dblue"
                            // onMouseEnter={() => setHover(true)}
                          >
                            Explore Top Selling Products
                          </Link>
                          <i className="icon icon-angle-right"></i>
                        </div>
                        {loading ? (
                          <PointsLoader />
                        ) : (
                          topSelling.length > 0 && (
                            <div className="w-full ">
                              <Slider {...settings}>
                                {topSelling?.slice(0, 10).map((item) => (
                                  <div key={item.product_id}>
                                    <SingleProduct
                                      item={item}
                                      topSelling={true}
                                      carousel={true}
                                    />
                                  </div>
                                ))}
                                {topSelling?.slice(10).map((item) => (
                                  <div key={item.product_id}>
                                    <SingleProduct
                                      item={item}
                                      topSelling={true}
                                      carousel={true}
                                    />
                                  </div>
                                ))}
                              </Slider>
                            </div>
                          )
                        )}
                        <div className="">
                          <div className="flex items-center mt-4 text-dblack pb-4">
                            <Link
                              href={{
                                pathname: "/latest",
                              }}
                              className="pr-semibold cursor-pointer hover:text-dblue"
                              // onMouseEnter={() =>
                              //   getCategoryLatest(selectedTopCategory.category_id)
                              // }
                            >
                              Explore{" "}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHTML(
                                    selectedTopCategory.name
                                  ),
                                }}
                              ></span>{" "}
                              Latest Products
                            </Link>
                            <i className="icon icon-angle-right"></i>
                          </div>
                          {loadingLatest ? (
                            <PointsLoader />
                          ) : (
                            categoryLatest.length > 0 && (
                              <div className="w-full">
                                <Slider {...settings}>
                                  {categoryLatest?.slice(0, 10).map((item) => (
                                    <div key={item.product_id}>
                                      <SingleProduct
                                        item={item}
                                        topSelling={true}
                                        carousel={true}
                                      />
                                    </div>
                                  ))}
                                  {categoryLatest?.slice(10).map((item) => (
                                    <div key={item.product_id}>
                                      <SingleProduct
                                        item={item}
                                        topSelling={true}
                                        carousel={true}
                                      />
                                    </div>
                                  ))}
                                </Slider>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu category */}

        <div
          className={`absolute transition-all   rounded-b-md duration-500 h-fit  overflow-hidden ${
            viewMenuCategories2 && selectedMenuCategory2
              ? " opacity-100 top-12"
              : " opacity-30 top-20"
          } bg-dsearchGrey w-screen z-40`}
        >
          {viewMenuCategories2 && selectedMenuCategory2 && (
            <div
              className="px-9 max-h-[600px] overflow-auto"
              onMouseEnter={() => {
                //setViewMenuCategories2(true);
                handleState("viewMenuCategories2", true);
                // setOverlay(true);
                handleState("overlay", true);
              }}
              onMouseLeave={() => {
                // setViewSubAllCategories2(false);
                // handleState("viewSubAllCategories2", false); //might cause a prob
                handleState("overlay", false);
                // setViewMenuCategories2(false);
                handleState("viewMenuCategories2", false);
              }}
              style={{ borderTop: "1px solid rgb(226, 229, 241)" }}
            >
              <div className="flex py-6 px-10">
                <div className="pl-4 w-2/12">
                  <Link
                    href={`/${slugify(
                      selectedMenuCategory2["top-category"].name
                    )}/c=${selectedMenuCategory2["top-category"].category_id}`}
                    className="font-semibold mb-4"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(
                        selectedMenuCategory2[
                          "top-category"
                        ].name?.toUpperCase()
                      ),
                    }}
                    onClick={() => setMarketingData({})}
                  ></Link>
                  {selectedMenuCategory2["sub-categories"]?.map((category) => (
                    <Link
                      key={category.category_id}
                      className="block text-sm py-2 hover:text-dblue "
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(category.name),
                      }}
                      href={`/${slugify(category.name)}/c=${
                        category.category_id
                      }`}
                      onClick={() => setMarketingData({})}
                    ></Link>
                  ))}
                </div>
                {/* brands */}
                <div className={`flex space-x-1 w-10/12 ml-10`}>
                  {selectedMenuCategory2["partitions"]?.map((ban) => (
                    <div className={`p-0 `} key={Math.random()}>
                      {ban?.banners?.map((banner) => (
                        <div
                          className={` cursor-pointer `}
                          key={Math.random()}
                          onClick={() =>
                            router.push(
                              `${path}/${slugify(banner.name)}/${types[
                                banner.mobile_type
                              ].slice(0, 1)}=${banner.mobile_type_id}`
                            )
                          }
                        >
                          <img
                            src={`${host}/image/${banner.image}`}
                            width={600}
                            height={400}
                            alt={banner.image.name}
                            title={banner.image.name}
                            style={{ width: "100%", height: "350px" }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DesktopMenuClientPopups;
