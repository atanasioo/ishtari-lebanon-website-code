import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const [loading, setLoading] = useState(false);
  const [topSelling, setTopSelling] = useState([]);

  const host = useContext(HostContext);

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
    speed: 500,
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
        className="mySwiper "
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

  useEffect(() => {
    if (window.innerWidth > 1024 && typeof selectedTopCategory.category_id !== "undefined") {
      setLoading(true);
      axiosServer
        .get(
          buildLink("getTopSellingByCategoryId", undefined, window.innerWidth) +
            "&category_id=" +
            selectedTopCategory.category_id
        )
        .then((response) => {
          if (typeof response.data.data.products !== "undefined" && response.data.data.products.length > 0 ) {
            setTopSelling(response.data.data.products);
          }else{
            setTopSelling([]);
          }
          setLoading(false);
        });
    }
  }, [selectedTopCategory]);


  return (
    <div>
      {/* Subcategories' menu */}

      {viewSubAllCategories2 && (
        <div
          className="relative container"
          onMouseEnter={() => {
            handleState("viewSubAllCategories2", true);
            handleState("overlay", true);
          }}
        >
          <div className="absolute top-0 z-40">
            <div>
              <div className="flex">
                <div className="bg-dsearchGrey py-3 w-284px">
                  {allCategories?.map((category) => (
                    <div
                      key={category.category_id}
                      onMouseEnter={() => {
                        handleState("selectedTopCategory", category);
                        // getTopSelling(category.category_id);
                      }}
                    >
                      <Link
                        href={`/${slugify(category.name)}/c=${
                          category.category_id
                        }`}
                        onClick={() => setMarketingData({})}
                        className="flex items-center py-1 hover:text-dblue px-4"
                      >
                        <Image
                          alt={category.name}
                          src={category.image}
                          width={40}
                          height={40}
                        />
                        <span
                          className="ml-3 font-light text-d13"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(category.name),
                          }}
                        ></span>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="bg-white px-4" style={{ width: "500px" }}>
                  <div className="flex item-center justify-between py-5 border-b border-dinputBorder mb-2">
                    <h2
                      className=" font-semibold"
                      dangerouslySetInnerHTML={{
                        __html: selectedTopCategory.name,
                      }}
                    ></h2>
                    <Link
                      className="text-dblue text-sm"
                      href={`/category/${selectedTopCategory.category_id}`}
                      onClick={() => setMarketingData({})}
                    >
                      <span>View All </span>
                      <i className="icon icon-angle-right"></i>
                    </Link>
                  </div>
                  {selectedTopCategory?.categories &&
                    selectedTopCategory["categories"]?.map((sub_category) => (
                      <Link
                        key={Math.random()}
                        href={`/category/${sub_category.category_id}`}
                        className=" flex items-center py-1 hover:bg-dsearchGrey"
                        onClick={() => setMarketingData({})}
                      >
                        <Image
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
                    ))}

                  {loading ? (
                    <PointsLoader />
                  ) : (
                    topSelling.length > 0 && (
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
                          >
                            Explore Top Selling Products
                          </Link>
                          <i className="icon icon-angle-right"></i>
                        </div>
                        <div className="w-full">
                          <Slider {...settings}>
                            {topSelling?.slice(0, 10).map((item) => (
                              <div key={item.product_id}>
                                <SingleProduct item={item} topSelling={true} />
                              </div>
                            ))}
                            {topSelling?.slice(10).map((item) => (
                              <div key={item.product_id}>
                                <SingleProduct item={item} topSelling={true} />
                              </div>
                            ))}
                          </Slider>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu category */}

      <div className="absolute bg-dsearchGrey w-screen z-40">
        {viewMenuCategories2 && selectedMenuCategory2 && (
          <div
            className="container"
            onMouseEnter={() => {
              //setViewMenuCategories2(true);
              handleState("viewMenuCategories2", true);
              // setOverlay(true);
              handleState("overlay", true);
            }}
            onMouseLeave={() => {
              // setViewSubAllCategories2(false);
              handleState("viewSubAllCategories2", false);
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
                      selectedMenuCategory2["top-category"].name?.toUpperCase()
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
                        <Image
                          src={`${host.host}/image/${banner.image}`}
                          width={600}
                          height={400}
                          alt={banner.image.name}
                          title={banner.image.name}
                          style={{ width: "100%", height: "350px" }}
                          priority="true"
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
  );
}

export default DesktopMenuClientPopups;
