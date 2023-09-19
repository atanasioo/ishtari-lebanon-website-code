import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Slider from "react-slick";
// import SmallArrows from "../components/SmallArrows";
//  import { useProductContext } from "@/contexts/ProductContext";

import DOMPurify from "dompurify";
import useDeviceSize from "@/components/useDeviceSize";
function ProductPlaceholder({ item }) {

  const [width, height] = useDeviceSize();

  const [quantity, setQuantity] = useState(1);
  const temp = [0, 0, 0, 0, 0];
  // const contextValue = useProductContext();
  // console.log('contextValue:', contextValue);
  // const { productNotFoundd } = contextValue; // Ensure this is valid
  const setting = {
    dots: false,
    infinite: false,
    speed: 100,
    slidesToShow: 3.15,
    slidesToScroll: 3,
    autoplay: false,
    vertical: true,
    prevArrow: <SmallArrows direction={"u"} />,
    nextArrow: <SmallArrows direction={"d"} />,
  };

  const mobileSetting = {
    dots: false,
    infinite: false,
    speed: 100,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: false,
  };



  return (
    !productNotFoundd && (
      <div className="relative">
        <div
          className={`w-screen bg-white ${width > 650 && "overflow-hidden"}`}
        >
          <div className="  container text-dblack  ">
            <div className="pl-2 py-2 md:pt-2  md:pb-5 flex items-center">
              <div
                className="hidden md:block text-dblack font-light truncate text-d11 md:text-tiny mr-2 hover:text-dblue"
                dangerouslySetInnerHTML={{
                  __html: "Home",
                }}
              />
              {width > 650 && (
                <i className="icon icon-angle-right text-d11 md:text-tiny text-dgrey1" />
              )}

              <div className="hidden md:block animate-pulse w-5 h-3 text-dblack font-light truncate text-d11 md:text-tiny mx-2 hover:text-dblue"></div>
            </div>

            <div className="flex-row md:flex ">
              {/* Photo */}
              <div className="w-full  md:w-5/12">
                {/* 52887 */}
                {item?.images?.length > 0 ? (
                  <div className=" flex flex-wrap flex-col-reverse md:flex-row">
                    <div
                      id="selector_div"
                      className=" selector_div w-full mb-2 md:w-2/12 md:pr-2  "
                    >
                      <div className="selectors overflow-hidden overflow-y-hidden h-full  whitespace-pre md:whitespace-normal ">
                        {width > 768 ? (
                          <Slider {...setting}>
                            {item?.images?.map((i) => (
                              <img
                                srcSet={i["thumb"]}
                                src={i["thumb"]}
                                alt=""
                                className="sideImgBlur"
                                key={item?.product_id}
                              />
                            ))}
                          </Slider>
                        ) : (
                          <Slider {...mobileSetting}>
                            {item?.images?.map((i) => (
                              <img
                                srcSet={i["thumb"]}
                                src={i["thumb"]}
                                alt=""
                                className="sideImgBlur"
                                key={item?.product_id}
                              />
                            ))}
                          </Slider>
                        )}
                      </div>
                    </div>
                    <div className="w-full md:w-10/12">
                      <img
                        src={item?.thumb}
                        alt=""
                        className="rounded-lg blurProduct"
                        style={{ width: "490px", height: "600px" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className=" flex flex-wrap flex-col-reverse md:flex-row">
                    <div
                      id="selector_div"
                      className=" selector_div w-full mb-2 md:w-2/12 md:pr-2  "
                    >
                      <div className="selectors overflow-hidden overflow-y-hidden h-full  whitespace-pre md:whitespace-normal ">
                        {width > 768 ? (
                          <Slider {...setting}>
                            {temp.map((i) => (
                              <div className="rounded-lg animate-pulse bg-dplaceHolder  w-20 h-32 " key={Math.random()}/>
                            ))}
                          </Slider>
                        ) : (
                          <Slider {...mobileSetting}>
                            {temp.map((i) => (
                              <div className="rounded-lg animate-pulse bg-dplaceHolder "  key={Math.random()}/>
                            ))}
                          </Slider>
                        )}
                      </div>
                    </div>
                    <div className="w-full md:w-10/12">
                      {item?.thumb ? (
                        <img
                          src={item?.thumb}
                          alt=""
                          className="rounded-lg w-full blurProduct"
                          style={{ height: "600px" }}
                        />
                      ) : (
                        <div
                          className="rounded-lg w-full bg-dplaceHolder animate-pulse"
                          style={{ minHeight: "600px" }}
                        ></div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* info */}
              <div
                className=" 
                    px-3
                    inline-block
                    w-full
                    2xl:w-4/12
                    xl:w-4/12
                    lg:w-4/12
                    md:w-4/12"
              >
                {/* BRAND NAME */}
                <div className="text-dgrey1 hover:text-dblue">
                  {item?.manufacturer_name?.toUpperCase()}
                </div>
                {item?.name ? (
                  <h1
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item?.name)
                    }}
                    className="font-semibold text-dblack h-10 text-lg md:text-d22 mb-1 md:mb-3"
                  />
                ) : (
                  <div className="w-full mb-2 h-24 bg-dplaceHolder animate-pulse">
                    {" "}
                  </div>
                )}
                {item?.seller_id > 0 && (
                  <div className=" flex sm:hidden items-center  cursor-pointer mr-5 md:mr-0 hover:opacity-80 py-2 md:py-6">
                    <i className="icon icon-shop text-dbase text-2xl mr-4" />
                    <span className="text-dblack text-sm">Sold by</span>

                    <h1 className="text-dblue underline font-semibold ml-2 text-sm">
                      {item.seller}
                    </h1>
                  </div>
                )}
                {/* Model number */}
                <p className="text-dgrey1 text-d15 mb-1 md:mb-3 flex items-center font-light">
                  Model Number :
                  {
                    <span className="ml-2 w-24 h-4 bg-dplaceHolder animate-pulse">
                      {" "}
                    </span>
                  }
                </p>
                {/* Prices */}
                <div className="mb-3">
                  {item?.special?.length > 0 ? (
                    <div
                      className={
                        width < 650 ? "hidden" : "mb-3 flex items-center"
                      }
                    >
                      <span
                        className={
                          item?.special?.length > 0
                            ? "w-14 text-dblack font-medium text-d11 pr-3 "
                            : "hidden"
                        }
                      >
                        Was:
                      </span>
                      <div className="ml-2 w-24 h-4 bg-dplaceHolder animate-pulse">
                        {" "}
                      </div>
                    </div>
                  ) : (
                    <div className="w-52 my-2 h-4 bg-dplaceHolder animate-pulse">
                      {" "}
                    </div>
                  )}

                  <div className="mb-3 flex items-center">
                    <span className="hidden md:block w-14 text-dblack font-medium md:text-d13 pr-3 ">
                      Now:
                    </span>
                    <div className="ml-2 w-24 h-4 bg-dplaceHolder animate-pulse">
                      {" "}
                    </div>
                    <span
                      className={
                        width < 650 && item?.special?.length > 0
                          ? "ml-5 line-through text-dgrey1 text-sm font-light"
                          : "hidden"
                      }
                    >
                      {item?.price}
                    </span>
                  </div>
                  <div
                    className={width < 650 ? "none" : "mb-3 flex items-center"}
                  >
                    {item?.special?.length > 0 ? (
                      <span
                        className={
                          item?.special?.length > 0
                            ? "w-14 text-dblack font-medium text-d13 pr-3"
                            : "invisible"
                        }
                      >
                        Saving:
                      </span>
                    ) : (
                      <div className="w-14 h-4 bg-dplaceHolder animate-pulse">
                        {" "}
                      </div>
                    )}

                    {item?.special?.length > 0 && item?.saving ? (
                      <span
                        className={
                          item?.special?.length > 0
                            ? "bg-dgreenop text-dgreen font-semibold px-2 text-xs"
                            : "invisible"
                        }
                      >
                        {item?.saving + "% OFF"}
                      </span>
                    ) : (
                      <div className="w-11 ml-2 h-4 bg-dgreen animate-pulse"></div>
                    )}
                  </div>
                </div>
                {/* Add to cart */}
                {item?.quantity <= 5 && (
                  <div className="flex text-d15 mt-4">
                    <div className="w-16 font-semibold">Quantity</div>
                    <div className="text-dbase ml-2">
                      Low stock: only {item?.quantity} left
                    </div>
                  </div>
                )}
                <div
                  className={`flex mb-4 ${
                    item?.quantity <= 5 ? "mt-1" : "mt-4"
                  }`}
                >
                  <input
                    type="number"
                    defaultValue={quantity}
                    className={`${item?.quantity === "0" && "hidden"}
                                            border
                                            w-16
                                            h-12
                                            rounded
                                            animate-pulse
                                            text-dblack text-center
                                            border-dgrey1
                                            text-xl
                                            `}
                  />
                  <button
                    className={` text-white flex-grow h-12 relative rounded  ${
                      item?.quantity === "0"
                        ? "bg-dbase"
                        : "bg-dblue hover:bg-dbluedark"
                    }  w-full flex items-center justify-center animate-pulse rounded-md text-white mx-1 `}
                  ></button>
                </div>
                {/* Options */}
                {item?.options && item.options?.length > 0 && (
                  <div className="my-1 md:my-4">
                    <div className="flex">
                      <h2 className="w-1/2">{item["options"]["0"]["name"]}</h2>
                    </div>{" "}
                    <div className="flex flex-wrap ">
                      {item["options"]["0"]["option_value"].map((option) => (
                        <div className="mr-3" key={Math.random()}>
                          <p className="text-xs text-center">
                            {option["name"]}
                          </p>
                          <div
                            key={option.image}
                            className={`p-1 border  m-2 cursor-pointer hover:shadow w-10 h-12 md:w-12 md:h-12 rounded relative border-dgrey`}
                          >
                            {option.quantity === "0" && (
                              <div className=" bg-dgrey bg-opacity-50 w-full h-full absolute top-0 left-0 flex items-center justify-center cursor-not-allowed">
                                <div className=" text-dblack text-4xl font-bold">
                                  X
                                </div>
                              </div>
                            )}
                            <LazyLoadImage
                              src={option["image"]}
                              key={option.image}
                              alt={"Option"}
                              placeholdersrc="https://www.sari3.com/ishtaridemo/product_placeholder.png"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Extra */}
              <div className="mt-4 md:mt-0 flex-row space-x-1 md:space-x-0 w-full md:w-3/12 px-3 md:border-dinputBorder md:border-l md:self-start pb-4 md:pb-0">
                {item?.seller_id > 0 ? (
                  <div className="hidden md:flex-row w-1/2 md:w-full md:flex  md:items-center text-dblack py-6">
                    <div className="w-16 bg-dbase py-2 animate-pulse" />
                    <div className="ml-2 w-full py-4 bg-dplaceHolder animate-pulse"></div>
                  </div>
                ) : (
                  <div className="hidden md:flex-row w-1/2 md:w-full md:flex  md:items-center text-dblack py-6">
                    <div className="w-16 bg-dbase py-2 animate-pulse" />
                    <div className="ml-2 w-full py-4 bg-dplaceHolder animate-pulse"></div>
                  </div>
                )}
                <div className="hidden md:flex-row w-1/2 md:w-full md:flex  md:items-center text-dblack py-6">
                  <div className="w-16 bg-dbase py-2 animate-pulse" />
                  <div className="ml-2 w-full py-4 bg-dplaceHolder animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default ProductPlaceholder;
