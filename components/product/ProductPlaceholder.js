import Link from "next/link";
import React from "react";
import { BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";
import SmallArrows from "./SmallArrows";
import useDeviceSize from "../useDeviceSize";
import { FiChevronDown } from "react-icons/fi";

function ProductPlaceholder() {
  const [width] = useDeviceSize();

  const setting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.8,
    slidesToScroll: 3,
    swipeToSlide: false,
    autoplay: false,
    vertical: true,
    prevArrow: <SmallArrows direction={"u"} />,
    nextArrow: <SmallArrows direction={"d"} />,
  };

  const mobileSetting = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: width > 375 ? 4 : width > 300 ? 3 : 2,
    slidesToScroll: 2,
    autoplay: false,
    variableWidth: true,
    className: "slider variable-width",
  };

  return (
    <div className="product-page-wrapper bg-[#f8f8f9]">
      <div>
        <div className="flex flex-col px-2 mx-auto">
          <div className="breadcrumbs py-3 hidden md:block">
            <div className="flex items-center">
              <div className="flex items-center">
                <Link
                  href={"/"}
                  className="text-dblack font-light truncate text-d11 md:text-sm mr-2"
                >
                  Home
                </Link>
                <BsChevronRight className="hidden sm:block icon icon-angle-right text-d11 md:text-xs text-dgrey1" />

                <Link
                  href={`/`}
                  className="hidden md:block text-dblack font-light truncate text-d11 md:text-sm mx-2"
                ></Link>
              </div>
            </div>
          </div>
          <div
            className={` bg-white product-div flex items-stretch  w-full md:px-2`}
          >
            <div className="flex flex-col md:flex-row py-3 pr-2 w-full md:w-3/4">
              <div className="product-zoom w-full md:w-6/12">
                <div className="h-full">
                  <div className="flex flex-col-reverse md:flex-row sticky top-0 z-10">
                    <div
                      id="selector_div"
                      className="selector_div w-full my-2 md:w-[35%] lg:w-2/12 md:pr-2"
                    >
                      <div className="selectors overflow-hidden overflow-y-hidden h-full  whitespace-pre md:whitespace-normal">
                        <Slider {...setting} className="hidden md:block">
                          {Array.from({ length: 8 }, (_, index) => (
                            <div
                              key={index}
                              className={` flex justify-center mt-2 mr-4 rounded-md cursor-pointer transition-all ease-in-out outline-none `}
                            >
                              <img
                                src={"/images/product_placeholder.png"}
                                alt="product image"
                                width={80}
                                height={120}
                                onClick={() => changeImage(i)}
                                className={`cursor-pointer border-2  border-dgreyZoom`}
                              />
                            </div>
                          ))}
                        </Slider>
                        <Slider {...mobileSetting} className={`md:hidden`}>
                          {Array.from({ length: 8 }, (_, index) => (
                            <div
                              key={index}
                              className={` flex justify-center mt-2 mr-4 cursor-pointer transition-all ease-in-out outline-none`}
                            >
                              <img
                                src={"/images/product_placeholder.png"}
                                alt="product image"
                                width={80}
                                height={120}
                                className={`cursor-pointer border-2 border-dgreyZoom `}
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3 lg:w-10/12 relative flex items-center ">
                      <div className="w-full md:w-11/12 md:hover:cursor-zoom-in relative">
                        <div>
                          <img
                            src="/images/product_placeholder_square.png"
                            width={500}
                            height={680}
                            className="rounded-lg myimage-product-zoom"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-info w-full md:w-6/12 px-4">
                <h1
                  className="text-dblack font-semibold text-d22 mb-3 leading-pn"
                  //   dangerouslySetInnerHTML={{
                  //     __html: sanitizeHTML(data.name),
                  //   }}
                >
                  product name
                </h1>
                <div className="mb-3 product-info">
                  <div className="mb-3">
                    <div className="product-model-rating mb-3 text-d14 text-dgreyProduct flex flex-wrap items-center">
                      <div className="modelNumber mr-1.5">Model Number:</div>
                      <div className="ml-2 w-24 h-4 bg-dplaceHolder animate-pulse">
                        {" "}
                      </div>
                    </div>
                    <div className="product-price">
                      <div className="flex items-center mb-3">
                        <div className="mr-9 text-d14 text-dblack">Price:</div>
                        <div className="ml-2 w-24 h-4 bg-dplaceHolder animate-pulse">
                          {" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Add to cart */}

                  <div className="flex text-d15 mt-4">
                    <div className="w-16 font-semibold">Quantity</div>
                    <div className="ml-2 w-24 h-4 bg-dplaceHolder animate-pulse">
                        {" "}
                      </div>
                  </div>

                  <div className={`flex items-center mt-4 mb-4 `}>
                    <div className="qty-picker font-semibold cursor-pointer">
                      <div className="relative box-border">
                        <div className="flex items-center justify-center border border-dgreyQtyProduct rounded-md relative h-12 py-2 px-1.5">
                          <div className="mx-3">1</div>
                          <div className="flex items-center">
                            <div
                              style={{ width: "1px" }}
                              className="dividor h-7 bg-dgreyQtyProduct "
                            ></div>
                            <div className="px-1">
                              <FiChevronDown
                                className="text-dgreyQtyProduct h-6 w-6"
                                style={{
                                  // transform: toggleQty ? "rotate(-180deg)" : "",
                                  transition: "transform 0.2s ease",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className={` text-white animate-pulse flex-grow h-12 relative  ml-1flex items-center justify-center rounded-md bg-dblue mx-1 hover:bg-dbluedark `}
                    >
                      <span>
                        <div>
                          <span className=""> </span>
                        </div>
                      </span>{" "}
                    </button>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
            <div className="pl-3 hidden md:block border-l border-dborderProduct w-1/4">
              {/* EXTRA */}
              {/* admin div */}

              <div className="hidden md:flex-row w-1/2 md:w-full md:flex  md:items-center text-dblack py-6">
                <div className="w-16 bg-dbase py-2 animate-pulse" />
                <div className="ml-2 w-full py-4 bg-dplaceHolder animate-pulse"></div>
              </div>
              <div className="hidden md:flex-row w-1/2 md:w-full md:flex  md:items-center text-dblack py-6">
                <div className="w-16 bg-dbase py-2 animate-pulse" />
                <div className="ml-2 w-full py-4 bg-dplaceHolder animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPlaceholder;
